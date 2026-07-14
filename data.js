const CHARACTERS = {
  internet: {
    id: 'internet',
    name: '马风',
    avatar: '🌐',
    portrait: '马风.png',
    industry: '互联网 · 平台',
    era: '1999 - 2014',
    desc: '从英语教师到电商平台缔造者，经历互联网泡沫与电商大战。',
    initialState: { funds: 60, team: 3, market: 5, morale: 80 },
    maxState: { funds: 100, team: 20, market: 100, morale: 100 },
    nodes: [
      {
        id: 'inet_01',
        year: 1999,
        title: '辞职创业',
        scene: '湖畔公寓初创小屋.png',
        narrative: '你是一名英语教师，互联网浪潮让你彻夜难眠。你决定创办一个帮中国企业对接海外买家的网站。但积蓄有限，家人反对，朋友说你疯了。',
        choices: [
          {
            id: 'inet_01_a',
            text: '孤注一掷，全部积蓄投入',
            effects: { funds: -30, team: 0, market: 5, morale: 15 },
            outcome: '你租了湖畔花园的公寓，18个人挤在一起没日没夜地写代码。资金见底，但团队士气高涨。',
            historicalChoice: true,
            tags: ['💰高风险', '🔥高回报', '⚡提振士气']
          },
          {
            id: 'inet_01_b',
            text: '边教书边创业，稳扎稳打',
            effects: { funds: -10, team: 0, market: 2, morale: -5 },
            outcome: '进度缓慢，你错过了一些早期客户。窗口期比你想象的更短。',
            historicalChoice: false,
            tags: ['💰低风险', '🔥稳扎稳打', '👥保持现状']
          },
          {
            id: 'inet_01_c',
            text: '拉几个学生合伙，分摊风险',
            effects: { funds: -15, team: 2, market: 3, morale: 5 },
            outcome: '团队壮大了，但股权分散为日后埋下隐患。',
            historicalChoice: false,
            tags: ['👥扩大团队', '🤝合作共赢', '💰低风险']
          }
        ],
        historicalNote: '马风选择 all in 创业。他认为互联网窗口期短暂，必须全力以赴抢占先机。'
      },
      {
        id: 'inet_02',
        year: 2000,
        title: '融资危机',
        scene: '互联网寒冬办公室.png',
        narrative: '互联网泡沫破裂，投资人开始捂紧钱包。你的账户只够撑几个月，而网站还没有盈利。你面临最艰难的选择。',
        choices: [
          {
            id: 'inet_02_a',
            text: '接受苛刻条款，拿钱活下去',
            effects: { funds: 25, team: 0, market: 10, morale: -10 },
            outcome: '你拿到了投资，但出让了大量股权和决策权。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '💰稳健收益', '👥保持现状']
          },
          {
            id: 'inet_02_b',
            text: '裁员收缩，自筹资金过冬',
            effects: { funds: 10, team: -2, market: 0, morale: -15 },
            outcome: '团队人心惶惶，但你还掌握着公司的控制权。',
            historicalChoice: false,
            tags: ['👥精简团队', '🛡️保守防御', '⚡打击士气']
          },
          {
            id: 'inet_02_c',
            text: '举办大型展会，向客户收费',
            effects: { funds: 25, team: 1, market: 15, morale: 10 },
            outcome: '首届"网商大会"大获成功，你开始证明商业模式可行。',
            historicalChoice: true,
            tags: ['🚀激进扩张', '🔥高回报', '⚡提振士气']
          }
        ],
        historicalNote: '通过向会员收费和举办展会，马风在互联网寒冬中找到了造血能力。'
      },
      {
        id: 'inet_03',
        year: 2003,
        title: '淘宝诞生',
        scene: '普通办公室.png',
        narrative: 'eBay以收购方式进入中国C2C市场。你的B2B业务刚站稳脚跟，但C2C这块更大的蛋糕正被国际巨头盯上。你要不要秘密组建团队杀入C2C？',
        choices: [
          {
            id: 'inet_03_a',
            text: '坚守B2B，不碰C2C',
            effects: { funds: 15, team: 0, market: 5, morale: 5 },
            outcome: '你稳固了B2B基本盘，但错过了C2C的大潮。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '💰稳健收益', '👥保持现状']
          },
          {
            id: 'inet_03_b',
            text: '秘密组建淘宝团队，杀入C2C',
            effects: { funds: 15, team: 2, market: 20, morale: 10 },
            outcome: '你秘密组建小团队开发C2C平台，免费模式让对手措手不及。',
            historicalChoice: true,
            tags: ['🔥爆发增长', '📈提升市场', '⚡提振士气']
          },
          {
            id: 'inet_03_c',
            text: '与eBay合作，借力进入C2C',
            effects: { funds: 10, team: 2, market: 10, morale: -5 },
            outcome: '你获得了短期资源，但丧失了独立掌控C2C的机会。',
            historicalChoice: false,
            tags: ['🤝合作共赢', '💰低风险', '⚡打击士气']
          }
        ],
        historicalNote: '2003年马风秘密组建团队创立淘宝，用免费模式对抗eBay，这成为阿里最关键的战略决策。'
      },
      {
        id: 'inet_04',
        year: 2005,
        title: '竞争策略',
        scene: '网商大会展会现场.png',
        narrative: '强大的国际竞争对手进入中国市场，他们资金雄厚、技术先进。你如何应对？',
        choices: [
          {
            id: 'inet_04_a',
            text: '正面硬刚，烧钱打广告',
            effects: { funds: -35, team: 1, market: 10, morale: -5 },
            outcome: '你暂时保住了市场份额，但资金链极度紧张。',
            historicalChoice: false,
            tags: ['💸烧钱换规模', '📈提升市场', '💰高风险']
          },
          {
            id: 'inet_04_b',
            text: '深耕中小企业，差异化竞争',
            effects: { funds: -5, team: 2, market: 25, morale: 15 },
            outcome: '你避开了对手的锋芒，在下沉市场建立了深厚壁垒。',
            historicalChoice: true,
            tags: ['🔥稳扎稳打', '📈巩固市场', '🤝合作共赢']
          },
          {
            id: 'inet_04_c',
            text: '寻求被收购，套现离场',
            effects: { funds: 30, team: -2, market: -10, morale: -20 },
            outcome: '你拿到一笔钱，但品牌逐渐消失在市场上。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '📈牺牲市场', '⚡打击士气']
          }
        ],
        historicalNote: '马风选择服务被国际巨头忽视的中小企业，用"农村包围城市"的战略赢得市场。'
      },
      {
        id: 'inet_05',
        year: 2008,
        title: '金融危机',
        scene: '会议室.png',
        narrative: '全球金融危机爆发，出口企业大量倒闭，你的核心客户遭受重创。是收缩过冬，还是逆势扩张？',
        choices: [
          {
            id: 'inet_05_a',
            text: '大规模裁员，削减开支',
            effects: { funds: 20, team: -5, market: -10, morale: -20 },
            outcome: '你保住了现金流，但人才流失严重。',
            historicalChoice: false,
            tags: ['👥精简团队', '🛡️保守防御', '⚡打击士气']
          },
          {
            id: 'inet_05_b',
            text: '逆势扩招，低价收购对手',
            effects: { funds: -25, team: 5, market: 20, morale: 10 },
            outcome: '危机过后，你的团队和市场版图都大幅扩张。',
            historicalChoice: true,
            tags: ['🚀激进扩张', '👥扩大团队', '📈提升市场']
          },
          {
            id: 'inet_05_c',
            text: '转向国内市场，帮助内贸',
            effects: { funds: 5, team: 2, market: 15, morale: 5 },
            outcome: '内贸市场成为新增长点，但速度较慢。',
            historicalChoice: false,
            tags: ['🔥稳扎稳打', '📈提升市场', '💰低风险']
          }
        ],
        historicalNote: '金融危机中，马风反而加大投入，认为危机是弯道超车的机会。'
      },
      {
        id: 'inet_06',
        year: 2010,
        title: '移动浪潮',
        scene: '普通办公室.png',
        narrative: '智能手机开始普及，PC 流量增速放缓。你需要决定是否 all in 移动互联网。',
        choices: [
          {
            id: 'inet_06_a',
            text: 'All in 移动端，开发 App',
            effects: { funds: -20, team: 4, market: 30, morale: 10 },
            outcome: '你押对了方向，移动交易占比迅速超过 PC。',
            historicalChoice: true,
            tags: ['🚀激进扩张', '🔥高回报', '👥扩大团队']
          },
          {
            id: 'inet_06_b',
            text: 'PC 为主，移动端只是补充',
            effects: { funds: -5, team: 1, market: 5, morale: -5 },
            outcome: '你错失了移动电商的最佳窗口期。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥保持现状', '💰低风险']
          },
          {
            id: 'inet_06_c',
            text: '投资外卖、打车等新业务',
            effects: { funds: -40, team: 3, market: 15, morale: 5 },
            outcome: '生态布局很广，但主业资源被分散。',
            historicalChoice: false,
            tags: ['💸烧钱换规模', '💰高风险', '👥扩大团队']
          }
        ],
        historicalNote: '马风坚定押注移动互联网，让平台在移动端时代继续保持领先。'
      },
      {
        id: 'inet_07',
        year: 2014,
        title: '上市抉择',
        scene: '证券交易所敲钟.png',
        narrative: '公司已经成长为巨头，但你面临是否上市的选择。上市能融资，但也会带来短期业绩压力。',
        choices: [
          {
            id: 'inet_07_a',
            text: '赴美上市，融资扩张',
            effects: { funds: 50, team: 5, market: 30, morale: 15 },
            outcome: '你创造了史上最大 IPO 之一，但从此每个季度都要面对资本市场的审视。',
            historicalChoice: true,
            tags: ['🚀激进扩张', '🔥高回报', '👥扩大团队']
          },
          {
            id: 'inet_07_b',
            text: '坚持不上市，保持私有',
            effects: { funds: 10, team: 0, market: 5, morale: 10 },
            outcome: '你保留了战略灵活性，但融资能力受限。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥保持现状', '💰低风险']
          },
          {
            id: 'inet_07_c',
            text: '被巨头收购，加入生态体系',
            effects: { funds: 40, team: -2, market: -10, morale: -10 },
            outcome: '你拿到了资金和资源，但失去了独立决策权。',
            historicalChoice: false,
            tags: ['🤝合作共赢', '📈牺牲市场', '⚡打击士气']
          }
        ],
        historicalNote: '2014 年赴美上市，成为全球关注的标志性事件，也开启了新的发展阶段。'
      }
    ]
  },
  hardware: {
    id: 'hardware',
    name: '雷鸣',
    avatar: '📱',
    portrait: '雷鸣.png',
    industry: '硬件 · 科技制造',
    era: '2010 - 2021',
    desc: '从软件到硬件，用性价比和生态链重新定义手机行业。',
    initialState: { funds: 60, team: 5, market: 5, morale: 75 },
    maxState: { funds: 100, team: 25, market: 100, morale: 100 },
    nodes: [
      {
        id: 'hard_01',
        year: 2010,
        title: '再次创业',
        scene: '城市夜景.png',
        narrative: '你已经财务自由，但心中还有一个硬件梦。国内手机市场被国外品牌垄断，高价低配。你要做手机，但所有人都不看好。',
        choices: [
          {
            id: 'hard_01_a',
            text: '做高端旗舰，正面挑战苹果',
            effects: { funds: -35, team: 3, market: 5, morale: 5 },
            outcome: '产品口碑不错，但销量惨淡，资金链告急。',
            historicalChoice: false,
            tags: ['💰高风险', '🚀激进扩张']
          },
          {
            id: 'hard_01_b',
            text: '极致性价比，做年轻人的第一部手机',
            effects: { funds: -20, team: 2, market: 20, morale: 15 },
            outcome: '你打破了行业暴利，迅速聚集了一大批忠实用户。',
            historicalChoice: true,
            tags: ['🔥爆发增长', '📈提升市场', '⚡提振士气']
          },
          {
            id: 'hard_01_c',
            text: '先做 ROM 系统，积累用户',
            effects: { funds: -10, team: 3, market: 10, morale: 10 },
            outcome: '你培养了一批粉丝，但变现路径漫长。',
            historicalChoice: false,
            tags: ['💰低风险', '🔥稳扎稳打', '👥保持现状']
          }
        ],
        historicalNote: '雷鸣选择用性价比切入，先做"感动人心、价格厚道"的产品。'
      },
      {
        id: 'hard_02',
        year: 2012,
        title: '供应链难题',
        scene: '车库创业工作室.png',
        narrative: '手机行业供应链复杂，你没有工厂经验。第一批产品良率极低，用户抱怨不断。',
        choices: [
          {
            id: 'hard_02_a',
            text: '自建工厂，掌控生产',
            effects: { funds: -25, team: 5, market: 10, morale: -5 },
            outcome: '重资产拖累了现金流，但品控逐渐稳定。',
            historicalChoice: false,
            tags: ['💰高风险', '👥扩大团队', '🛡️保守防御']
          },
          {
            id: 'hard_02_b',
            text: '找顶尖代工厂合作',
            effects: { funds: -10, team: 2, market: 20, morale: 10 },
            outcome: '你借助富士康等代工厂的成熟能力，快速提升了产能和品质。',
            historicalChoice: true,
            tags: ['🤝合作共赢', '💰低风险', '📈提升市场']
          },
          {
            id: 'hard_02_c',
            text: '小批量试产，严控品质',
            effects: { funds: -5, team: 1, market: 5, morale: 15 },
            outcome: '口碑保住了，但供不应求，被批评"耍猴"。',
            historicalChoice: false,
            tags: ['🔥稳扎稳打', '🛡️保守防御', '⚡提振士气']
          }
        ],
        historicalNote: '通过与顶级代工厂合作，雷鸣在轻资产模式下快速实现了规模化生产。'
      },
      {
        id: 'hard_03',
        year: 2011,
        title: '手机发布',
        scene: '产品发布会舞台.png',
        narrative: '你的第一款手机即将面世。预算有限，如何让市场记住你？传统厂商砸钱投广告，你需要更聪明的打法。',
        choices: [
          {
            id: 'hard_03_a',
            text: '线上发布 + 饥饿营销',
            effects: { funds: -5, team: 2, market: 30, morale: 10 },
            outcome: '每次发售都秒空，话题度拉满，但也被吐槽买不到。',
            historicalChoice: true,
            tags: ['🔥爆发增长', '📈提升市场', '💸烧钱换规模']
          },
          {
            id: 'hard_03_b',
            text: '电视广告 + 线下渠道',
            effects: { funds: -30, team: 3, market: 15, morale: 0 },
            outcome: '覆盖面广，但性价比优势被营销成本稀释。',
            historicalChoice: false,
            tags: ['💸烧钱换规模', '📈提升市场']
          },
          {
            id: 'hard_03_c',
            text: '培养发烧友社区，口碑传播',
            effects: { funds: -5, team: 2, market: 20, morale: 15 },
            outcome: '社区活跃度极高，用户自发成为推销员。',
            historicalChoice: false,
            tags: ['🔥稳扎稳打', '🤝合作共赢', '⚡提振士气']
          }
        ],
        historicalNote: '线上发布会和限量抢购，创造了极高的话题性和品牌势能。'
      },
      {
        id: 'hard_04',
        year: 2016,
        title: '生态链布局',
        scene: '工厂生产线.png',
        narrative: '手机业务站稳脚跟后，你意识到单一产品风险太大。要不要围绕手机做一堆周边产品？',
        choices: [
          {
            id: 'hard_04_a',
            text: '投资生态链企业，做 IoT 平台',
            effects: { funds: -10, team: 4, market: 25, morale: 10 },
            outcome: '手环、充电宝、扫地机器人接连爆款，你构建起一个庞大的生态。',
            historicalChoice: true,
            tags: ['🔥爆发增长', '👥扩大团队', '🤝合作共赢']
          },
          {
            id: 'hard_04_b',
            text: '专注手机，不做分散',
            effects: { funds: 10, team: 0, market: 10, morale: 5 },
            outcome: '手机业务稳健，但增长天花板明显。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥保持现状', '💰低风险']
          },
          {
            id: 'hard_04_c',
            text: '自己做所有产品线',
            effects: { funds: -50, team: 8, market: 15, morale: -10 },
            outcome: '产品线臃肿，管理和库存压力巨大。',
            historicalChoice: false,
            tags: ['💸烧钱换规模', '💰高风险', '👥扩大团队']
          }
        ],
        historicalNote: '通过投资而非全资控股的方式布局生态链，雷鸣用轻资产模式复制了多个爆款。'
      },
      {
        id: 'hard_05',
        year: 2018,
        title: '国际化',
        scene: '会议室.png',
        narrative: '国内市场竞争白热化，你开始考虑出海。印度、东南亚、欧洲，哪个市场更值得押注？',
        choices: [
          {
            id: 'hard_05_a',
            text: '进军印度和东南亚',
            effects: { funds: 10, team: 3, market: 30, morale: 10 },
            outcome: '新兴市场增长迅猛，你迅速成为全球前列的手机厂商，同时获得了新一轮大额融资。',
            historicalChoice: true,
            tags: ['🚀激进扩张', '📈提升市场', '👥扩大团队']
          },
          {
            id: 'hard_05_b',
            text: '专注国内，巩固基本盘',
            effects: { funds: 5, team: 1, market: 5, morale: 0 },
            outcome: '国内市场稳定，但错失全球化窗口。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '📈巩固市场', '👥保持现状']
          },
          {
            id: 'hard_05_c',
            text: '直接进入欧洲高端市场',
            effects: { funds: -40, team: 4, market: 10, morale: -5 },
            outcome: '品牌认知度不足，高端化之路异常艰难。',
            historicalChoice: false,
            tags: ['💰高风险', '🚀激进扩张']
          }
        ],
        historicalNote: '先在印度等新兴市场建立规模，再逐步向高端市场渗透，是雷鸣的国际化路径。'
      },
      {
        id: 'hard_06',
        year: 2020,
        title: '高端化之路',
        scene: '智能家居展示间.png',
        narrative: '你的手机销量已经很高，但利润率微薄，品牌被贴上"低端"标签。是时候冲击高端了吗？',
        choices: [
          {
            id: 'hard_06_a',
            text: '推出高端子品牌，死磕技术',
            effects: { funds: 5, team: 6, market: 20, morale: 15 },
            outcome: '高端机型逐渐获得认可，品牌形象开始升级，利润率也明显改善。',
            historicalChoice: true,
            tags: ['🔥高回报', '👥扩大团队', '📈提升市场']
          },
          {
            id: 'hard_06_b',
            text: '继续坚守性价比，不碰高端',
            effects: { funds: 10, team: 0, market: 5, morale: -5 },
            outcome: '销量依旧庞大，但利润空间被进一步压缩。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥保持现状', '💰低风险']
          },
          {
            id: 'hard_06_c',
            text: '直接涨价，标榜高端',
            effects: { funds: 5, team: 1, market: -10, morale: -10 },
            outcome: '老用户流失，新用户不买单，销量下滑。',
            historicalChoice: false,
            tags: ['💰高风险', '📈牺牲市场', '⚡打击士气']
          }
        ],
        historicalNote: '雷鸣选择用技术创新和独立高端线打破"低端"标签，这被证明是一条漫长但正确的路。'
      },
      {
        id: 'hard_07',
        year: 2021,
        title: '造车抉择',
        scene: '港口集装箱码头.png',
        narrative: '手机业务增长见顶，智能电动汽车是下一个万亿级赛道。你已经 52 岁，是安享成果，还是押上一切再创业？',
        choices: [
          {
            id: 'hard_07_a',
            text: '全力造车，押注未来',
            effects: { funds: -20, team: 8, market: 15, morale: 20 },
            outcome: '你宣布造车，舆论哗然。这可能是你人生中最后一次重大创业，也是赌注最大的一次。',
            historicalChoice: true,
            tags: ['💰高风险', '🔥高回报', '🚀激进扩张']
          },
          {
            id: 'hard_07_b',
            text: '投资造车公司，不亲自下场',
            effects: { funds: -20, team: 2, market: 5, morale: 5 },
            outcome: '你以投资人的身份参与汽车赛道，风险可控，但也错失了主导权。',
            historicalChoice: false,
            tags: ['💰低风险', '🤝合作共赢']
          },
          {
            id: 'hard_07_c',
            text: '专注手机和 IoT，不碰汽车',
            effects: { funds: 15, team: 0, market: 0, morale: -5 },
            outcome: '你守住基本盘，但可能错过下一个时代。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥保持现状']
          }
        ],
        historicalNote: '雷鸣宣布"愿意押上人生全部的声誉和成就，为小米汽车而战"。这是他创业生涯中最孤注一掷的决定。'
      }
    ]
  },
  retail: {
    id: 'retail',
    name: '黄正',
    avatar: '🛒',
    portrait: '黄正.png',
    industry: '消费 · 零售',
    era: '2015 - 2023',
    desc: '从下沉市场切入，用社交裂变和极致低价挑战电商巨头。',
    initialState: { funds: 60, team: 4, market: 5, morale: 80 },
    maxState: { funds: 100, team: 20, market: 100, morale: 100 },
    nodes: [
      {
        id: 'ret_01',
        year: 2015,
        title: '寻找切入点',
        scene: '农田果园.png',
        narrative: '电商市场似乎已经饱和，阿里和京东两分天下。你发现一个被忽视的人群：三四线城市和中老年用户。他们也对网购有需求，但现有平台不够便宜、不够简单。',
        choices: [
          {
            id: 'ret_01_a',
            text: '聚焦下沉市场，做低价拼团',
            effects: { funds: -15, team: 2, market: 25, morale: 15 },
            outcome: '你切入了空白市场，用户增长曲线陡峭上升。',
            historicalChoice: true,
            tags: ['🔥爆发增长', '📈提升市场', '🚀激进扩张']
          },
          {
            id: 'ret_01_b',
            text: '做一二线城市高端电商',
            effects: { funds: -30, team: 3, market: 5, morale: -5 },
            outcome: '巨头优势明显，你很难分到蛋糕。',
            historicalChoice: false,
            tags: ['💰高风险', '📈牺牲市场']
          },
          {
            id: 'ret_01_c',
            text: '做跨境电商，卖海外商品',
            effects: { funds: -25, team: 2, market: 10, morale: 5 },
            outcome: '有机会，但供应链和监管风险很大。',
            historicalChoice: false,
            tags: ['💰高风险', '🤝合作共赢']
          }
        ],
        historicalNote: '黄正从下沉市场切入，避开了一二线城市的正面竞争。'
      },
      {
        id: 'ret_02',
        year: 2016,
        title: '补贴大战',
        scene: '移动开发工作室.png',
        narrative: '你的模式开始被巨头注意到，他们有钱、有流量，准备复制你的打法。你如何应对？',
        choices: [
          {
            id: 'ret_02_a',
            text: '跟进补贴，比谁更狠',
            effects: { funds: -30, team: 2, market: 20, morale: 0 },
            outcome: '用户快速增长，但烧钱速度惊人，资金见底。',
            historicalChoice: false,
            tags: ['💸烧钱换规模', '💰高风险', '📈提升市场']
          },
          {
            id: 'ret_02_b',
            text: '控制成本，用游戏化社交裂变',
            effects: { funds: -10, team: 3, market: 25, morale: 15 },
            outcome: '砍一刀、拼团分享成为你的护城河，获客成本远低于对手。',
            historicalChoice: true,
            tags: ['🔥稳扎稳打', '🤝合作共赢', '📈提升市场']
          },
          {
            id: 'ret_02_c',
            text: '避开补贴，转向品牌商家',
            effects: { funds: -5, team: 1, market: 5, morale: 5 },
            outcome: '客单价提升，但失去了低价心智。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '🎯聚焦盈利', '👥保持现状']
          }
        ],
        historicalNote: '黄正用社交裂变降低获客成本，而不是与巨头正面烧钱。'
      },
      {
        id: 'ret_03',
        year: 2017,
        title: '品质质疑',
        scene: '普通办公室.png',
        narrative: '平台上出现大量假冒伪劣商品，舆论开始质疑你是"假货集散地"。这会毁掉品牌，还是低价必然的代价？',
        choices: [
          {
            id: 'ret_03_a',
            text: '严厉打击假货，设立品牌馆',
            effects: { funds: 5, team: 4, market: 10, morale: 10 },
            outcome: '短期投入增加，但用户信任度回升，平台GMV快速增长。',
            historicalChoice: true,
            tags: ['🛡️保守防御', '⚡提振士气', '📈提升市场']
          },
          {
            id: 'ret_03_b',
            text: '坚持极致低价，不管品质',
            effects: { funds: 10, team: 0, market: -15, morale: -15 },
            outcome: 'GMV 继续上涨，但监管风险和品牌危机越来越大。',
            historicalChoice: false,
            tags: ['💰高风险', '📈牺牲市场', '⚡打击士气']
          },
          {
            id: 'ret_03_c',
            text: '全面转型品质电商',
            effects: { funds: -30, team: 3, market: 0, morale: -5 },
            outcome: '你丢掉了原有的低价用户群，增长停滞。',
            historicalChoice: false,
            tags: ['💰高风险', '📈牺牲市场', '⚡打击士气']
          }
        ],
        historicalNote: '在假货危机中，黄正选择加大治理力度，同时保留低价定位，而不是完全放弃基本盘。'
      },
      {
        id: 'ret_04',
        year: 2018,
        title: '农产品上行',
        scene: '危机公关发布会.png',
        narrative: '你发现平台上有大量农产品 sellers，他们苦于没有销路。这是一个机会，但农产品非标、物流难、售后多。',
        choices: [
          {
            id: 'ret_04_a',
            text: '重仓农业，扶持产地直发',
            effects: { funds: -10, team: 5, market: 20, morale: 15 },
            outcome: '你成为农产品上行最大平台，也获得政策和公众好感。',
            historicalChoice: true,
            tags: ['🤝合作共赢', '📈提升市场', '⚡提振士气']
          },
          {
            id: 'ret_04_b',
            text: '只做平台，不参与供应链',
            effects: { funds: 5, team: 1, market: 5, morale: 0 },
            outcome: '质量参差不齐，很难形成差异化。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥保持现状', '💰低风险']
          },
          {
            id: 'ret_04_c',
            text: '自建冷链物流',
            effects: { funds: -35, team: 6, market: 15, morale: -5 },
            outcome: '投入巨大，但长期壁垒深厚。',
            historicalChoice: false,
            tags: ['💸烧钱换规模', '💰高风险', '👥扩大团队']
          }
        ],
        historicalNote: '农产品上行成为平台的重要护城河和社会价值来源。'
      },
      {
        id: 'ret_05',
        year: 2019,
        title: '百亿补贴',
        scene: '电商大促狂欢夜.png',
        narrative: '用户心智仍停留在"便宜但可能假货"。你想改变形象，吸引更多一二线城市用户。',
        choices: [
          {
            id: 'ret_05_a',
            text: '百亿补贴正品大牌',
            effects: { funds: -10, team: 3, market: 30, morale: 10 },
            outcome: 'iPhone、茅台等硬通货补贴出圈，一二线城市用户开始改观。',
            historicalChoice: true,
            tags: ['💸烧钱换规模', '📈提升市场', '⚡提振士气']
          },
          {
            id: 'ret_05_b',
            text: '继续低价白牌商品',
            effects: { funds: -10, team: 1, market: 5, morale: -5 },
            outcome: '原有用户满意，但向上突破困难。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥保持现状', '💰低风险']
          },
          {
            id: 'ret_05_c',
            text: '完全放弃低价，做品质升级',
            effects: { funds: -30, team: 2, market: -10, morale: -10 },
            outcome: '老用户流失，新用户又不信任你的品质形象。',
            historicalChoice: false,
            tags: ['💰高风险', '📈牺牲市场', '⚡打击士气']
          }
        ],
        historicalNote: '百亿补贴用真金白银买了一张"正品低价"的信任入场券。'
      },
      {
        id: 'ret_06',
        year: 2020,
        title: '危机与扩张',
        scene: '农场仓库.png',
        narrative: '疫情突如其来，供应链和物流都受到冲击。同时，社区团购等新战场又出现。你怎么办？',
        choices: [
          {
            id: 'ret_06_a',
            text: '坚守电商主业，不盲目扩张',
            effects: { funds: 15, team: 2, market: 10, morale: 10 },
            outcome: '主业稳健增长，但在新战场上落后。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥保持现状', '💰低风险']
          },
          {
            id: 'ret_06_b',
            text: '大举进入社区团购',
            effects: { funds: 5, team: 5, market: 20, morale: -5 },
            outcome: '新业务发展迅速，虽然亏损但成功吸引了新一轮融资，舆论争议不断。',
            historicalChoice: true,
            tags: ['💸烧钱换规模', '🚀激进扩张', '📈提升市场']
          },
          {
            id: 'ret_06_c',
            text: '收缩业务，储备现金过冬',
            effects: { funds: 30, team: -3, market: -5, morale: -10 },
            outcome: '你度过了危机，但增长放缓。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '👥精简团队', '💰低风险']
          }
        ],
        historicalNote: '黄正选择进攻社区团购等新赛道，用扩张对抗不确定性，但也付出了巨大代价。'
      },
      {
        id: 'ret_07',
        year: 2022,
        title: 'Temu出海',
        scene: '城市夜景.png',
        narrative: '虽然你已经卸任CEO，但作为创始人你仍关注公司的第二增长曲线。团队提出了出海方案，国内增长见顶，海外市场成为必答题。',
        choices: [
          {
            id: 'ret_07_a',
            text: '复制拼团模式出海',
            effects: { funds: -10, team: 4, market: 25, morale: 10 },
            outcome: '海外版 App 在多个国家进入下载榜前列。',
            historicalChoice: true,
            tags: ['🚀激进扩张', '📈提升市场', '👥扩大团队']
          },
          {
            id: 'ret_07_b',
            text: '深耕国内，不做海外',
            effects: { funds: 10, team: 1, market: 0, morale: 0 },
            outcome: '国内基本盘稳固，但天花板明显。',
            historicalChoice: false,
            tags: ['🛡️保守防御', '📈巩固市场', '👥保持现状']
          },
          {
            id: 'ret_07_c',
            text: '收购海外本地电商',
            effects: { funds: -50, team: 5, market: 15, morale: 5 },
            outcome: '获得本地团队和资源，但整合风险巨大。',
            historicalChoice: false,
            tags: ['💰高风险', '🤝合作共赢', '👥扩大团队']
          }
        ],
        historicalNote: '将已被验证的低价拼团模式复制到海外，是黄正寻找第二增长曲线的选择。'
      }
    ]
  }
};

// 角色名称映射（用于复盘显示）
const CHARACTER_NAMES = {
  internet: '马风',
  hardware: '雷鸣',
  retail: '黄正'
};
