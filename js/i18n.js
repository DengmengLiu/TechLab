// i18n.js - Simple internationalization module
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.lab': 'Lab',
    'nav.github': 'GitHub',
    
    // Hero Section
    'hero.title': 'Transform Hard-Core Knowledge into',
    'hero.titleHighlight': 'Interactive Experiences',
    'hero.description': 'Welcome to my personal tech exploration lab. I love breaking down complex algorithms, mathematics, and graphics principles into interactive web experiences you can explore by dragging, dropping, and adjusting sliders.',
    'hero.cta': 'Explore Lab ↓',
    
    // Projects Section
    'projects.title': 'Interactive Tech Shares',
    'projects.subtitle': 'Click on cards to enter immersive learning experiences.',
    
    // Bézier Curves Card
    'card.bezier.title': 'Bézier Curves: Foundation of Graphics',
    'card.bezier.description': 'From simple linear interpolation to De Casteljau algorithm. Drag control points to intuitively understand tangents, bounding boxes, and the arc-length challenge in game engines.',
    'card.bezier.tag1': 'Graphics',
    'card.bezier.tag2': 'Mathematics',
    'card.bezier.cta': 'Explore Demo',
    
    // Terrain Generation Card
    'card.terrain.title': 'The Magic Behind Infinite Worlds: Procedural Terrain',
    'card.terrain.description': 'How does Minecraft generate infinite maps? Walk through step-by-step from pure randomness and value noise to Perlin noise, and tune FBM parameters to generate realistic terrain.',
    'card.terrain.tag1': 'Algorithms',
    'card.terrain.tag2': 'Game Development',
    'card.terrain.cta': 'Explore Demo',
    
    // Coming Soon Card
    'card.coming.title': 'Next Topic Coming...',
    'card.coming.description': 'Possibly about pathfinding algorithms, state machines, or UI easing animations.',
    
    // Footer
    'footer.copyright': '© 2024 Interactive Tech Lab. Built with Tailwind CSS & Vanilla JS.'
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.lab': '实验室',
    'nav.github': 'GitHub',
    
    // Hero Section
    'hero.title': '把硬核知识变成',
    'hero.titleHighlight': '交互体验',
    'hero.description': '这里是我的个人技术分享实验室。我喜欢把枯燥的算法、数学和图形学原理，拆解成可以通过鼠标拖拽、滑块调节的交互式网页。',
    'hero.cta': '探索实验室 ↓',
    
    // Projects Section
    'projects.title': '互动分享系列 (Tech Shares)',
    'projects.subtitle': '点击卡片进入沉浸式讲解页面。',
    
    // Bézier Curves Card
    'card.bezier.title': '贝塞尔曲线：图形学的基石',
    'card.bezier.description': '从简单的线性插值到 De Casteljau 算法。通过拖拽控制点，直观理解切线、包围盒以及游戏引擎中的弧长匀速难题。',
    'card.bezier.tag1': '图形学',
    'card.bezier.tag2': '数学',
    'card.bezier.cta': '进入演示',
    
    // Terrain Generation Card
    'card.terrain.title': '无限世界背后的魔力：地形生成',
    'card.terrain.description': '《我的世界》是如何生成无限地图的？一步步带你从纯随机、值噪声走到柏林噪声，亲手调节 FBM 参数生成真实山脉。',
    'card.terrain.tag1': '算法',
    'card.terrain.tag2': '游戏开发',
    'card.terrain.cta': '进入演示',
    
    // Coming Soon Card
    'card.coming.title': '下一个主题正在路上...',
    'card.coming.description': '可能是关于寻路算法、状态机或者是 UI 缓动动画。',
    
    // Footer
    'footer.copyright': '© 2024 Interactive Tech Lab. Built with Tailwind CSS & Vanilla JS.'
  }
};

class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('preferred-language') || 'en';
    this.init();
  }

  init() {
    // Set document language attribute
    document.documentElement.lang = this.currentLanguage;
    // Apply translations on page load
    this.updateAllTranslations();
  }

  t(key) {
    const keys = key.split('.');
    let value = translations[this.currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key; // Fallback to key if translation not found
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('preferred-language', lang);
      document.documentElement.lang = lang;
      this.updateAllTranslations();
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    }
  }

  updateAllTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    
    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// Initialize i18n instance
const i18n = new I18n();
