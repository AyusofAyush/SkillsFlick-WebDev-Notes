// ===== MODAL SYSTEM =====

class ModalSystem {
    constructor() {
        this.activeModal = null;
        this.modalStack = [];
        this.isAnimating = false;
        this.backdrop = null;
        
        this.init();
    }
    
    init() {
        this.createBackdrop();
        this.setupEventListeners();
        this.setupModalTriggers();
        this.setupKeyboardNavigation();
        
        console.log('🎭 Modal system initialized');
    }
    
    createBackdrop() {
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'modal-backdrop';
        this.backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(this.backdrop);
        
        // Close modal on backdrop click
        this.backdrop.addEventListener('click', (e) => {
            if (e.target === this.backdrop) {
                this.closeModal();
            }
        });
    }
    
    setupEventListeners() {
        // Close buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-close-modal]')) {
                this.closeModal();
            }
        });
        
        // Modal triggers
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal]');
            if (trigger) {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            }
        });
    }
    
    setupModalTriggers() {
        // Project detail triggers
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((item, index) => {
            const viewBtn = item.querySelector('[data-modal="project-detail"]');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showProjectDetail(item, index);
                });
            }
        });
        
        // Image gallery triggers
        const galleryImages = document.querySelectorAll('[data-gallery]');
        galleryImages.forEach((image, index) => {
            image.addEventListener('click', (e) => {
                e.preventDefault();
                this.showImageGallery(galleryImages, index);
            });
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.activeModal) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    if (this.activeModal.classList.contains('gallery-modal')) {
                        this.previousImage();
                    }
                    break;
                case 'ArrowRight':
                    if (this.activeModal.classList.contains('gallery-modal')) {
                        this.nextImage();
                    }
                    break;
                case 'Tab':
                    this.trapFocus(e);
                    break;
            }
        });
    }
    
    openModal(modalId) {
        if (this.isAnimating) return;
        
        let modal = document.getElementById(modalId);
        
        // If modal doesn't exist, create it based on type
        if (!modal) {
            modal = this.createModal(modalId);
        }
        
        if (!modal) {
            console.warn(`Modal with id "${modalId}" not found`);
            return;
        }
        
        this.isAnimating = true;
        
        // Add to stack
        if (this.activeModal) {
            this.modalStack.push(this.activeModal);
        }
        
        this.activeModal = modal;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show backdrop
        this.backdrop.style.visibility = 'visible';
        requestAnimationFrame(() => {
            this.backdrop.style.opacity = '1';
        });
        
        // Show modal
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9) translateY(20px)';
        
        requestAnimationFrame(() => {
            modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1) translateY(0)';
        });
        
        // Focus first focusable element
        setTimeout(() => {
            this.focusFirstElement(modal);
            this.isAnimating = false;
        }, 300);
        
        // Trigger custom event
        this.dispatchEvent('modalOpened', { modalId, modal });
    }
    
    closeModal() {
        if (!this.activeModal || this.isAnimating) return;
        
        this.isAnimating = true;
        const modal = this.activeModal;
        
        // Animate out
        modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9) translateY(20px)';
        
        // Hide backdrop if no more modals
        if (this.modalStack.length === 0) {
            this.backdrop.style.opacity = '0';
            
            setTimeout(() => {
                this.backdrop.style.visibility = 'hidden';
                document.body.style.overflow = '';
            }, 300);
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Remove from DOM if dynamically created
            if (modal.hasAttribute('data-dynamic')) {
                modal.remove();
            }
            
            // Restore previous modal or clear active
            this.activeModal = this.modalStack.pop() || null;
            
            if (this.activeModal) {
                this.activeModal.style.display = 'flex';
            }
            
            this.isAnimating = false;
        }, 300);
        
        // Trigger custom event
        this.dispatchEvent('modalClosed', { modal });
    }
    
    createModal(modalId) {
        switch (modalId) {
            case 'contact-modal':
                return this.createContactModal();
            case 'project-detail':
                return this.createProjectDetailModal();
            case 'image-gallery':
                return this.createImageGalleryModal();
            case 'video-player':
                return this.createVideoPlayerModal();
            default:
                return null;
        }
    }
    
    createContactModal() {
        const modal = document.createElement('div');
        modal.id = 'contact-modal';
        modal.className = 'modal contact-modal';
        modal.setAttribute('data-dynamic', 'true');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Get In Touch</h2>
                    <button class="modal-close" data-close-modal>
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="contact-info">
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Email</h4>
                                <p>hello@yourportfolio.com</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Phone</h4>
                                <p>+1 (555) 123-4567</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Location</h4>
                                <p>San Francisco, CA</p>
                            </div>
                        </div>
                    </div>
                    <form class="contact-form" data-validate>
                        <div class="form-row">
                            <div class="form-group">
                                <input type="text" name="name" placeholder="Your Name" required>
                            </div>
                            <div class="form-group">
                                <input type="email" name="email" placeholder="Your Email" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="text" name="subject" placeholder="Subject" required>
                        </div>
                        <div class="form-group">
                            <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <span>Send Message</span>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }
    
    createProjectDetailModal() {
        const modal = document.createElement('div');
        modal.id = 'project-detail-modal';
        modal.className = 'modal project-detail-modal';
        modal.setAttribute('data-dynamic', 'true');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="project-title">Project Title</h2>
                    <button class="modal-close" data-close-modal>
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="project-gallery">
                        <div class="main-image">
                            <img id="project-main-image" src="" alt="Project Image">
                        </div>
                        <div class="thumbnail-gallery">
                            <!-- Thumbnails will be added dynamically -->
                        </div>
                    </div>
                    <div class="project-info">
                        <div class="project-description">
                            <h3>Description</h3>
                            <p id="project-description-text"></p>
                        </div>
                        <div class="project-technologies">
                            <h3>Technologies Used</h3>
                            <div class="tech-tags" id="project-tech-tags">
                                <!-- Tech tags will be added dynamically -->
                            </div>
                        </div>
                        <div class="project-features">
                            <h3>Key Features</h3>
                            <ul id="project-features-list">
                                <!-- Features will be added dynamically -->
                            </ul>
                        </div>
                        <div class="project-links">
                            <a href="#" class="btn btn-primary" id="project-live-link" target="_blank">
                                <i class="fas fa-external-link-alt"></i>
                                <span>View Live</span>
                            </a>
                            <a href="#" class="btn btn-secondary" id="project-github-link" target="_blank">
                                <i class="fab fa-github"></i>
                                <span>View Code</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }
    
    createImageGalleryModal() {
        const modal = document.createElement('div');
        modal.id = 'image-gallery-modal';
        modal.className = 'modal gallery-modal';
        modal.setAttribute('data-dynamic', 'true');
        
        modal.innerHTML = `
            <div class="gallery-content">
                <button class="gallery-close" data-close-modal>
                    <i class="fas fa-times"></i>
                </button>
                <button class="gallery-nav gallery-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="gallery-nav gallery-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="gallery-image-container">
                    <img id="gallery-main-image" src="" alt="Gallery Image">
                </div>
                <div class="gallery-info">
                    <div class="gallery-counter">
                        <span id="gallery-current">1</span> / <span id="gallery-total">1</span>
                    </div>
                    <div class="gallery-caption" id="gallery-caption"></div>
                </div>
            </div>
        `;
        
        // Add navigation event listeners
        const prevBtn = modal.querySelector('.gallery-prev');
        const nextBtn = modal.querySelector('.gallery-next');
        
        prevBtn.addEventListener('click', () => this.previousImage());
        nextBtn.addEventListener('click', () => this.nextImage());
        
        document.body.appendChild(modal);
        return modal;
    }
    
    createVideoPlayerModal() {
        const modal = document.createElement('div');
        modal.id = 'video-player-modal';
        modal.className = 'modal video-modal';
        modal.setAttribute('data-dynamic', 'true');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="video-title">Video Title</h2>
                    <button class="modal-close" data-close-modal>
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="video-container">
                        <video id="modal-video" controls>
                            <source src="" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="video-description">
                        <p id="video-description-text"></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }
    
    showProjectDetail(projectItem, index) {
        const projectData = this.extractProjectData(projectItem);
        const modal = this.createProjectDetailModal();
        
        // Populate modal with project data
        this.populateProjectModal(modal, projectData);
        
        this.openModal('project-detail-modal');
    }
    
    extractProjectData(projectItem) {
        const image = projectItem.querySelector('img');
        const title = projectItem.querySelector('h3')?.textContent || 'Project Title';
        const description = projectItem.querySelector('p')?.textContent || 'Project description';
        const techTags = Array.from(projectItem.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
        
        return {
            title,
            description,
            image: image?.src || '',
            technologies: techTags,
            features: [
                'Responsive Design',
                'Modern UI/UX',
                'Performance Optimized',
                'Cross-browser Compatible'
            ],
            liveLink: '#',
            githubLink: '#'
        };
    }
    
    populateProjectModal(modal, data) {
        modal.querySelector('.project-title').textContent = data.title;
        modal.querySelector('#project-main-image').src = data.image;
        modal.querySelector('#project-description-text').textContent = data.description;
        modal.querySelector('#project-live-link').href = data.liveLink;
        modal.querySelector('#project-github-link').href = data.githubLink;
        
        // Add tech tags
        const techContainer = modal.querySelector('#project-tech-tags');
        techContainer.innerHTML = '';
        data.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            techContainer.appendChild(tag);
        });
        
        // Add features
        const featuresList = modal.querySelector('#project-features-list');
        featuresList.innerHTML = '';
        data.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    }
    
    showImageGallery(images, startIndex = 0) {
        this.galleryImages = Array.from(images);
        this.currentImageIndex = startIndex;
        
        const modal = this.createImageGalleryModal();
        this.updateGalleryImage();
        
        this.openModal('image-gallery-modal');
    }
    
    updateGalleryImage() {
        if (!this.activeModal || !this.galleryImages) return;
        
        const currentImage = this.galleryImages[this.currentImageIndex];
        const modal = this.activeModal;
        
        modal.querySelector('#gallery-main-image').src = currentImage.src;
        modal.querySelector('#gallery-current').textContent = this.currentImageIndex + 1;
        modal.querySelector('#gallery-total').textContent = this.galleryImages.length;
        modal.querySelector('#gallery-caption').textContent = currentImage.alt || '';
    }
    
    previousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
        } else {
            this.currentImageIndex = this.galleryImages.length - 1;
        }
        this.updateGalleryImage();
    }
    
    nextImage() {
        if (this.currentImageIndex < this.galleryImages.length - 1) {
            this.currentImageIndex++;
        } else {
            this.currentImageIndex = 0;
        }
        this.updateGalleryImage();
    }
    
    trapFocus(e) {
        if (!this.activeModal) return;
        
        const focusableElements = this.activeModal.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    focusFirstElement(modal) {
        const focusableElement = modal.querySelector(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElement) {
            focusableElement.focus();
        }
    }
    
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
    
    // Public API
    showModal(modalId) {
        this.openModal(modalId);
    }
    
    hideModal() {
        this.closeModal();
    }
    
    isModalOpen() {
        return this.activeModal !== null;
    }
    
    getActiveModal() {
        return this.activeModal;
    }
}

// CSS for modal system
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
    }
    
    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .modal-header h2 {
        margin: 0;
        color: #1f2937;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #6b7280;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .modal-close:hover {
        background: #f3f4f6;
        color: #374151;
    }
    
    .modal-body {
        padding: 1.5rem;
        overflow-y: auto;
        flex: 1;
    }
    
    /* Project Detail Modal */
    .project-detail-modal .modal-content {
        max-width: 1200px;
    }
    
    .project-detail-modal .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    
    .project-gallery .main-image img {
        width: 100%;
        border-radius: 8px;
    }
    
    .thumbnail-gallery {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .tech-tag {
        background: #e5e7eb;
        color: #374151;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
    }
    
    .project-links {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    /* Gallery Modal */
    .gallery-modal {
        background: rgba(0, 0, 0, 0.95);
        padding: 0;
    }
    
    .gallery-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .gallery-image-container {
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .gallery-image-container img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    
    .gallery-close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 1.5rem;
        padding: 1rem;
        border-radius: 50%;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: all 0.2s ease;
    }
    
    .gallery-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .gallery-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 2rem;
        padding: 1rem;
        border-radius: 50%;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: all 0.2s ease;
    }
    
    .gallery-prev {
        left: 2rem;
    }
    
    .gallery-next {
        right: 2rem;
    }
    
    .gallery-nav:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .gallery-info {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: white;
    }
    
    .gallery-counter {
        font-size: 1.125rem;
        margin-bottom: 0.5rem;
    }
    
    .gallery-caption {
        font-size: 0.875rem;
        opacity: 0.8;
    }
    
    /* Contact Modal */
    .contact-modal .modal-body {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
    }
    
    .contact-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .contact-icon {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
    
    .contact-details h4 {
        margin: 0 0 0.25rem 0;
        color: #1f2937;
    }
    
    .contact-details p {
        margin: 0;
        color: #6b7280;
    }
    
    /* Video Modal */
    .video-modal .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        overflow: hidden;
        border-radius: 8px;
    }
    
    .video-modal video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
        .modal {
            padding: 1rem;
        }
        
        .project-detail-modal .modal-body,
        .contact-modal .modal-body {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .gallery-nav {
            font-size: 1.5rem;
            padding: 0.75rem;
        }
        
        .gallery-prev {
            left: 1rem;
        }
        
        .gallery-next {
            right: 1rem;
        }
        
        .gallery-close {
            top: 1rem;
            right: 1rem;
            padding: 0.75rem;
        }
    }
`;
document.head.appendChild(modalStyles);

// Initialize modal system
let modalSystem;

document.addEventListener('DOMContentLoaded', () => {
    modalSystem = new ModalSystem();
});

// Export for external use
window.ModalSystem = ModalSystem;