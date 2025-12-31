/**
 * 博客核心JavaScript - Bootstrap 5.3 版本
 * 功能：主题切换、搜索、目录生成、滚动处理等
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initThemeToggle();
    initSearch();
    initTOC();
    initScrollBehavior();
    initBackToTop();
    initShareButtons();
    initReadingProgress();
    initPageTransition();
    initSnow();
    initTextTruncation();
    
    // 初始化KaTeX自动渲染
    renderMathInElement(document.body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ]
    });
});

/**
 * 主题切换功能
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (!themeToggle) return;
    
    // 更新图标显示
    function updateIcon() {
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        if (themeIcon) {
            themeIcon.className = isDark ? 'bi bi-sun-fill fs-5' : 'bi bi-moon-fill fs-5';
        }
        // 同步代码高亮主题
        switchCodeTheme(isDark ? 'dark' : 'light');
    }
    
    // 初始化图标
    updateIcon();
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon();
    });
}

/**
 * 雪花效果
 */
function initSnow() {
    // 创建雪花容器
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    document.body.appendChild(snowContainer);
    
    // 雪花数量
    const snowflakeCount = 100;
    
    // 生成雪花
    for (let i = 0; i < snowflakeCount; i++) {
        createSnowflake(snowContainer);
    }
}

/**
 * 创建单个雪花
 */
function createSnowflake(container) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // 随机雪花大小（2-6px）
    const size = Math.random() * 4 + 2;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    
    // 随机初始位置
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.top = '-10px';
    
    // 随机动画持续时间（5-15秒）
    const duration = Math.random() * 10 + 5;
    snowflake.style.animationDuration = `${duration}s`;
    
    // 随机动画延迟
    snowflake.style.animationDelay = `${Math.random() * 5}s`;
    
    // 随机漂移距离（-50px到50px）
    const drift = (Math.random() - 0.5) * 100;
    snowflake.style.setProperty('--drift', `${drift}px`);
    
    // 添加到容器
    container.appendChild(snowflake);
    
    // 雪花结束动画后重新创建
    snowflake.addEventListener('animationend', () => {
        container.removeChild(snowflake);
        createSnowflake(container);
    });
}

/**
 * 切换代码高亮主题
 */
function switchCodeTheme(theme) {
    const lightTheme = document.getElementById('prism-light-theme');
    const darkTheme = document.getElementById('prism-dark-theme');
    
    if (theme === 'dark') {
        if (lightTheme) lightTheme.disabled = true;
        if (darkTheme) darkTheme.disabled = false;
    } else {
        if (lightTheme) lightTheme.disabled = false;
        if (darkTheme) darkTheme.disabled = true;
    }
}

/**
 * 搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchModal = document.getElementById('searchModal');
    
    if (!searchInput || !searchResults) return;
    
    let fuse = null;
    let searchData = null;
    
    // 加载搜索数据
    // 使用相对路径或根据当前域名动态构建路径，确保在不同部署环境下都能正确访问
    const searchUrl = window.location.origin + '/search.json';
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            searchData = data;
            fuse = new Fuse(searchData, {
                keys: ['title', 'content', 'excerpt'],
                threshold: 0.4,
                includeScore: true
            });
        })
        .catch(error => console.error('加载搜索数据失败:', error));
    
    // 搜索输入事件
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (!query || !fuse) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = fuse.search(query).slice(0, 6);
        
        if (results.length > 0) {
            searchResults.innerHTML = results.map(result => `
                <a href="${result.item.url}" class="list-group-item list-group-item-action">
                    <div class="fw-medium">${result.item.title}</div>
                    <small class="text-muted text-truncate d-block">${result.item.excerpt || ''}</small>
                </a>
            `).join('');
        } else {
            searchResults.innerHTML = `
                <div class="list-group-item text-center text-muted py-4">
                    <i class="bi bi-search fs-3 d-block mb-2"></i>
                    未找到相关内容
                </div>
            `;
        }
    });
    
    // 模态框显示时聚焦搜索框
    if (searchModal) {
        searchModal.addEventListener('shown.bs.modal', function() {
            searchInput.focus();
        });
        
        // 模态框关闭时清空
        searchModal.addEventListener('hidden.bs.modal', function() {
            searchInput.value = '';
            searchResults.innerHTML = '';
        });
    }
}

/**
 * 目录生成 - 最多两级（h2, h3）
 */
function initTOC() {
    const tocList = document.getElementById('tocList');
    const postContent = document.getElementById('postContent');
    const tocContainer = document.querySelector('.toc-container');
    
    if (!tocList || !postContent) return;
    
    // 只获取h2和h3标题（最多两级）
    const headings = postContent.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
        const tocWrapper = tocList.closest('.card');
        if (tocWrapper) {
            tocWrapper.style.display = 'none';
        }
        return;
    }
    
    // 为标题添加ID并生成目录
    let html = '';
    headings.forEach((heading, index) => {
        // 确保标题有ID
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;
        const levelClass = level === 'h3' ? 'toc-h3' : '';
        
        html += `
            <li class="nav-item">
                <a class="nav-link ${levelClass}" href="#${heading.id}">${text}</a>
            </li>
        `;
    });
    
    tocList.innerHTML = html;
    
    // 滚动高亮当前标题
    const tocLinks = tocList.querySelectorAll('.nav-link');
    let ticking = false;
    
    function updateActiveTOC() {
        const scrollY = window.pageYOffset;
        let current = '';
        
        headings.forEach(heading => {
            const headingTop = heading.offsetTop - 100;
            if (scrollY >= headingTop) {
                current = heading.id;
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                
                // 自动滚动目录容器，使当前项可见
                if (tocContainer) {
                    const linkRect = link.getBoundingClientRect();
                    const containerRect = tocContainer.getBoundingClientRect();
                    
                    // 如果当前项不在可视区域内，滚动到中间位置
                    if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
                        const scrollTop = link.offsetTop - tocContainer.offsetHeight / 2 + link.offsetHeight / 2;
                        tocContainer.scrollTo({
                            top: scrollTop,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveTOC);
            ticking = true;
        }
    });
    
    // 初始化
    updateActiveTOC();
}

/**
 * 滚动行为处理 - 导航栏隐藏/显示
 */
function initScrollBehavior() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let scrollThreshold = 100; // 滚动超过100px才触发隐藏
    let ticking = false;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 只在文章详情页隐藏导航栏
        const isArticlePage = document.querySelector('.post-content');
        
        if (isArticlePage && scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // 向下滚动 - 隐藏导航栏
                navbar.classList.add('navbar-hidden');
            } else {
                // 向上滚动 - 显示导航栏
                navbar.classList.remove('navbar-hidden');
            }
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
}

/**
 * 返回顶部按钮
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
            backToTop.style.display = 'flex';
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * 分享按钮功能
 */
function initShareButtons() {
    // 微信分享
    window.shareToWechat = function() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}`;
        
        // 创建模态框显示二维码
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title"><i class="fab fa-weixin text-success me-2"></i>微信分享</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${qrUrl}" alt="微信二维码" class="img-fluid mb-3">
                        <p class="small text-muted">扫描二维码分享到微信</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', function() {
            modal.remove();
        });
    };
    
    // 复制链接防恶意点击配置
    let copyClickCount = 0;
    let copyCooldownEndTime = 0;
    let copyCooldownDuration = 10000; // 10秒冷却时间
    
    // 复制链接
    window.copyLink = function() {
        const url = window.location.href;
        const now = Date.now();
        
        // 检查是否在冷却期
        if (copyCooldownEndTime > now) {
            // 计算剩余冷却时间（秒）
            const remainingSeconds = Math.ceil((copyCooldownEndTime - now) / 1000);
            showToast(`${remainingSeconds}s后再试`);
            return;
        } else if (copyCooldownEndTime > 0 && copyCooldownEndTime <= now) {
            // 冷却期结束，重置点击计数
            copyClickCount = 0;
            // 重置冷却结束时间标志
            copyCooldownEndTime = 0;
        }
        
        // 增加点击计数
        copyClickCount++;
        
        // 检查点击次数，前2次正常复制
        if (copyClickCount <= 2) {
            // 执行复制操作
            performCopy(url);
        } else {
            // 第3次及以后点击，设置冷却时间
            copyCooldownEndTime = now + copyCooldownDuration;
            showToast('10s后再试');
        }
    };
    
    // 执行复制操作
    function performCopy(url) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                // 使用现代 API
                navigator.clipboard.writeText(url).then(function() {
                    showToast('链接已复制到剪贴板');
                }).catch(function() {
                    // 现代 API 失败，执行降级方案
                    fallbackCopyTextToClipboard(url);
                });
            } else {
                // 不支持现代 API，执行降级方案
                fallbackCopyTextToClipboard(url);
            }
        } catch (error) {
            // 捕获所有异常，执行降级方案
            fallbackCopyTextToClipboard(url);
        }
    }
    
    // 降级复制方案
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        document.body.appendChild(textArea);
        
        try {
            textArea.select();
            textArea.setSelectionRange(0, text.length);
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('链接已复制到剪贴板');
            } else {
                showToast('复制失败，请手动复制');
            }
        } catch (error) {
            showToast('复制失败，请手动复制');
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

/**
 * 显示Toast提示
 */
function showToast(message) {
    // 检查是否已存在toast容器
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
    container.appendChild(toast);
    
    // 3秒后移除
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 阅读进度条
 */
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * 代码高亮初始化
 */
if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
}

/**
 * 页面过渡动画
 */
function initPageTransition() {
    // 给主内容区域添加过渡动画类
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('page-transition');
    }
    
    // 翻页链接点击效果
    const pageLinks = document.querySelectorAll('.pagination .page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果是禁用状态，不处理
            if (this.closest('.page-item').classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            
            // 添加点击动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 添加页面淡出效果
            const postList = document.querySelector('.post-list');
            if (postList) {
                postList.style.opacity = '0';
                postList.style.transform = 'translateY(-10px)';
                postList.style.transition = 'all 0.3s ease';
            }
        });
    });
}

/**
 * 文字智能截断
 * 汉字算 1，其他字符算 0.5
 * 标题最多 26 个汉字等效长度
 * 简介最多 26 个汉字等效长度
 */
function initTextTruncation() {
    // 计算字符串的视觉长度（汉字=1，其他=0.5）
    function getVisualLength(str) {
        let length = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            // 判断是否为汉字或全角字符
            if (/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(char)) {
                length += 1;
            } else {
                length += 0.5;
            }
        }
        return length;
    }
    
    // 截断字符串到指定视觉长度
    function truncateByVisualLength(str, maxLength) {
        let length = 0;
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            // 判断是否为汉字或全角字符
            if (/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(char)) {
                length += 1;
            } else {
                length += 0.5;
            }
            if (length > maxLength) {
                return result + '...';
            }
            result += char;
        }
        return result;
    }
    
    // 处理标题
    const titleElements = document.querySelectorAll('.post-title-text');
    titleElements.forEach(el => {
        const fullTitle = el.getAttribute('data-full-title') || el.textContent;
        if (getVisualLength(fullTitle) > 26) {
            el.textContent = truncateByVisualLength(fullTitle, 26);
        }
    });
    
    // 处理简介
    const summaryElements = document.querySelectorAll('.post-summary-text');
    summaryElements.forEach(el => {
        const fullSummary = el.getAttribute('data-full-summary') || el.textContent;
        if (getVisualLength(fullSummary) > 32) {
            el.textContent = truncateByVisualLength(fullSummary, 32);
        }
    });
}
