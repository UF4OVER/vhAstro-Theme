export default {
  Title: 'UF4的动态',
  Site: 'https://uf4.top',
  Subtitle: '好戏存烟火，且看且丛容',
  Description: '热爱硬件与PYQT的大学生',
  Author: 'UF4',
  Motto: '没有实力，全是开源',
  Avatar: 'https://zycs-img-c5u.pages.dev/v2/0SvXlBD.jpeg',
  // Cover 网站缩略图
  Cover: '',
  // 网站创建时间
  CreateTime: '2025-02-01',
  // 首页打字机文案列表
  TypeWriteList: [
    '悠哉的帕鲁惹人爱',
    "啦~啦啦~啦啦~啦~啦",
  ],
  // 顶部 Banner 配置
  HomeBanner: {
    enable: true,
    cover: 'https://api.vvhan.com/api/wallpaper/acg'
  },
  // 博客主题配置
  Theme: {
    // 颜色请用 16 进制颜色码
    // 主题颜色
    "--vh-main-color": "rgba(232,159,28,0.78)",
    // 字体颜色
    "--vh-font-color": "#000000",
    // 侧边栏宽度
    "--vh-aside-width": "333px",
    // 全局圆角
    "--vh-main-radius": "1rem",
    // 主体内容宽度
    "--vh-main-max-width": "1458px",
  },
  // 导航栏 (新窗口打开 newWindow: true)
  Navs: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    // { text: '朋友', link: '/links', icon: 'Nav_friends' },
    // { text: '圈子', link: '/friends', icon: 'Nav_rss' },
    { text: '空间', link: '/talking', icon: 'Nav_talking' },
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    // { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
    // { text: 'API', link: 'https://api.vvhan.com/', target: true, icon: 'Nav_link' },
  ],
  // 侧边栏个人网站
  WebSites: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: 'Github', link: 'https://github.com/UF4OVER', icon: 'WebSite_github' },
    // { text: '韩小韩API', link: 'https://api.vvhan.com', icon: 'WebSite_api' },
    // { text: '每日热榜', link: 'https://hot.vvhan.com', icon: 'WebSite_hot' },
    { text: 'UF4の图床', link: 'https://img.uf4.top', icon: 'WebSite_img' },
    { text: 'UF4 Analytic', link: 'https://analytic.uf4.top', icon: 'WebSite_analytics' },
  ],
  // 侧边栏展示
  AsideShow: {
    // 是否展示个人网站
    WebSitesShow: true,
    // 是否展示公告
    TipsShow: true,
    // 是否展示数量统计
    CountShow: true,
    // 是否展示分类
    CategoriesShow: true,
    // 是否展示个人标签
    TagsShow: true,
    // 是否展示推荐文章
    recommendArticleShow: true
  },
  // DNS预解析地址
  DNSOptimization: [
    'https://i0.wp.com',
    'https://analytic.uf4.top',
    'https://vh-api.4ce.cn',
    'https://registry.npmmirror.com',
  ],
  // 博客音乐组件解析接口
  vhMusicApi: 'https://vh-api.4ce.cn/blog/meting',
  // 评论组件（只允许同时开启一个）
  Comment: {
    // Twikoo 评论
    Twikoo: {
      enable: false,
      envId: ''
    },
    // Waline 评论
    Waline: {
      enable: false,
      serverURL: ''
    }
  },
  // Han Analytics 统计（https://github.com/uxiaohan/HanAnalytics）
  HanAnalytics: { enable: true, server: 'https://analytic.uf4.top', siteId: 'UF4Blog' },
  // Google 广告
  GoogleAds: {
    ad_Client: '', //ca-pub-xxxxxx
    // 侧边栏广告(不填不开启)
    asideAD_Slot: ``,
    // 文章页广告(不填不开启)
    articleAD_Slot: ``
  },
  // 文章内赞赏码
  Reward: {
    // 支付宝收款码
    AliPay: '',
    // 微信收款码
    WeChat: ''
  }
}