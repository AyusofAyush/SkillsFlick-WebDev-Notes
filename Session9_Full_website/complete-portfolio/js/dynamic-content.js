// ===== DYNAMIC CONTENT MANAGEMENT =====

class DynamicContent {
    constructor() {
        this.contentCache = new Map();
        this.currentLanguage = 'en';
        this.animationQueue = [];
        this.isUpdating = false;
        
        this.init();
    }
    
    init() {
        this.setupContentLoader();
        this.setupTypewriter();
        this.setupCounters();
        this.setupProjectFilter();
        this.setupSkillsAnimation();
        this.setupTestimonials();
        this.setupLanguageSwitcher();
        
        console.log('🎬 Dynamic content system initialized');
    }
    
    // ===== TYPEWRITER EFFECT =====
    setupTypewriter() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const texts = JSON.parse(element.getAttribute('data-typewriter'));
            const speed = parseInt(element.getAttribute('data-speed')) || 100;
            const deleteSpeed = parseInt(element.getAttribute('data-delete-speed')) || 50;
            const pause = parseInt(element.getAttribute('data-pause')) || 2000;
            
            this.typewriterEffect(element, texts, speed, deleteSpeed, pause);
        });
    }
    
    typewriterEffect(element, texts, speed, deleteSpeed, pause) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';
        
        const type = () => {
            const fullText = texts[textIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            element.innerHTML = `
                <span class="typewriter-text">${currentText}</span>
                <span class="typewriter-cursor">|</span>
            `;
            
            let typeSpeed = isDeleting ? deleteSpeed : speed;
            
            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = pause;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = speed;
            }
            
            setTimeout(type, typeSpeed);
        };
        
        // Start typing effect
        setTimeout(type, 1000);
    }
    
    // ===== ANIMATED COUNTERS =====
    setupCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        if (counters.length === 0) return;
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const suffix = element.getAttribute('data-suffix') || '';
        const prefix = element.getAttribute('data-prefix') || '';
        
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            
            if (start < target) {
                element.textContent = prefix + Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = prefix + target + suffix;
            }
        };
        
        updateCounter();
    }
    
    // ===== PROJECT FILTERING =====
    setupProjectFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');
        
        if (filterButtons.length === 0 || projectItems.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                this.filterProjects(projectItems, filter);
            });
        });
    }
    
    filterProjects(items, filter) {
        items.forEach((item, index) => {
            const categories = item.getAttribute('data-category')?.split(' ') || [];
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                // Animate in
                setTimeout(() => {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                }, index * 100);
            } else {
                // Animate out
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // ===== SKILLS ANIMATION =====
    setupSkillsAnimation() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (skillBars.length === 0) return;
        
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBar(entry.target);
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => {
            skillsObserver.observe(bar);
        });
    }
    
    animateSkillBar(skillBar) {
        const percentage = skillBar.getAttribute('data-skill') || '0';
        const fill = skillBar.querySelector('.skill-fill');
        
        if (!fill) return;
        
        fill.style.width = '0%';
        fill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            fill.style.width = percentage + '%';
        }, 200);
        
        // Animate percentage text
        const percentageText = skillBar.querySelector('.skill-percentage');
        if (percentageText) {
            this.animatePercentage(percentageText, parseInt(percentage));
        }
    }
    
    animatePercentage(element, target) {
        let current = 0;
        const increment = target / 60; // 60 frames for 1 second at 60fps
        
        const updatePercentage = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current) + '%';
                requestAnimationFrame(updatePercentage);
            } else {
                element.textContent = target + '%';
            }
        };
        
        setTimeout(updatePercentage, 200);
    }
    
    // ===== TESTIMONIALS CAROUSEL =====
    setupTestimonials() {
        const testimonialContainer = document.querySelector('.testimonials-container');
        const testimonials = document.querySelectorAll('.testimonial-item');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        const indicators = document.querySelector('.testimonial-indicators');
        
        if (!testimonialContainer || testimonials.length === 0) return;
        
        let currentTestimonial = 0;
        let autoplayInterval;
        
        // Create indicators
        if (indicators) {
            testimonials.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
                indicator.setAttribute('data-slide', index);
                indicators.appendChild(indicator);
                
                indicator.addEventListener('click', () => {
                    this.showTestimonial(index, testimonials, indicators);
                    currentTestimonial = index;
                    this.resetAutoplay();
                });
            });
        }
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentTestimonial = currentTestimonial > 0 ? 
                    currentTestimonial - 1 : testimonials.length - 1;
                this.showTestimonial(currentTestimonial, testimonials, indicators);
                this.resetAutoplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentTestimonial = currentTestimonial < testimonials.length - 1 ? 
                    currentTestimonial + 1 : 0;
                this.showTestimonial(currentTestimonial, testimonials, indicators);
                this.resetAutoplay();
            });
        }
        
        // Autoplay
        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                currentTestimonial = currentTestimonial < testimonials.length - 1 ? 
                    currentTestimonial + 1 : 0;
                this.showTestimonial(currentTestimonial, testimonials, indicators);
            }, 5000);
        };
        
        this.resetAutoplay = () => {
            clearInterval(autoplayInterval);
            startAutoplay();
        };
        
        // Pause on hover
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        testimonialContainer.addEventListener('mouseleave', () => {
            startAutoplay();
        });
        
        // Start autoplay
        startAutoplay();
        
        // Initialize first testimonial
        this.showTestimonial(0, testimonials, indicators);
    }
    
    showTestimonial(index, testimonials, indicators) {
        // Hide all testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateX(50px)';
        });
        
        // Show active testimonial
        setTimeout(() => {
            testimonials[index].classList.add('active');
            testimonials[index].style.opacity = '1';
            testimonials[index].style.transform = 'translateX(0)';
        }, 150);
        
        // Update indicators
        if (indicators) {
            const indicatorButtons = indicators.querySelectorAll('.indicator');
            indicatorButtons.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }
    }
    
    // ===== LANGUAGE SWITCHER =====
    setupLanguageSwitcher() {
        const languageButtons = document.querySelectorAll('[data-lang]');
        
        languageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
        
        // Load saved language
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        this.switchLanguage(savedLang);
    }
    
    async switchLanguage(lang) {
        if (lang === this.currentLanguage) return;
        
        try {
            const translations = await this.loadTranslations(lang);
            this.applyTranslations(translations);
            this.currentLanguage = lang;
            
            // Save preference
            localStorage.setItem('preferredLanguage', lang);
            
            // Update language buttons
            this.updateLanguageButtons(lang);
            
        } catch (error) {
            console.error('Failed to switch language:', error);
        }
    }
    
    async loadTranslations(lang) {
        if (this.contentCache.has(lang)) {
            return this.contentCache.get(lang);
        }
        
        // In a real application, this would fetch from a server
        const translations = await this.getTranslationsForLanguage(lang);
        this.contentCache.set(lang, translations);
        
        return translations;
    }
    
    getTranslationsForLanguage(lang) {
        // Mock translation data
        const translations = {
            en: {
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.skills': 'Skills',
                'nav.projects': 'Projects',
                'nav.contact': 'Contact',
                'hero.greeting': 'Hello, I\'m',
                'hero.profession': 'Full Stack Developer',
                'hero.description': 'I create amazing web experiences with modern technologies',
                'about.title': 'About Me',
                'skills.title': 'My Skills',
                'projects.title': 'My Projects',
                'contact.title': 'Get In Touch'
            },
            es: {
                'nav.home': 'Inicio',
                'nav.about': 'Acerca',
                'nav.skills': 'Habilidades',
                'nav.projects': 'Proyectos',
                'nav.contact': 'Contacto',
                'hero.greeting': 'Hola, soy',
                'hero.profession': 'Desarrollador Full Stack',
                'hero.description': 'Creo experiencias web increíbles con tecnologías modernas',
                'about.title': 'Acerca de Mí',
                'skills.title': 'Mis Habilidades',
                'projects.title': 'Mis Proyectos',
                'contact.title': 'Contáctame'
            },
            fr: {
                'nav.home': 'Accueil',
                'nav.about': 'À propos',
                'nav.skills': 'Compétences',
                'nav.projects': 'Projets',
                'nav.contact': 'Contact',
                'hero.greeting': 'Bonjour, je suis',
                'hero.profession': 'Développeur Full Stack',
                'hero.description': 'Je crée des expériences web incroyables avec des technologies modernes',
                'about.title': 'À propos de moi',
                'skills.title': 'Mes Compétences',
                'projects.title': 'Mes Projets',
                'contact.title': 'Contactez-moi'
            }
        };
        
        return Promise.resolve(translations[lang] || translations.en);
    }
    
    applyTranslations(translations) {
        Object.entries(translations).forEach(([key, value]) => {
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(element => {
                element.textContent = value;
            });
        });
    }
    
    updateLanguageButtons(activeLang) {
        const languageButtons = document.querySelectorAll('[data-lang]');
        languageButtons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            button.classList.toggle('active', lang === activeLang);
        });
    }
    
    // ===== CONTENT LOADER =====
    setupContentLoader() {
        const loadMoreButtons = document.querySelectorAll('.load-more');
        
        loadMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                this.loadMoreContent(target, button);
            });
        });
    }
    
    async loadMoreContent(target, button) {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading...</span>
        `;
        button.disabled = true;
        
        try {
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Load content based on target
            await this.loadContentByTarget(target);
            
            // Hide button if no more content
            button.style.display = 'none';
            
        } catch (error) {
            console.error('Failed to load content:', error);
            button.innerHTML = originalText;
            button.disabled = false;
        } finally {
            this.isUpdating = false;
        }
    }
    
    loadContentByTarget(target) {
        switch (target) {
            case 'projects':
                return this.loadMoreProjects();
            case 'testimonials':
                return this.loadMoreTestimonials();
            case 'blog':
                return this.loadMoreBlogPosts();
            default:
                return Promise.resolve();
        }
    }
    
    loadMoreProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return Promise.resolve();
        
        const newProjects = [
            {
                title: 'E-Learning Platform',
                category: 'webapp',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
                description: 'Interactive online learning platform with video streaming'
            },
            {
                title: 'Fitness Tracker',
                category: 'mobile',
                image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400',
                description: 'Mobile app for tracking workouts and nutrition'
            }
        ];
        
        newProjects.forEach((project, index) => {
            setTimeout(() => {
                const projectElement = this.createProjectElement(project);
                projectsGrid.appendChild(projectElement);
            }, index * 200);
        });
        
        return Promise.resolve();
    }
    
    createProjectElement(project) {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-item';
        projectDiv.setAttribute('data-category', project.category);
        projectDiv.style.opacity = '0';
        projectDiv.style.transform = 'translateY(30px)';
        
        projectDiv.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-actions">
                        <button class="btn-icon" data-modal="project-detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    <span class="tech-tag">React</span>
                    <span class="tech-tag">Node.js</span>
                </div>
            </div>
        `;
        
        // Animate in
        setTimeout(() => {
            projectDiv.style.transition = 'all 0.6s ease';
            projectDiv.style.opacity = '1';
            projectDiv.style.transform = 'translateY(0)';
        }, 100);
        
        return projectDiv;
    }
    
    // ===== TEXT ANIMATIONS =====
    animateText(element, animation = 'fadeInUp') {
        element.style.opacity = '0';
        element.style.transform = this.getTransformByAnimation(animation);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    }
    
    getTransformByAnimation(animation) {
        const transforms = {
            fadeInUp: 'translateY(30px)',
            fadeInDown: 'translateY(-30px)',
            fadeInLeft: 'translateX(-30px)',
            fadeInRight: 'translateX(30px)',
            zoomIn: 'scale(0.8)',
            zoomOut: 'scale(1.2)'
        };
        
        return transforms[animation] || 'translateY(30px)';
    }
    
    // ===== UTILITY METHODS =====
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ===== PUBLIC API =====
    updateContent(selector, content, animation = 'fadeInUp') {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.innerHTML = content;
                    element.style.transition = 'all 0.5s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 200);
            }, index * 100);
        });
    }
    
    addProject(projectData) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            const projectElement = this.createProjectElement(projectData);
            projectsGrid.appendChild(projectElement);
        }
    }
    
    filterProjectsBy(category) {
        const projectItems = document.querySelectorAll('.project-item');
        this.filterProjects(projectItems, category);
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// CSS for dynamic content effects
const dynamicContentStyles = document.createElement('style');
dynamicContentStyles.textContent = `
    .typewriter-cursor {
        animation: blink 1s infinite;
        color: #667eea;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .skill-progress {
        background: #f3f4f6;
        border-radius: 10px;
        height: 8px;
        overflow: hidden;
        position: relative;
    }
    
    .skill-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        position: relative;
    }
    
    .testimonial-item {
        opacity: 0;
        transform: translateX(50px);
        transition: all 0.5s ease;
    }
    
    .testimonial-item.active {
        opacity: 1;
        transform: translateX(0);
    }
    
    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #ddd;
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .indicator.active {
        background: #667eea;
        border-color: #667eea;
    }
    
    .project-item {
        transition: all 0.3s ease;
    }
    
    .filter-btn.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    
    .language-switcher [data-lang].active {
        background: #667eea;
        color: white;
    }
    
    .load-more:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(dynamicContentStyles);

// Initialize dynamic content system
let dynamicContent;

document.addEventListener('DOMContentLoaded', () => {
    dynamicContent = new DynamicContent();
});

// Export for external use
window.DynamicContent = DynamicContent;