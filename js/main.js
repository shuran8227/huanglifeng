/**
 * 月嫂在线简历 - 交互脚本
 * 功能：图片灯箱 · 返回顶部 · 滚动动画 · 触摸滑动
 * 零依赖，原生JS实现
 */
(function () {
  'use strict';

  // ==================== 图片灯箱 ====================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev = lightbox.querySelector('.lightbox__prev');
  const btnNext = lightbox.querySelector('.lightbox__next');
  const overlay = lightbox.querySelector('.lightbox__overlay');

  let currentGroup = [];    // 当前组的图片元素
  let currentIndex = 0;     // 当前显示图片在组内的索引
  let touchStartX = 0;
  let touchEndX = 0;

  /**
   * 初始化灯箱：给所有 [data-lightbox] 元素绑定点击事件
   */
  function initLightbox() {
    // 按 data-lightbox 值分组
    var groups = {};
    var items = document.querySelectorAll('[data-lightbox]');
    items.forEach(function (item) {
      var groupName = item.getAttribute('data-lightbox');
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    });

    // 绑定点击事件
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var groupName = item.getAttribute('data-lightbox');
        currentGroup = groups[groupName];
        currentIndex = currentGroup.indexOf(item);
        showImage(currentIndex);
        openLightbox();
      });
    });
  }

  function openLightbox() {
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
    // 延迟清除图片，避免看到切换
    setTimeout(function () {
      lightboxImg.src = '';
    }, 300);
  }

  function showImage(index) {
    if (currentGroup.length === 0) return;
    currentIndex = index;
    var imgEl = currentGroup[currentIndex].querySelector('img');
    if (imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || '';
    }
    lightboxCounter.textContent =
      (currentIndex + 1) + ' / ' + currentGroup.length;

    // 控制导航按钮显示
    btnPrev.style.display = currentGroup.length > 1 ? '' : 'none';
    btnNext.style.display = currentGroup.length > 1 ? '' : 'none';
  }

  function showPrev() {
    var newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = currentGroup.length - 1;
    showImage(newIndex);
  }

  function showNext() {
    var newIndex = currentIndex + 1;
    if (newIndex >= currentGroup.length) newIndex = 0;
    showImage(newIndex);
  }

  // 关闭按钮
  btnClose.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', closeLightbox);

  // 上一张/下一张
  btnPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    showPrev();
  });
  btnNext.addEventListener('click', function (e) {
    e.stopPropagation();
    showNext();
  });

  // 键盘导航
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('lightbox--open')) return;
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });

  // 触摸滑动（移动端左右滑动切换图片）
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    // 滑动超过50px才触发
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  });

  // 防止灯箱内的图片拖拽
  lightboxImg.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });

  // ==================== 返回顶部按钮 ====================
  var backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.scrollY > window.innerHeight) {
      backToTop.classList.add('back-to-top--visible');
    } else {
      backToTop.classList.remove('back-to-top--visible');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==================== 滚动渐显动画 ====================
  function initScrollAnimation() {
    // 给需要动画的元素加上类名
    var targets = document.querySelectorAll('.section, .card, .gallery__item');
    targets.forEach(function (el) {
      el.classList.add('animate-on-scroll');
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll--visible');
            // 可见后就不再观察
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ==================== 初始化 ====================
  function init() {
    initLightbox();
    initScrollAnimation();

    // 滚动监听（返回顶部按钮）
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    // 初始检查一次
    toggleBackToTop();
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
