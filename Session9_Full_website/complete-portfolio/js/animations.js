// ===== ANIMATIONS JAVASCRIPT =====

// Advanced animation controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.initializeParticleSystem();
        this.setupScrollAnimations();
        this.initializeTextAnimations();
        this.setupHoverEffects();
        
        console.log('🎨 Animation system initialized');
    }
    
    // Setup Intersection Observer for scroll animations
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        // Fade in animation observer
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerFadeIn(entry.target);
                }
            });
        }, observerOptions);
        
        // Slide in animation observer  
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSlideIn(entry.target);
                }
            });
        }, observerOptions);
        
        // Scale animation observer
        const scaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScaleIn(entry.target);
                }
            });
        }, observerOptions);
        
        this.observers.set('fadeIn', fadeInObserver);
        this.observers.set('slide', slideObserver);
        this.observers.set('scale', scaleObserver);
        
        // Observe elements
        this.observeElements();
    }
    
    observeElements() {
        // Fade in elements
        document.querySelectorAll('.animate-fade-in, .stat, .skill-category').forEach(el => {
            this.observers.get('fadeIn').observe(el);
        });
        
        // Slide elements
        document.querySelectorAll('.animate-slide-in, .about-text, .contact-info').forEach(el => {
            this.observers.get('slide').observe(el);
        });
        
        // Scale elements
        document.querySelectorAll('.animate-scale-in, .project-card').forEach(el => {
            this.observers.get('scale').observe(el);
        });
    }
    
    // Animation triggers
    triggerFadeIn(element) {
        if (this.isReducedMotion) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    triggerSlideIn(element) {
        if (this.isReducedMotion) return;
        
        const direction = element.classList.contains('slide-left') ? '-50px' : '50px';
        element.style.opacity = '0';
        element.style.transform = `translateX(${direction})`;
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    triggerScaleIn(element) {
        if (this.isReducedMotion) return;
        
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    // Particle system
    initializeParticleSystem() {
        if (this.isReducedMotion || window.innerWidth < 768) return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        document.body.appendChild(particleContainer);
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(particleContainer);
        }
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent);
            border-radius: 50%;
            left: ${x}px;
            animation: floatUp ${animationDuration}s linear infinite;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (animationDuration + delay) * 1000);
    }
    
    // Scroll-based animations
    setupScrollAnimations() {
        let ticking = false;
        
        const updateAnimations = () => {
            const scrollY = window.pageYOffset;
            
            // Parallax effect for floating icons
            document.querySelectorAll('.floating-icon').forEach((icon, index) => {
                if (this.isReducedMotion) return;
                
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrollY * speed);
                icon.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.1}deg)`;
            });
            
            // Header blur effect
            const navbar = document.getElementById('navbar');
            if (navbar) {
                const opacity = Math.min(scrollY / 100, 1);
                navbar.style.background = `rgba(255, 255, 255, ${0.8 + opacity * 0.2})`;
            }
            
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    
    // Text animations
    initializeTextAnimations() {
        this.setupTypewriterEffect();
        this.setupCounterAnimations();
    }
    
    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = element.dataset.speed || 50;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            this.typeText(element, text, speed);
        });
    }
    
    typeText(element, text, speed) {
        if (this.isReducedMotion) {
            element.textContent = text;
            return;
        }
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
                // Remove cursor after delay
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }
        }, 16);
    }
    
    // Hover effects
    setupHoverEffects() {
        // Magnetic effect for buttons
        document.querySelectorAll('.cta-btn, .action-btn').forEach(button => {
            this.addMagneticEffect(button);
        });
        
        // Tilt effect for cards
        document.querySelectorAll('.project-card, .skill-category').forEach(card => {
            this.addTiltEffect(card);
        });
        
        // Ripple effect for buttons
        document.querySelectorAll('button, .btn').forEach(button => {
            this.addRippleEffect(button);
        });
    }
    
    addMagneticEffect(element) {
        if (this.isReducedMotion) return;
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    }
    
    addTiltEffect(element) {
        if (this.isReducedMotion) return;
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const rotateX = (deltaY / rect.height) * -10;
            const rotateY = (deltaX / rect.width) * 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }
    
    addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.6), transparent);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    // Morphing shapes animation
    initializeMorphingShapes() {
        const shapes = document.querySelectorAll('.morphing-shape');
        
        shapes.forEach(shape => {
            let morphing = true;
            
            const morph = () => {
                if (!morphing || this.isReducedMotion) return;
                
                const borderRadius = Array.from({length: 8}, () => Math.random() * 50 + 25);
                shape.style.borderRadius = borderRadius.map(r => `${r}%`).join(' ');
                
                setTimeout(morph, 2000);
            };
            
            morph();
            
            // Stop morphing on hover
            shape.addEventListener('mouseenter', () => morphing = false);
            shape.addEventListener('mouseleave', () => {
                morphing = true;
                morph();
            });
        });
    }
    
    // Glitch effect
    triggerGlitchEffect(element) {
        if (this.isReducedMotion) return;
        
        element.classList.add('glitch-effect');
        
        setTimeout(() => {
            element.classList.remove('glitch-effect');
        }, 300);
    }
    
    // Loading animations
    showLoadingAnimation(element) {
        const loader = document.createElement('div');
        loader.className = 'loading-animation';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <span>Loading...</span>
        `;
        
        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(loader);
        
        return loader;
    }
    
    hideLoadingAnimation(loader) {
        if (loader && loader.parentNode) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
    }
    
    // Performance monitoring
    measureAnimationPerformance() {
        const startTime = performance.now();
        
        return {
            end: () => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                if (duration > 16.67) { // More than one frame at 60fps
                    console.warn(`Animation took ${duration.toFixed(2)}ms (target: <16.67ms)`);
                }
                
                return duration;
            }
        };
    }
    
    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
        
        // Remove particle container
        const particleContainer = document.querySelector('.particles-container');
        if (particleContainer) {
            particleContainer.remove();
        }
    }
}

// CSS Keyframes for particle animation
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .loader-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(99, 102, 241, 0.2);
        border-left-color: #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(particleStyles);

// Initialize animation controller
let animationController;

document.addEventListener('DOMContentLoaded', () => {
    animationController = new AnimationController();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationController) {
        animationController.destroy();
    }
});

// Export for external use
window.AnimationController = AnimationController;