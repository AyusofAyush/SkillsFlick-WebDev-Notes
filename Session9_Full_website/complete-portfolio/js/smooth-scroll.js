// ===== SMOOTH SCROLLING & NAVIGATION =====

class SmoothScroll {
    constructor(options = {}) {
        this.options = {
            duration: 800,
            easing: 'easeInOutCubic',
            offset: 80, // Header offset
            updateURL: true,
            ...options
        };
        
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.currentSection = null;
        
        this.init();
    }
    
    init() {
        this.setupScrollLinks();
        this.setupSectionObserver();
        this.setupScrollToTop();
        this.setupKeyboardNavigation();
        
        console.log('🚀 Smooth scroll system initialized');
    }
    
    setupScrollLinks() {
        // Handle anchor links
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#" or empty
                if (!href || href === '#') return;
                
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                    
                    // Update active nav link
                    this.updateActiveNavLink(link);
                    
                    // Update URL if enabled
                    if (this.options.updateURL) {
                        history.pushState(null, null, href);
                    }
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    setupSectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;
        
        const observerOptions = {
            root: null,
            rootMargin: `-${this.options.offset}px 0px -70% 0px`,
            threshold: 0
        };
        
        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                    this.updateNavigationHighlight(entry.target.id);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            this.sectionObserver.observe(section);
        });
    }
    
    setupScrollToTop() {
        // Create scroll to top button
        const scrollToTopBtn = this.createScrollToTopButton();
        document.body.appendChild(scrollToTopBtn);
        
        // Show/hide button based on scroll position
        let scrollY = 0;
        
        const toggleButton = () => {
            const currentScrollY = window.pageYOffset;
            
            if (currentScrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
            
            // Add direction class for animation
            if (currentScrollY > scrollY) {
                scrollToTopBtn.classList.add('scrolling-down');
            } else {
                scrollToTopBtn.classList.remove('scrolling-down');
            }
            
            scrollY = currentScrollY;
        };
        
        // Throttle scroll events
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    toggleButton();
                    this.handleScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Button click handler
        scrollToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });
    }
    
    createScrollToTopButton() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('aria-label', 'Scroll to top');
        
        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 3rem;
            height: 3rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        
        return button;
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Arrow key navigation
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.navigateToSection('prev');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.navigateToSection('next');
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.scrollToTop();
                        break;
                    case 'End':
                        e.preventDefault();
                        this.scrollToBottom();
                        break;
                }
            }
        });
    }
    
    scrollToElement(element) {
        if (this.isScrolling) return;
        
        const targetPosition = this.getElementPosition(element);
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        
        if (Math.abs(distance) < 10) return; // Already close enough
        
        this.isScrolling = true;
        this.animateScroll(startPosition, targetPosition, this.options.duration);
        
        // Focus management for accessibility
        setTimeout(() => {
            element.setAttribute('tabindex', '-1');
            element.focus();
            element.removeAttribute('tabindex');
        }, this.options.duration);
    }
    
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return rect.top + scrollTop - this.options.offset;
    }
    
    animateScroll(start, end, duration) {
        const startTime = performance.now();
        
        const scroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const eased = this.easing[this.options.easing](progress);
            const position = start + (end - start) * eased;
            
            window.scrollTo(0, position);
            
            if (progress < 1) {
                requestAnimationFrame(scroll);
            } else {
                this.isScrolling = false;
            }
        };
        
        requestAnimationFrame(scroll);
    }
    
    // Easing functions
    easing = {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => t * (2 - t),
        easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => (--t) * t * t + 1,
        easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: (t) => t * t * t * t,
        easeOutQuart: (t) => 1 - (--t) * t * t * t,
        easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
        easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
        easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2
    };
    
    updateNavigationHighlight(sectionId) {
        // Update navigation links
        const navLinks = document.querySelectorAll('nav a, .nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                const linkSection = href.substring(1);
                
                if (linkSection === sectionId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
        
        // Update page indicator if exists
        this.updatePageIndicator(sectionId);
    }
    
    updateActiveNavLink(clickedLink) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('nav a, .nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        clickedLink.classList.add('active');
    }
    
    updatePageIndicator(sectionId) {
        const indicator = document.querySelector('.page-indicator');
        if (!indicator) return;
        
        const dots = indicator.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            const dotSection = dot.getAttribute('data-section');
            if (dotSection === sectionId) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    navigateToSection(direction) {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        if (sections.length === 0) return;
        
        const currentIndex = sections.findIndex(section => section.id === this.currentSection);
        
        let targetIndex;
        
        if (direction === 'next') {
            targetIndex = currentIndex + 1;
            if (targetIndex >= sections.length) targetIndex = 0; // Loop to first
        } else {
            targetIndex = currentIndex - 1;
            if (targetIndex < 0) targetIndex = sections.length - 1; // Loop to last
        }
        
        this.scrollToElement(sections[targetIndex]);
    }
    
    scrollToTop() {
        this.scrollToElement(document.body);
    }
    
    scrollToBottom() {
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        window.scrollTo({
            top: documentHeight,
            behavior: 'smooth'
        });
    }
    
    handleScrollProgress() {
        const progressBars = document.querySelectorAll('.scroll-progress');
        
        if (progressBars.length === 0) return;
        
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBars.forEach(bar => {
            bar.style.width = `${Math.min(progress, 100)}%`;
        });
    }
    
    closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            
            // Re-enable scroll
            document.body.style.overflow = '';
        }
    }
    
    // Parallax scrolling effect
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
    
    // Create page indicator dots
    createPageIndicator() {
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length <= 1) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'page-indicator';
        indicator.style.cssText = `
            position: fixed;
            right: 2rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;
        
        sections.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('data-section', section.id);
            dot.setAttribute('aria-label', `Go to ${section.id} section`);
            
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.5);
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            dot.addEventListener('click', () => {
                this.scrollToElement(section);
            });
            
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.2)';
                dot.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            });
            
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = 'scale(1)';
                if (!dot.classList.contains('active')) {
                    dot.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }
            });
            
            indicator.appendChild(dot);
        });
        
        document.body.appendChild(indicator);
        
        return indicator;
    }
    
    // Scroll reveal animation
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        if (revealElements.length === 0) return;
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.getAttribute('data-reveal') || 'fadeInUp';
                    
                    element.style.animation = `${animation} 0.6s ease forwards`;
                    revealObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            element.style.opacity = '0';
            revealObserver.observe(element);
        });
    }
    
    // Hash change handling for browser back/forward
    setupHashChangeHandler() {
        window.addEventListener('hashchange', (e) => {
            const hash = window.location.hash;
            
            if (hash && hash.length > 1) {
                const targetElement = document.getElementById(hash.substring(1));
                
                if (targetElement) {
                    setTimeout(() => {
                        this.scrollToElement(targetElement);
                    }, 100);
                }
            }
        });
        
        // Handle initial hash on page load
        if (window.location.hash) {
            setTimeout(() => {
                const targetElement = document.getElementById(window.location.hash.substring(1));
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            }, 500);
        }
    }
    
    // Public methods
    scrollTo(target) {
        let element;
        
        if (typeof target === 'string') {
            element = document.getElementById(target) || document.querySelector(target);
        } else {
            element = target;
        }
        
        if (element) {
            this.scrollToElement(element);
        }
    }
    
    destroy() {
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
        
        // Remove scroll to top button
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        if (scrollToTopBtn) {
            scrollToTopBtn.remove();
        }
        
        // Remove page indicator
        const pageIndicator = document.querySelector('.page-indicator');
        if (pageIndicator) {
            pageIndicator.remove();
        }
    }
}

// CSS for smooth scroll effects
const smoothScrollStyles = document.createElement('style');
smoothScrollStyles.textContent = `
    .scroll-to-top.visible {
        transform: translateY(0);
        opacity: 1;
    }
    
    .scroll-to-top:hover {
        transform: translateY(0) scale(1.1);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
    }
    
    .scroll-to-top.scrolling-down {
        transform: translateY(0) scale(0.9);
    }
    
    .page-indicator .dot.active {
        background: rgba(255, 255, 255, 0.8);
        border-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }
    
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 1000;
        transition: width 0.1s ease;
    }
    
    /* Scroll reveal animations */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Smooth scroll behavior */
    html {
        scroll-behavior: smooth;
    }
    
    /* Hide scrollbar for cleaner look (optional) */
    .smooth-scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    
    .smooth-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
    }
    
    .smooth-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
    }
    
    .smooth-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%);
    }
    
    /* Navigation active states */
    nav a.active,
    .nav-links a.active {
        color: #667eea !important;
        position: relative;
    }
    
    nav a.active::after,
    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        transform: scaleX(1);
        transition: transform 0.3s ease;
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 1rem !important;
            right: 1rem !important;
            width: 2.5rem !important;
            height: 2.5rem !important;
        }
        
        .page-indicator {
            right: 1rem !important;
        }
        
        .page-indicator .dot {
            width: 10px !important;
            height: 10px !important;
        }
    }
`;
document.head.appendChild(smoothScrollStyles);

// Initialize smooth scroll
let smoothScroll;

document.addEventListener('DOMContentLoaded', () => {
    smoothScroll = new SmoothScroll({
        duration: 800,
        easing: 'easeInOutCubic',
        offset: 80
    });
    
    // Setup additional features
    smoothScroll.setupParallax();
    smoothScroll.createPageIndicator();
    smoothScroll.setupScrollReveal();
    smoothScroll.setupHashChangeHandler();
    
    // Add scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
});

// Export for external use
window.SmoothScroll = SmoothScroll;