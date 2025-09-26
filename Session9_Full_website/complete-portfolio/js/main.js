// ===== MAIN JAVASCRIPT FILE =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio website initialized');
    
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeHeroSection();
    initializeScrollAnimations();
    initializeProjectsFilter();
    initializeContactForm();
    initializeBackToTop();
    initializeLoading();
    initializeModal();
    initializeParallax();
    
    // Initialize performance monitoring
    monitorPerformance();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                updateActiveNavigation(targetId);
            }
        });
    });
    
    // Update navbar on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        // Add/remove scrolled class
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation based on scroll position
        updateActiveNavigationOnScroll();
    });
    
    // Update active navigation
    function updateActiveNavigation(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active navigation on scroll
    function updateActiveNavigationOnScroll() {
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    updateActiveNavigation(`#${sectionId}`);
                }
            }
        });
    }
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add animation effect
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
}

// ===== HERO SECTION =====
function initializeHeroSection() {
    const ctaButton = document.getElementById('view-work-btn');
    const downloadCvButton = document.getElementById('download-cv-btn');
    
    // CTA Button functionality
    ctaButton.addEventListener('click', function() {
        // Add click animation
        this.classList.add('clicked');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
        
        // Scroll to projects section
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            const offsetTop = projectsSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    // Download CV functionality
    downloadCvButton.addEventListener('click', function() {
        // Add click animation
        this.classList.add('clicked');
        
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
        
        // Here you would implement actual CV download
        showNotification('CV download started!', 'success');
    });
    
    // Dynamic greeting based on time
    setDynamicGreeting();
    
    // Typing animation for hero title
    initializeTypingAnimation();
}

function setDynamicGreeting() {
    const greetingElement = document.querySelector('.greeting');
    const hour = new Date().getHours();
    
    let greeting;
    if (hour < 12) {
        greeting = 'Good morning, I\'m';
    } else if (hour < 18) {
        greeting = 'Good afternoon, I\'m';
    } else {
        greeting = 'Good evening, I\'m';
    }
    
    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
}

function initializeTypingAnimation() {
    const titleElement = document.querySelector('.name');
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = '';
    titleElement.style.borderRight = '2px solid var(--primary-color)';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                titleElement.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add scroll animation classes to elements
    addScrollAnimationClasses();
}

function addScrollAnimationClasses() {
    // About section
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    if (aboutText) aboutText.classList.add('slide-in-left');
    if (aboutImage) aboutImage.classList.add('slide-in-right');
    
    // Skills section
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.classList.add('fade-in');
        category.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Projects section
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('scale-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach((stat, index) => {
        stat.classList.add('fade-in');
        stat.style.animationDelay = `${index * 0.2}s`;
    });
}

// ===== PROJECTS FILTER =====
function initializeProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Add stagger animation
            let delay = 0;
            projectCards.forEach(card => {
                if (card.style.display !== 'none') {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, delay);
                    delay += 100;
                }
            });
        });
    });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Validate form
            if (validateContactForm(data)) {
                // Show loading state
                const submitBtn = this.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                    showNotification('Thank you! Your message has been sent.', 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Reset button
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 2000);
            }
        });
    }
    
    // Real-time form validation
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateFormField(this);
        });
        
        input.addEventListener('input', function() {
            clearValidationError(this);
        });
    });
}

function validateContactForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Please enter a valid name');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject || data.subject.trim().length < 5) {
        showFieldError('subject', 'Please enter a subject (minimum 5 characters)');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Please enter a message (minimum 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function validateFormField(field) {
    const value = field.value.trim();
    
    switch (field.name) {
        case 'name':
            if (value.length < 2) {
                showFieldError(field.name, 'Name must be at least 2 characters');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field.name, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'subject':
            if (value.length < 5) {
                showFieldError(field.name, 'Subject must be at least 5 characters');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(field.name, 'Message must be at least 10 characters');
                return false;
            }
            break;
    }
    
    clearValidationError(field);
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.parentElement;
    
    // Remove existing error
    clearValidationError(field);
    
    // Add error styling
    field.style.borderColor = '#e74c3c';
    
    // Add error message
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.display = 'block';
    errorElement.style.marginTop = '0.25rem';
    
    formGroup.appendChild(errorElement);
}

function clearValidationError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// ===== BACK TO TOP =====
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LOADING SCREEN =====
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500); // Show loading screen for at least 1.5 seconds
    });
}

// ===== PROJECT MODAL =====
function initializeModal() {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    const projectButtons = document.querySelectorAll('[data-project]');
    
    // Project data
    const projectData = {
        ecommerce: {
            title: 'E-commerce Platform',
            description: 'A full-featured online store with payment integration, inventory management, and admin panel.',
            features: ['User Authentication', 'Shopping Cart', 'Payment Gateway', 'Admin Dashboard', 'Order Management'],
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Redux'],
            images: ['images/projects/ecommerce-1.jpg', 'images/projects/ecommerce-2.jpg']
        },
        taskmanager: {
            title: 'Task Management App',
            description: 'Collaborative project management tool with real-time updates and team collaboration features.',
            features: ['Real-time Updates', 'Team Collaboration', 'Task Assignment', 'Progress Tracking', 'File Sharing'],
            technologies: ['Vue.js', 'Socket.io', 'Express', 'PostgreSQL', 'Vuex'],
            images: ['images/projects/taskmanager-1.jpg', 'images/projects/taskmanager-2.jpg']
        },
        weather: {
            title: 'Weather App',
            description: 'Beautiful weather application with location-based forecasts and interactive maps.',
            features: ['Location Detection', '7-day Forecast', 'Weather Maps', 'Severe Weather Alerts', 'Offline Support'],
            technologies: ['React Native', 'Weather API', 'Google Maps', 'AsyncStorage', 'Push Notifications'],
            images: ['images/projects/weather-1.jpg', 'images/projects/weather-2.jpg']
        },
        portfolio: {
            title: 'Portfolio Design',
            description: 'Modern portfolio design concept for creative professionals with stunning animations.',
            features: ['Responsive Design', 'Smooth Animations', 'Interactive Elements', 'Dark Mode', 'Performance Optimized'],
            technologies: ['Figma', 'Prototyping', 'UI/UX Design', 'Adobe Creative Suite', 'Principle'],
            images: ['images/projects/portfolio-1.jpg', 'images/projects/portfolio-2.jpg']
        }
    };
    
    // Open modal
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectData[projectId];
            
            if (project) {
                showProjectModal(project);
            }
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.classList.remove('show');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    function showProjectModal(project) {
        modalBody.innerHTML = `
            <div class="project-modal-content">
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                
                <div class="project-features">
                    <h3>Key Features</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-technologies">
                    <h3>Technologies Used</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
    }
}

// ===== PARALLAX EFFECTS =====
function initializeParallax() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingIcons.forEach((icon, index) => {
            const speed = icon.dataset.speed || 1;
            const yPos = -(scrolled * speed * 0.1);
            icon.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        transform: translateX(100%);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Throttle function for performance
function throttle(func, wait) {
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

// Debounce function
function debounce(func, wait) {
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

// Performance monitoring
function monitorPerformance() {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        console.group('📊 Performance Metrics');
        console.log(`⏱️ Page Load Time: ${loadTime}ms`);
        console.log(`📡 DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
        console.log(`🎨 First Paint: ${perfData.responseEnd - perfData.fetchStart}ms`);
        console.groupEnd();
        
        // Alert if load time is too slow
        if (loadTime > 3000) {
            console.warn('⚠️ Page load time is slow. Consider optimization.');
        }
    });
}

// Easter egg - Console message
console.log(`
🎉 Welcome to Ayush Raj's Portfolio!

Built with:
- Vanilla JavaScript
- Modern CSS3
- Responsive Design
- Performance Optimization

Feel free to explore the code!
`);

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}