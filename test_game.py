import os
from playwright.sync_api import sync_playwright

OUTPUT_DIR = r"c:\Users\123\Desktop\创业模拟器\dogfood-output"
SCREENSHOTS_DIR = os.path.join(OUTPUT_DIR, "screenshots")
URL = "http://localhost:8000"

console_errors = []
console_logs = []
page_errors = []
failed_requests = []

def handle_console(msg):
    log_entry = f"[{msg.type}] {msg.text}"
    console_logs.append(log_entry)
    if msg.type in ["error", "warning"]:
        console_errors.append(log_entry)
        print(f"Console {msg.type}: {msg.text}")

def handle_page_error(error):
    page_errors.append(str(error))
    print(f"Page error: {error}")

def handle_request_failed(request):
    if request.failure:
        failed_requests.append({
            "url": request.url,
            "failure": request.failure
        })
        print(f"Request failed: {request.url} - {request.failure}")

def take_screenshot(page, name):
    path = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
    page.screenshot(path=path, full_page=True)
    print(f"Screenshot saved: {path}")
    return path

def check_image_loaded(page, selector):
    """检查图片是否成功加载"""
    return page.evaluate(f"""
        (selector) => {{
            const img = document.querySelector(selector);
            if (!img) return false;
            return img.complete && img.naturalHeight !== 0;
        }}
    """, selector)

def check_background_image_loaded(page, selector):
    """检查背景图片是否成功加载"""
    return page.evaluate(f"""
        (selector) => {{
            const el = document.querySelector(selector);
            if (!el) return false;
            const bgImage = window.getComputedStyle(el).backgroundImage;
            if (!bgImage || bgImage === 'none') return false;
            const urlMatch = bgImage.match(/url\\(["']?(.+?)["']?\\)/);
            if (!urlMatch) return false;
            const url = urlMatch[1];
            return new Promise(resolve => {{
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            }});
        }}
    """, selector)

def test_home_page(page):
    """测试首页"""
    print("\n" + "="*60)
    print("测试 1: 首页验证")
    print("="*60)
    
    results = {}
    
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    take_screenshot(page, "01-home-page")
    
    # 1.1 检查首页背景图
    print("\n1.1 检查首页背景图...")
    bg_loaded = check_background_image_loaded(page, "#screen-select")
    results["home_background"] = bg_loaded
    print(f"  首页背景图: {'✓ 正常' if bg_loaded else '✗ 失败'}")
    
    # 1.2 检查角色卡片数量
    print("\n1.2 检查角色卡片...")
    char_cards = page.locator(".char-card").all()
    results["char_card_count"] = len(char_cards)
    print(f"  角色卡片数量: {len(char_cards)}")
    
    # 1.3 检查每张角色卡片的装饰图
    print("\n1.3 检查角色卡片装饰图...")
    banner_results = []
    for i, card in enumerate(char_cards):
        banner = card.locator(".char-banner")
        if banner.count() > 0:
            bg_loaded = page.evaluate("""
                (el) => {
                    const bgImage = window.getComputedStyle(el).backgroundImage;
                    if (!bgImage || bgImage === 'none') return false;
                    const urlMatch = bgImage.match(/url\\(["']?(.+?)["']?\\)/);
                    if (!urlMatch) return false;
                    const url = urlMatch[1];
                    return new Promise(resolve => {
                        const img = new Image();
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                        img.src = url;
                    });
                }
            """, element=banner.first)
            banner_results.append(bg_loaded)
            char_name = card.locator(".char-name").inner_text()
            print(f"  {char_name} 装饰图: {'✓ 正常' if bg_loaded else '✗ 失败'}")
    results["char_banners"] = banner_results
    results["all_banners_ok"] = all(banner_results)
    
    # 1.4 检查文字可读性
    print("\n1.4 检查文字内容...")
    header_text = page.locator(".header h1").inner_text()
    results["header_text"] = header_text
    print(f"  标题: {header_text}")
    
    # 1.5 点击角色卡片进入游戏
    print("\n1.5 测试点击角色卡片进入游戏...")
    first_card = page.locator(".char-card").first
    first_card.click()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    game_screen_active = page.locator("#screen-game.active").count() > 0
    results["click_to_game"] = game_screen_active
    print(f"  点击进入游戏: {'✓ 成功' if game_screen_active else '✗ 失败'}")
    
    take_screenshot(page, "02-game-page-after-click")
    
    return results

def test_game_main(page):
    """测试游戏主界面"""
    print("\n" + "="*60)
    print("测试 2: 游戏主界面验证")
    print("="*60)
    
    results = {}
    
    # 确保在游戏界面
    if page.locator("#screen-game.active").count() == 0:
        page.goto(URL)
        page.wait_for_load_state('networkidle')
        page.locator(".char-card").first.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1000)
    
    take_screenshot(page, "03-game-main")
    
    # 2.1 检查场景背景图
    print("\n2.1 检查场景背景图...")
    scene_bg = check_background_image_loaded(page, "#scene-layer")
    results["scene_background"] = scene_bg
    print(f"  场景背景图: {'✓ 正常' if scene_bg else '✗ 失败或使用默认背景'}")
    
    # 2.2 检查状态面板
    print("\n2.2 检查状态面板...")
    status_panel = page.locator("#status-panel")
    results["status_panel_visible"] = status_panel.is_visible()
    print(f"  状态面板可见: {'✓ 是' if status_panel.is_visible() else '✗ 否'}")
    
    stat_rows = page.locator(".stat-row").all()
    results["stat_row_count"] = len(stat_rows)
    print(f"  状态项数量: {len(stat_rows)}")
    
    # 2.3 检查对话框
    print("\n2.3 检查对话框...")
    dialog_box = page.locator(".dialog-box")
    results["dialog_visible"] = dialog_box.is_visible()
    print(f"  对话框可见: {'✓ 是' if dialog_box.is_visible() else '✗ 否'}")
    
    # 2.4 检查选项按钮
    print("\n2.4 检查选项按钮...")
    choices = page.locator(".dialog-choices .choice-btn").all()
    results["choice_count"] = len(choices)
    print(f"  选项数量: {len(choices)}")
    
    # 2.5 测试点击一个选项
    if len(choices) > 0:
        print("\n2.5 测试点击选项...")
        first_choice = choices[0]
        first_choice.click()
        page.wait_for_timeout(500)
        
        # 检查反馈弹窗
        modal = page.locator("#feedback-modal.active")
        results["feedback_modal"] = modal.count() > 0
        print(f"  反馈弹窗: {'✓ 显示' if modal.count() > 0 else '✗ 未显示'}")
        
        take_screenshot(page, "04-feedback-modal")
        
        # 点击继续
        if modal.count() > 0:
            page.locator("#modal-continue").click()
            page.wait_for_timeout(500)
            print("  已点击继续按钮")
    
    return results

def test_game_over(page):
    """测试失败界面"""
    print("\n" + "="*60)
    print("测试 3: 失败界面验证")
    print("="*60)
    
    results = {}
    
    # 重新开始游戏
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.locator(".char-card").first.click()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    # 在控制台手动设置资金为 0 来触发失败
    print("\n3.1 通过控制台设置资金为 0 触发失败...")
    page.evaluate("""
        gameState.state.funds = 0;
        renderStatus();
        const gameOverReason = checkGameOver();
        if (gameOverReason) {
            showGameOver(gameOverReason);
        }
    """)
    page.wait_for_timeout(1000)
    
    take_screenshot(page, "05-game-over-screen")
    
    # 3.2 检查失败界面是否显示
    gameover_screen = page.locator("#screen-gameover.active")
    results["gameover_screen"] = gameover_screen.count() > 0
    print(f"  失败界面显示: {'✓ 是' if gameover_screen.count() > 0 else '✗ 否'}")
    
    # 3.3 检查失败背景图
    print("\n3.2 检查失败界面背景图...")
    bg_loaded = check_background_image_loaded(page, "#screen-gameover")
    results["gameover_background"] = bg_loaded
    print(f"  失败背景图(雨夜办公室): {'✓ 正常' if bg_loaded else '✗ 失败'}")
    
    # 3.4 检查失败插画（资金耗尽）
    print("\n3.3 检查资金耗尽插画...")
    illus_loaded = check_image_loaded(page, "#gameover-illustration")
    results["gameover_illustration"] = illus_loaded
    print(f"  资金耗尽插画: {'✓ 正常' if illus_loaded else '✗ 失败'}")
    
    # 3.5 检查按钮
    print("\n3.4 检查失败界面按钮...")
    restart_btn = page.locator(".gameover-actions .pixel-btn.primary")
    back_btn = page.locator(".gameover-actions .pixel-btn").nth(1)
    
    results["restart_button"] = restart_btn.count() > 0 and restart_btn.is_visible()
    results["back_button"] = back_btn.count() > 0 and back_btn.is_visible()
    print(f"  重新挑战按钮: {'✓ 存在' if results['restart_button'] else '✗ 缺失'}")
    print(f"  返回首页按钮: {'✓ 存在' if results['back_button'] else '✗ 缺失'}")
    
    # 3.6 测试返回首页按钮
    print("\n3.5 测试返回首页按钮...")
    back_btn.click()
    page.wait_for_timeout(500)
    home_screen = page.locator("#screen-select.active")
    results["back_to_home"] = home_screen.count() > 0
    print(f"  返回首页: {'✓ 成功' if home_screen.count() > 0 else '✗ 失败'}")
    
    return results

def test_review_page(page):
    """测试复盘界面"""
    print("\n" + "="*60)
    print("测试 4: 复盘界面验证")
    print("="*60)
    
    results = {}
    
    # 重新开始游戏
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.locator(".char-card").first.click()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    
    # 快速通关：直接跳到最后一个节点
    print("\n4.1 快速推进到最后一个节点...")
    page.evaluate("""
        const char = CHARACTERS[gameState.currentCharacter];
        const totalNodes = char.nodes.length;
        
        // 为所有节点做选择
        for (let i = gameState.currentNodeIndex; i < totalNodes; i++) {
            const node = char.nodes[i];
            const choice = node.choices[0]; // 选第一个选项
            
            // 应用效果
            Object.entries(choice.effects).forEach(([stat, value]) => {
                gameState.state[stat] = Math.max(0, Math.min(char.maxState[stat], gameState.state[stat] + value));
            });
            
            // 记录历史
            gameState.history.push({
                nodeIndex: i,
                choiceId: choice.id,
                choiceText: choice.text,
                effects: { ...choice.effects },
                outcome: choice.outcome
            });
        }
        
        gameState.currentNodeIndex = totalNodes;
        showScreen('review');
        renderReview();
    """)
    page.wait_for_timeout(1000)
    
    take_screenshot(page, "06-review-page")
    
    # 4.2 检查复盘界面是否显示
    review_screen = page.locator("#screen-review.active")
    results["review_screen"] = review_screen.count() > 0
    print(f"  复盘界面显示: {'✓ 是' if review_screen.count() > 0 else '✗ 否'}")
    
    # 4.3 检查复盘背景图
    print("\n4.2 检查复盘背景图(时光回溯书房)...")
    bg_loaded = check_background_image_loaded(page, "#screen-review")
    results["review_background"] = bg_loaded
    print(f"  复盘背景图: {'✓ 正常' if bg_loaded else '✗ 失败'}")
    
    # 4.4 检查"你的选择"卡片和徽章
    print("\n4.3 检查「你的选择」卡片...")
    your_card = page.locator(".review-card.yours")
    results["your_card"] = your_card.count() > 0
    print(f"  你的选择卡片: {'✓ 存在' if your_card.count() > 0 else '✗ 缺失'}")
    
    your_badge = your_card.locator(".review-badge")
    if your_badge.count() > 0:
        badge_loaded = check_image_loaded(page, ".review-card.yours .review-badge")
        results["your_badge"] = badge_loaded
        print(f"  金色旅行者徽章: {'✓ 正常' if badge_loaded else '✗ 失败'}")
    else:
        results["your_badge"] = False
        print("  金色旅行者徽章: ✗ 缺失")
    
    # 4.5 检查"历史选择"卡片和徽章
    print("\n4.4 检查「历史选择」卡片...")
    history_card = page.locator(".review-card.history")
    results["history_card"] = history_card.count() > 0
    print(f"  历史选择卡片: {'✓ 存在' if history_card.count() > 0 else '✗ 缺失'}")
    
    history_badge = history_card.locator(".review-badge")
    if history_badge.count() > 0:
        badge_loaded = check_image_loaded(page, ".review-card.history .review-badge")
        results["history_badge"] = badge_loaded
        print(f"  蓝色书本徽章: {'✓ 正常' if badge_loaded else '✗ 失败'}")
    else:
        results["history_badge"] = False
        print("  蓝色书本徽章: ✗ 缺失")
    
    # 4.6 检查翻页功能
    print("\n4.5 检查翻页功能...")
    prev_btn = page.locator("#review-prev")
    next_btn = page.locator("#review-next")
    
    results["prev_button"] = prev_btn.count() > 0
    results["next_button"] = next_btn.count() > 0
    print(f"  上一页按钮: {'✓ 存在' if prev_btn.count() > 0 else '✗ 缺失'}")
    print(f"  下一页按钮: {'✓ 存在' if next_btn.count() > 0 else '✗ 缺失'}")
    
    # 测试下一页按钮
    if next_btn.count() > 0 and not next_btn.is_disabled():
        progress_before = page.locator("#review-progress").inner_text()
        next_btn.click()
        page.wait_for_timeout(500)
        progress_after = page.locator("#review-progress").inner_text()
        results["next_works"] = progress_before != progress_after
        print(f"  下一页功能: {'✓ 正常' if results['next_works'] else '✗ 失败'}")
        
        # 测试上一页按钮
        prev_btn.click()
        page.wait_for_timeout(500)
        progress_back = page.locator("#review-progress").inner_text()
        results["prev_works"] = progress_back == progress_before
        print(f"  上一页功能: {'✓ 正常' if results['prev_works'] else '✗ 失败'}")
    else:
        results["next_works"] = None
        results["prev_works"] = None
        print("  翻页功能: 只有1页，跳过测试")
    
    take_screenshot(page, "07-review-after-navigation")
    
    # 4.7 检查返回首页按钮
    print("\n4.6 检查返回首页按钮...")
    back_btn = page.locator(".review-actions .pixel-btn").first
    results["review_back_button"] = back_btn.count() > 0
    print(f"  返回首页按钮: {'✓ 存在' if back_btn.count() > 0 else '✗ 缺失'}")
    
    if back_btn.count() > 0:
        back_btn.click()
        page.wait_for_timeout(500)
        home_screen = page.locator("#screen-select.active")
        results["review_back_to_home"] = home_screen.count() > 0
        print(f"  返回首页功能: {'✓ 成功' if home_screen.count() > 0 else '✗ 失败'}")
    
    return results

def test_responsive(page):
    """测试响应式布局"""
    print("\n" + "="*60)
    print("测试 5: 响应式验证")
    print("="*60)
    
    results = {}
    
    # 设置为手机宽度
    print("\n5.1 测试手机宽度 (375px)...")
    page.set_viewport_size({"width": 375, "height": 812})
    
    # 首页
    print("\n  首页响应式测试:")
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    take_screenshot(page, "08-responsive-home")
    
    # 检查是否有水平滚动条（溢出）
    has_horizontal_scroll = page.evaluate("""
        () => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        }
    """)
    results["home_overflow"] = has_horizontal_scroll
    print(f"    水平溢出: {'✗ 有溢出' if has_horizontal_scroll else '✓ 正常'}")
    
    # 检查按钮大小
    btn_height = page.evaluate("""
        () => {
            const btn = document.querySelector('.pixel-btn');
            return btn ? btn.offsetHeight : 0;
        }
    """)
    results["home_button_height"] = btn_height
    print(f"    按钮高度: {btn_height}px {'✓ 适合点击(>=44px)' if btn_height >= 44 else '⚠ 可能偏小'}")
    
    # 游戏界面
    print("\n  游戏界面响应式测试:")
    page.locator(".char-card").first.click()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    take_screenshot(page, "09-responsive-game")
    
    has_horizontal_scroll = page.evaluate("""
        () => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        }
    """)
    results["game_overflow"] = has_horizontal_scroll
    print(f"    水平溢出: {'✗ 有溢出' if has_horizontal_scroll else '✓ 正常'}")
    
    # 失败界面
    print("\n  失败界面响应式测试:")
    page.evaluate("""
        gameState.state.funds = 0;
        const gameOverReason = checkGameOver();
        if (gameOverReason) {
            showGameOver(gameOverReason);
        }
    """)
    page.wait_for_timeout(500)
    take_screenshot(page, "10-responsive-gameover")
    
    has_horizontal_scroll = page.evaluate("""
        () => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        }
    """)
    results["gameover_overflow"] = has_horizontal_scroll
    print(f"    水平溢出: {'✗ 有溢出' if has_horizontal_scroll else '✓ 正常'}")
    
    # 复盘界面
    print("\n  复盘界面响应式测试:")
    page.goto(URL)
    page.wait_for_load_state('networkidle')
    page.locator(".char-card").first.click()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    
    page.evaluate("""
        const char = CHARACTERS[gameState.currentCharacter];
        const totalNodes = char.nodes.length;
        for (let i = gameState.currentNodeIndex; i < totalNodes; i++) {
            const node = char.nodes[i];
            const choice = node.choices[0];
            Object.entries(choice.effects).forEach(([stat, value]) => {
                gameState.state[stat] = Math.max(0, Math.min(char.maxState[stat], gameState.state[stat] + value));
            });
            gameState.history.push({
                nodeIndex: i,
                choiceId: choice.id,
                choiceText: choice.text,
                effects: { ...choice.effects },
                outcome: choice.outcome
            });
        }
        gameState.currentNodeIndex = totalNodes;
        showScreen('review');
        renderReview();
    """)
    page.wait_for_timeout(500)
    take_screenshot(page, "11-responsive-review")
    
    has_horizontal_scroll = page.evaluate("""
        () => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        }
    """)
    results["review_overflow"] = has_horizontal_scroll
    print(f"    水平溢出: {'✗ 有溢出' if has_horizontal_scroll else '✓ 正常'}")
    
    # 恢复桌面视图
    page.set_viewport_size({"width": 1280, "height": 800})
    
    return results

def main():
    print("创业模拟器 - 全流程验证测试")
    print("="*60)
    
    all_results = {}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        
        # 设置错误监听
        page.on("console", handle_console)
        page.on("pageerror", handle_page_error)
        page.on("requestfailed", handle_request_failed)
        
        try:
            # 测试 1: 首页
            all_results["home"] = test_home_page(page)
            
            # 测试 2: 游戏主界面
            all_results["game"] = test_game_main(page)
            
            # 测试 3: 失败界面
            all_results["gameover"] = test_game_over(page)
            
            # 测试 4: 复盘界面
            all_results["review"] = test_review_page(page)
            
            # 测试 5: 响应式
            all_results["responsive"] = test_responsive(page)
            
        except Exception as e:
            print(f"\n测试过程中发生错误: {e}")
            import traceback
            traceback.print_exc()
        
        browser.close()
    
    # 控制台检查
    print("\n" + "="*60)
    print("测试 6: 控制台检查")
    print("="*60)
    
    print(f"\n6.1 JS 错误数量: {len(page_errors)}")
    if page_errors:
        for err in page_errors:
            print(f"  - {err}")
    
    print(f"\n6.2 控制台错误/警告数量: {len(console_errors)}")
    if console_errors:
        for err in console_errors:
            print(f"  - {err}")
    
    print(f"\n6.3 失败的请求数量: {len(failed_requests)}")
    if failed_requests:
        for req in failed_requests:
            print(f"  - {req['url']}: {req['failure']}")
    
    all_results["console"] = {
        "js_errors": len(page_errors),
        "console_errors": len(console_errors),
        "failed_requests": len(failed_requests)
    }
    
    # 生成总结
    print("\n" + "="*60)
    print("验证总结")
    print("="*60)
    
    passed = 0
    failed = 0
    
    print("\n✓ 通过的项目:")
    
    # 首页
    if all_results.get("home", {}).get("home_background"):
        print("  - 首页背景图正常显示")
        passed += 1
    else:
        print("  ✗ 首页背景图失败")
        failed += 1
    
    if all_results.get("home", {}).get("all_banners_ok"):
        print("  - 角色卡片装饰图全部正常")
        passed += 1
    else:
        print("  ✗ 部分角色卡片装饰图失败")
        failed += 1
    
    if all_results.get("home", {}).get("click_to_game"):
        print("  - 点击角色卡片可进入游戏")
        passed += 1
    else:
        print("  ✗ 点击角色卡片无法进入游戏")
        failed += 1
    
    # 游戏主界面
    if all_results.get("game", {}).get("dialog_visible"):
        print("  - 游戏主界面对话正常")
        passed += 1
    else:
        print("  ✗ 游戏主界面对话异常")
        failed += 1
    
    if all_results.get("game", {}).get("status_panel_visible"):
        print("  - 状态面板正常显示")
        passed += 1
    else:
        print("  ✗ 状态面板异常")
        failed += 1
    
    if all_results.get("game", {}).get("feedback_modal"):
        print("  - 选项反馈弹窗正常")
        passed += 1
    else:
        print("  ✗ 选项反馈弹窗异常")
        failed += 1
    
    # 失败界面
    if all_results.get("gameover", {}).get("gameover_screen"):
        print("  - 失败界面正常触发")
        passed += 1
    else:
        print("  ✗ 失败界面触发失败")
        failed += 1
    
    if all_results.get("gameover", {}).get("gameover_background"):
        print("  - 失败界面背景图(雨夜办公室)正常")
        passed += 1
    else:
        print("  ✗ 失败界面背景图失败")
        failed += 1
    
    if all_results.get("gameover", {}).get("gameover_illustration"):
        print("  - 资金耗尽插画正常显示")
        passed += 1
    else:
        print("  ✗ 资金耗尽插画失败")
        failed += 1
    
    if all_results.get("gameover", {}).get("back_to_home"):
        print("  - 失败界面按钮功能正常")
        passed += 1
    else:
        print("  ✗ 失败界面按钮功能异常")
        failed += 1
    
    # 复盘界面
    if all_results.get("review", {}).get("review_screen"):
        print("  - 复盘界面正常显示")
        passed += 1
    else:
        print("  ✗ 复盘界面显示失败")
        failed += 1
    
    if all_results.get("review", {}).get("review_background"):
        print("  - 复盘背景图(时光回溯书房)正常")
        passed += 1
    else:
        print("  ✗ 复盘背景图失败")
        failed += 1
    
    if all_results.get("review", {}).get("your_badge"):
        print("  - 「你的选择」金色旅行者徽章正常")
        passed += 1
    else:
        print("  ✗ 「你的选择」徽章异常")
        failed += 1
    
    if all_results.get("review", {}).get("history_badge"):
        print("  - 「历史选择」蓝色书本徽章正常")
        passed += 1
    else:
        print("  ✗ 「历史选择」徽章异常")
        failed += 1
    
    if all_results.get("review", {}).get("next_works") and all_results.get("review", {}).get("prev_works"):
        print("  - 复盘翻页功能正常")
        passed += 1
    elif all_results.get("review", {}).get("next_works") is None:
        print("  - 复盘翻页功能: 单页无需翻页")
        passed += 1
    else:
        print("  ✗ 复盘翻页功能异常")
        failed += 1
    
    # 响应式
    responsive_ok = True
    for key in ["home_overflow", "game_overflow", "gameover_overflow", "review_overflow"]:
        if all_results.get("responsive", {}).get(key):
            responsive_ok = False
            break
    
    if responsive_ok:
        print("  - 响应式布局无溢出")
        passed += 1
    else:
        print("  ✗ 响应式布局有溢出")
        failed += 1
    
    # 控制台
    console_ok = (len(page_errors) == 0 and len(failed_requests) == 0)
    if console_ok:
        print("  - 控制台无 JS 错误和图片 404")
        passed += 1
    else:
        print("  ✗ 控制台有错误")
        failed += 1
    
    print(f"\n总计: {passed} 通过, {failed} 失败")
    
    return all_results

if __name__ == "__main__":
    main()
