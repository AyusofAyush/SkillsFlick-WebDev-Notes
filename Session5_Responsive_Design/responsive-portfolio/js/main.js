// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate hamburger lines
        const spans = navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navToggle.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Reset hamburger lines
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Reset hamburger lines
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Responsive image loading based on screen size
function loadResponsiveImages() {
    const profileImages = document.querySelectorAll('.profile-image');
    const screenWidth = window.innerWidth;
    
    profileImages.forEach(img => {
        if (screenWidth < 768) {
            img.src = 'images/profile-mobile.svg';
            img.alt = 'Ayush Raj - Mobile Profile';
        } else if (screenWidth < 1024) {
            img.src = 'images/profile-tablet.svg';
            img.alt = 'Ayush Raj - Tablet Profile';
        } else {
            img.src = 'images/profile-desktop.svg';
            img.alt = 'Ayush Raj - Desktop Profile';
        }
    });
}

// Load appropriate images on page load and resize
window.addEventListener('load', loadResponsiveImages);
window.addEventListener('resize', loadResponsiveImages);