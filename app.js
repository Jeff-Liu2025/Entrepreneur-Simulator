// Game state
let gameState = {
  currentCharacter: null,
  currentNodeIndex: 0,
  state: {},
  history: [], // { nodeId, choiceId, effects }
  isTyping: false,
  typingTimeout: null
};

const SAVE_KEY = 'startup_simulator_save';
const STAT_LABELS = {
  funds: '💰 资金',
  team: '👥 团队',
  market: '📊 市场',
  morale: '🔥 士气'
};

// Initialize
function init() {
  renderCharacters();
  const saved = loadGame();
  if (saved) {
    showContinueOption();
  }
}

function renderCharacters() {
  const grid = document.getElementById('char-grid');
  grid.innerHTML = '';

  const bannerMap = {
    internet: 'assets/ui/home_deco_internet.png',
    hardware: 'assets/ui/home_deco_hardware.png',
    retail: 'assets/ui/home_deco_retail.png'
  };

  Object.values(CHARACTERS).forEach((char, index) => {
    const card = document.createElement('div');
    card.className = 'char-card animate-in ' + char.id;
    card.style.animationDelay = `${index * 0.1}s`;

    const bannerUrl = bannerMap[char.id] || '';

    card.innerHTML = `
      <div class="char-banner" style="background-image: url('${bannerUrl}')"></div>
      <div class="char-card-body">
        <div class="char-avatar float">${char.avatar}</div>
        <div class="char-name">${char.name}</div>
        <div class="char-tag">${char.industry}</div>
        <div class="char-era">${char.era}</div>
        <div class="char-desc">${char.desc}</div>
      </div>
    `;
    card.onclick = () => startGame(char.id);
    grid.appendChild(card);
  });
}

function showContinueOption() {
  const header = document.querySelector('#app > .header');
  if (header && !document.getElementById('continue-btn')) {
    const btn = document.createElement('button');
    btn.id = 'continue-btn';
    btn.className = 'pixel-btn success';
    btn.style = 'margin-top: 16px; width: auto;';
    btn.textContent = '继续上次的游戏';
    btn.onclick = continueGame;
    header.appendChild(btn);
  }
}

function startGame(characterId) {
  const char = CHARACTERS[characterId];
  gameState = {
    currentCharacter: characterId,
    currentNodeIndex: 0,
    state: { ...char.initialState },
    history: [],
    isTyping: false,
    typingTimeout: null
  };
  saveGame();
  showScreen('game');
  renderGame();
}

function continueGame() {
  const saved = loadGame();
  if (saved) {
    gameState = saved;
    const char = CHARACTERS[gameState.currentCharacter];
    if (!char || gameState.currentNodeIndex >= char.nodes.length) {
      clearSave();
      showScreen('select');
      return;
    }
    showScreen('game');
    renderGame();
  }
}

function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${screenName}`).classList.add('active');
}

function renderGame() {
  const char = CHARACTERS[gameState.currentCharacter];
  const node = char.nodes[gameState.currentNodeIndex];

  // Scene background
  const sceneLayer = document.getElementById('scene-layer');
  if (node.scene) {
    const sceneUrl = 'assets/scenes/' + node.scene;
    sceneLayer.style.backgroundImage = 'url(' + sceneUrl + ')';
    sceneLayer.style.backgroundColor = '';
    const preload = new Image();
    preload.onerror = () => {
      sceneLayer.style.backgroundImage = '';
      sceneLayer.style.backgroundColor = '#2d3a4a';
    };
    preload.src = sceneUrl;
  } else {
    sceneLayer.style.backgroundImage = '';
    sceneLayer.style.backgroundColor = '#2d3a4a';
  }

  // Character portrait
  const portraitEl = document.getElementById('dialog-portrait');
  portraitEl.classList.remove('hidden');
  portraitEl.alt = char.name;
  portraitEl.onload = () => hidePortraitFallback();
  portraitEl.onerror = () => {
    portraitEl.classList.add('hidden');
    showPortraitFallback(char.avatar);
  };
  if (char.portrait) {
    portraitEl.src = 'assets/portraits/' + char.portrait;
  } else {
    portraitEl.classList.add('hidden');
    showPortraitFallback(char.avatar);
  }

  // Header
  document.getElementById('node-year').textContent = `📅 ${node.year}年`;
  document.getElementById('node-title').textContent = node.title;
  document.getElementById('node-progress').textContent = `节点 ${gameState.currentNodeIndex + 1}/${char.nodes.length}`;

  // Typewriter narrative
  const narrativeEl = document.getElementById('narrative-text');
  narrativeEl.textContent = '';
  typeWriter(narrativeEl, node.narrative, 15);

  // Choices
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  node.choices.forEach((choice, index) => {
    const btn = document.createElement('button');
    btn.className = 'pixel-btn choice-btn animate-in';
    btn.style.animationDelay = `${index * 0.1}s`;

    const tagsHtml = choice.tags && choice.tags.length > 0
      ? `<span class="choice-tags">${choice.tags.join(' / ')}</span>`
      : '';

    btn.innerHTML = `
      <span><span class="choice-label">${String.fromCharCode(65 + index)}.</span><span class="choice-text">${choice.text}</span></span>
      ${tagsHtml}
    `;
    btn.onclick = () => handleChoice(choice);
    choicesEl.appendChild(btn);
  });

  // Status panel
  renderStatus();
}

function showPortraitFallback(avatar) {
  let fallback = document.getElementById('portrait-fallback');
  if (!fallback) {
    fallback = document.createElement('div');
    fallback.id = 'portrait-fallback';
    const portraitEl = document.getElementById('dialog-portrait');
    portraitEl.parentNode.insertBefore(fallback, portraitEl.nextSibling);
  }
  fallback.className = 'dialog-portrait portrait-fallback';
  fallback.textContent = avatar;
  fallback.style.display = 'flex';
  fallback.style.alignItems = 'center';
  fallback.style.justifyContent = 'center';
  fallback.style.fontSize = '64px';
}

function hidePortraitFallback() {
  const fallback = document.getElementById('portrait-fallback');
  if (fallback) {
    fallback.style.display = 'none';
  }
}

function typeWriter(element, text, speed) {
  // Cancel any previous typing animation to prevent text mixing
  if (gameState.typingTimeout) {
    clearTimeout(gameState.typingTimeout);
  }

  gameState.isTyping = true;
  let i = 0;
  element.textContent = '';
  element.classList.add('typing');

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      gameState.typingTimeout = setTimeout(type, speed);
    } else {
      gameState.isTyping = false;
      gameState.typingTimeout = null;
      element.classList.remove('typing');
    }
  }

  gameState.typingTimeout = setTimeout(type, speed);
}

function renderStatus() {
  const char = CHARACTERS[gameState.currentCharacter];
  const maxState = char.maxState;

  Object.keys(STAT_LABELS).forEach(stat => {
    const value = gameState.state[stat];
    const max = maxState[stat];
    const percentage = Math.max(0, Math.min(100, (value / max) * 100));

    document.getElementById(`stat-label-${stat}`).textContent = STAT_LABELS[stat];
    document.getElementById(`stat-value-${stat}`).textContent = `${value}/${max}`;
    document.getElementById(`stat-percent-${stat}`).textContent = `${Math.round(percentage)}%`;

    const fill = document.getElementById(`stat-fill-${stat}`);
    fill.style.width = `${percentage}%`;
    fill.className = 'stat-fill' + (percentage < 30 ? ' warning' : '');
  });
}

function handleChoice(choice) {
  if (gameState.isTyping) {
    // Finish typing immediately if user makes a choice
    const narrativeEl = document.getElementById('narrative-text');
    const char = CHARACTERS[gameState.currentCharacter];
    const node = char.nodes[gameState.currentNodeIndex];
    if (gameState.typingTimeout) {
      clearTimeout(gameState.typingTimeout);
      gameState.typingTimeout = null;
    }
    narrativeEl.textContent = node.narrative;
    narrativeEl.classList.remove('typing');
    gameState.isTyping = false;
  }

  // Apply effects
  const char = CHARACTERS[gameState.currentCharacter];
  const maxState = char.maxState;

  Object.entries(choice.effects).forEach(([stat, value]) => {
    gameState.state[stat] = Math.max(0, Math.min(maxState[stat], gameState.state[stat] + value));
  });

  // Record history
  gameState.history.push({
    nodeIndex: gameState.currentNodeIndex,
    choiceId: choice.id,
    choiceText: choice.text,
    effects: { ...choice.effects },
    outcome: choice.outcome
  });

  saveGame();

  // Check game over conditions
  const gameOverReason = checkGameOver();
  if (gameOverReason) {
    showGameOver(gameOverReason);
    return;
  }

  // Show feedback modal
  showFeedback(choice);
}

function checkGameOver() {
  const state = gameState.state;
  if (state.funds <= 0) {
    return {
      type: 'funds',
      reason: '💰 资金链断裂。你的公司账上已经没有现金，无法支付下月工资和服务器费用，创业之路戛然而止。'
    };
  }
  if (state.team <= 1) {
    return {
      type: 'team',
      reason: '👥 核心团队解散。最后一个合伙人也离开了，只剩下你一个人，公司无法继续运转。'
    };
  }
  if (state.market <= 0) {
    return {
      type: 'market',
      reason: '📊 市场归零。你的产品彻底失去了市场份额，没有人再愿意为你的服务买单。'
    };
  }
  if (state.morale <= 25) {
    return {
      type: 'morale',
      reason: '🔥 军心涣散。团队成员彻底失去信心，集体出走，你的创业梦想被迫中止。'
    };
  }
  return null;
}

function showGameOver(gameOverInfo) {
  const illusMap = {
    funds: 'assets/ui/fail_ico_funds.png',
    market: 'assets/ui/fail_ico_market.png',
    team: 'assets/ui/fail_ico_morale.png',
    morale: 'assets/ui/fail_ico_morale.png'
  };
  const illusUrl = illusMap[gameOverInfo.type] || illusMap.funds;
  document.getElementById('gameover-illustration').src = illusUrl;
  document.getElementById('gameover-reason').textContent = gameOverInfo.reason;
  showScreen('gameover');
}

function restartGame() {
  if (gameState.currentCharacter) {
    startGame(gameState.currentCharacter);
  }
}

function showFeedback(choice) {
  const modal = document.getElementById('feedback-modal');
  const modalText = document.getElementById('modal-text');
  const modalEffects = document.getElementById('modal-effects');
  const continueBtn = document.getElementById('modal-continue');

  modalText.textContent = choice.outcome;

  modalEffects.innerHTML = Object.entries(choice.effects)
    .map(([stat, value]) => {
      const cls = value > 0 ? 'effect-good' : value < 0 ? 'effect-bad' : 'effect-neutral';
      const sign = value > 0 ? '+' : '';
      return `<span class="effect-tag" style="border-color: var(--${value > 0 ? 'success' : value < 0 ? 'danger' : 'info'}); color: var(--${value > 0 ? 'success' : value < 0 ? 'danger' : 'info'});">${STAT_LABELS[stat]} ${sign}${value}</span>`;
    })
    .join('');

  continueBtn.onclick = () => {
    closeModal();
    advanceNode();
  };

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('feedback-modal').classList.remove('active');
}

function advanceNode() {
  const char = CHARACTERS[gameState.currentCharacter];
  gameState.currentNodeIndex++;

  if (gameState.currentNodeIndex >= char.nodes.length) {
    showSummary();
  } else {
    renderGame();
  }

  saveGame();
}

function showSummary() {
  const char = CHARACTERS[gameState.currentCharacter];
  const state = gameState.state;
  const history = gameState.history;

  // 计算综合得分（加权平均）
  const score = Math.round(
    state.funds * 0.25 +
    state.market * 0.35 +
    state.morale * 0.25 +
    (state.team / char.maxState.team * 100) * 0.15
  );

  // 评级
  const COMMENTS = {
    S: [
      '卓越！你的决策堪称教科书级别，每一个关键节点都做出了最优选择。你不仅复刻了历史，甚至超越了它。',
      '不可思议！如果真实历史给你重来一次的机会，你可能比原型走得更远。投资人纷纷表示"后悔没投你"。',
      '完美通关！你的商业嗅觉和战略眼光令人叹服。建议把这份决策记录打印出来贴在办公桌上——这就是最好的MBA教材。',
    ],
    A: [
      '优秀！你展现出了出色的商业判断力，大部分决策都经得起考验。回顾那些偏离历史的节点，或许能有新的启发。',
      '很稳！你的决策路径和历史高度吻合，说明你天然具备这位企业家的思维模式。差一点点就是满分了。',
      '出色！虽然有几次小偏差，但整体方向完全正确。如果这是真实创业，你的公司现在已经准备IPO了。',
    ],
    B: [
      '合格。你挺过了创业路上的风风雨雨，但有些决策还可以更加果断。复盘时不妨想想：如果重来一次，你会怎么选？',
      '还行吧……公司活着，团队没散，但总觉得差了点什么。或许正是那几次"差一点"的选择，决定了伟大和平庸的距离。',
      '中规中矩。你没有犯大错，但也没有惊艳的操作。创业就像开车——光不撞车是不够的，还得知道什么时候踩油门。',
    ],
    C: [
      '勉强生存。创业之路从来不易，你的公司在悬崖边缘走了好几回。但没关系，失败是最好的老师——来看看历史是怎么做的。',
      '好险好险！你这趟创业列车差点就脱轨了。回头看看那些危险的选择，是不是觉得后背发凉？',
      '活下来了，但也就这样了。如果这是真实创业，你的投资人可能已经在考虑换CEO了。别灰心，复盘一下看看哪里出了问题。',
    ],
  };

  let grade, gradeClass;
  if (score >= 85) {
    grade = 'S';
    gradeClass = 'grade-s';
  } else if (score >= 70) {
    grade = 'A';
    gradeClass = 'grade-a';
  } else if (score >= 50) {
    grade = 'B';
    gradeClass = 'grade-b';
  } else {
    grade = 'C';
    gradeClass = 'grade-c';
  }
  const comment = COMMENTS[grade][Math.floor(Math.random() * COMMENTS[grade].length)];

  // 统计历史选择命中率
  const historicalCount = history.filter(h => {
    const node = char.nodes[h.nodeIndex];
    if (!node) return false;
    return node.choices.find(c => c.id === h.choiceId)?.historicalChoice;
  }).length;

  // 渲染
  document.getElementById('summary-grade').innerHTML =
    `<div class="grade-badge ${gradeClass}">${grade}</div><div class="grade-label">综合评级</div>`;
  document.getElementById('summary-stats').innerHTML = `
    <div class="stat-row"><span>💰 资金</span><span>${state.funds}</span></div>
    <div class="stat-row"><span>👥 团队</span><span>${state.team}</span></div>
    <div class="stat-row"><span>📊 市场</span><span>${state.market}</span></div>
    <div class="stat-row"><span>🔥 士气</span><span>${state.morale}</span></div>
    <div class="stat-row highlight"><span>🎯 历史命中率</span><span>${historicalCount}/${char.nodes.length}</span></div>
  `;
  document.getElementById('summary-comment').textContent = comment;

  showScreen('summary');
  saveGame();
}

function enterReview() {
  showScreen('review');
  renderReview();
}

function renderReview() {
  const char = CHARACTERS[gameState.currentCharacter];
  const history = gameState.history;

  document.getElementById('review-title').textContent = `${char.name} · 创业复盘`;
  document.getElementById('review-subtitle').textContent =
    `你完成了 ${history.length}/${char.nodes.length} 个关键决策`;

  renderReviewNode(0);
}

function renderReviewNode(index) {
  const char = CHARACTERS[gameState.currentCharacter];
  const history = gameState.history;
  const node = char.nodes[index];
  const record = history[index];

  if (!record) return;

  document.getElementById('review-progress').textContent = `复盘 · 节点 ${index + 1}/${char.nodes.length}`;
  document.getElementById('review-year').textContent = `${node.year}年 · ${node.title}`;

  const historicalChoice = node.choices.find(c => c.historicalChoice);
  document.getElementById('your-choice').textContent = record.choiceText;
  document.getElementById('history-choice').textContent = historicalChoice ? historicalChoice.text : '无记录';
  document.getElementById('review-note').innerHTML = `<strong>深度解读：</strong>${node.historicalNote}</strong>`;

  // Update nav buttons
  const prevBtn = document.getElementById('review-prev');
  const nextBtn = document.getElementById('review-next');

  prevBtn.disabled = index === 0;
  prevBtn.onclick = () => renderReviewNode(index - 1);

  nextBtn.disabled = index === history.length - 1;
  nextBtn.onclick = () => renderReviewNode(index + 1);
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    showSaveNotice();
  } catch (e) {
    console.warn('Save failed:', e);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn('Load failed:', e);
    return null;
  }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

function showSaveNotice() {
  const notice = document.getElementById('save-notice');
  notice.classList.add('active');
  setTimeout(() => {
    notice.classList.remove('active');
  }, 1500);
}

function backToSelect() {
  clearSave();
  showScreen('select');
  renderCharacters();
}

// Start
init();
