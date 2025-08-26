// JavaScript for Booksy Website
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navbar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        sliderDots.forEach(dot => dot.classList.remove('active'));
        
        heroSlides[index].classList.add('active');
        sliderDots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        let nextSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(nextSlide);
    }
    
    function prevSlide() {
        let prevSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(prevSlide);
    }
    
    document.querySelector('.slider-next').addEventListener('click', function() {
        nextSlide();
        resetSlideInterval();
    });
    
    document.querySelector('.slider-prev').addEventListener('click', function() {
        prevSlide();
        resetSlideInterval();
    });
    
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetSlideInterval();
        });
    });
    
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // Start auto slide change
    startSlideInterval();
    
    // Pause on hover
    const heroSlider = document.querySelector('.hero-slider');
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    heroSlider.addEventListener('mouseleave', () => {
        startSlideInterval();
    });
    
    // Top Search Bar Toggle
    const advancedSearchToggle = document.querySelector('.advanced-search-toggle');
    const topSearchAdvanced = document.querySelector('.top-search-advanced');
    
    if (advancedSearchToggle && topSearchAdvanced) {
        advancedSearchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            topSearchAdvanced.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (topSearchAdvanced.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-sliders-h"></i> <span class="toggle-text">Hide Filters</span>';
            } else {
                this.innerHTML = '<i class="fas fa-sliders-h"></i> <span class="toggle-text">Advanced</span>';
            }
        });
    }
    
    // Search functionality
    const searchForm = document.querySelector('.top-search-container');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.querySelector('.top-search-input');
            if (searchInput.value.trim() !== '') {
                alert(`Searching for: ${searchInput.value}`);
                // In a real app, you would redirect to search results or fetch them
            }
        });
    }
    
    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Testimonials Slider Navigation
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    let isDown = false;
    let startX;
    let scrollLeft;
    
    if (testimonialsSlider) {
        testimonialsSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - testimonialsSlider.offsetLeft;
            scrollLeft = testimonialsSlider.scrollLeft;
            testimonialsSlider.style.cursor = 'grabbing';
        });
        
        testimonialsSlider.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialsSlider.style.cursor = 'grab';
        });
        
        testimonialsSlider.addEventListener('mouseup', () => {
            isDown = false;
            testimonialsSlider.style.cursor = 'grab';
        });
        
        testimonialsSlider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsSlider.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        testimonialsSlider.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - testimonialsSlider.offsetLeft;
            scrollLeft = testimonialsSlider.scrollLeft;
        });
        
        testimonialsSlider.addEventListener('touchend', () => {
            isDown = false;
        });
        
        testimonialsSlider.addEventListener('touchmove', (e) => {
            if(!isDown) return;
            const x = e.touches[0].pageX - testimonialsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsSlider.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Add to Cart Animation
    const addToCartButtons = document.querySelectorAll('.book-actions .btn:not(.wishlist-btn)');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                cartBadge.textContent = parseInt(cartBadge.textContent) + 1;
                cartBadge.classList.add('pulse');
                setTimeout(() => {
                    cartBadge.classList.remove('pulse');
                }, 500);
            }
            
            // Animation for button
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
            
            // Show success message
            const bookTitle = this.closest('.book-card').querySelector('.book-title').textContent;
            showToast(`${bookTitle} has been added to your cart!`);
        });
    });
    
    // Buy Now buttons
    const buyNowButtons = document.querySelectorAll('.book-actions .btn-outline');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const bookTitle = this.closest('.book-card').querySelector('.book-title').textContent;
            showToast(`Proceeding to checkout for ${bookTitle}`);
            // In a real app, this would redirect to checkout
        });
    });
    
    // Wishlist Button
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                // Show success message
                const bookTitle = this.closest('.book-card').querySelector('.book-title').textContent;
                showToast(`${bookTitle} has been added to your wishlist!`);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });
    
    // Quick View Button
    const quickViewButtons = document.querySelectorAll('.quick-view button');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const bookCard = this.closest('.book-card');
            const title = bookCard.querySelector('.book-title').textContent;
            const author = bookCard.querySelector('.book-author').textContent;
            const price = bookCard.querySelector('.current-price').textContent;
            
            // In a real app, this would show a modal with more details
            showToast(`Quick View: ${title} by ${author} - ${price}`);
        });
    });
    
    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('#newsletter-email').value;
            showToast(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
            this.reset();
        });
    }
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('#name').value;
            showToast(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
            this.reset();
        });
    }
    
    // Toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Create toast notification styles
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .toast-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--darker);
            color: var(--light);
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            max-width: 90%;
            text-align: center;
            border-left: 4px solid var(--primary);
        }
        
        .toast-notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(toastStyles);
    
    
    // Enhanced Mega Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const megaMenuItems = document.querySelectorAll('.mega-menu');
    
    megaMenuItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        // For mobile devices
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                item.classList.toggle('active');
                
                // Close other open mega menus
                megaMenuItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 992) return;
        
        const isClickInside = Array.from(megaMenuItems).some(item => 
            item.contains(e.target)
        );
        
        if (!isClickInside) {
            megaMenuItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 992) {
            megaMenuItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Desktop hover functionality
    if (window.innerWidth > 992) {
        megaMenuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.querySelector('.mega-menu-content').style.display = 'grid';
            });
            
            item.addEventListener('mouseleave', function() {
                this.querySelector('.mega-menu-content').style.display = 'none';
            });
        });
    }
});
    
    // Make search bar always visible (removed the scroll hide/show functionality)
});

