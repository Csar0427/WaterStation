document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Hero section animation
        gsap.from('.hero h1', {
            duration: 1,
            opacity: 0,
            y: 50,
            ease: 'power3.out'
        });
        
        gsap.from('.hero p', {
            duration: 1,
            opacity: 0,
            y: 30,
            ease: 'power3.out',
            delay: 0.3
        });
        
        gsap.from('.hero .btn-primary', {
            duration: 1,
            opacity: 0,
            y: 20,
            ease: 'power3.out',
            delay: 0.6
        });
        
        // Features section animation
        gsap.from('.feature', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.features',
                start: 'top 80%',
                end: 'bottom center',
                toggleActions: 'play none none none'
            }
        });
        
        // Reviews animation
        gsap.from('.review', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.reviews',
                start: 'top 80%',
                end: 'bottom center',
                toggleActions: 'play none none none'
            }
        });
        
        // Location section animation
        gsap.from('.location-container > *', {
            duration: 0.8,
            opacity: 0,
            x: function(i) { return i % 2 === 0 ? -30 : 30; },
            stagger: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.location',
                start: 'top 80%',
                end: 'bottom center',
                toggleActions: 'play none none none'
            }
        });
        
        // Form animation (if on order page)
        if (document.querySelector('.order-form')) {
            gsap.from('.order-form form > *', {
                duration: 0.5,
                opacity: 0,
                y: 20,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.3
            });
        }
        
        // Login/Signup form animation
        if (document.querySelector('.auth-form-container')) {
            gsap.from('.auth-form-container > *', {
                duration: 0.5,
                opacity: 0,
                y: 20,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.3
            });
        }
        
        // Admin dashboard animation
        if (document.querySelector('.admin-body')) {
            gsap.from('.summary-card', {
                duration: 0.5,
                opacity: 0,
                y: 20,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.3
            });
            
            gsap.from('.admin-section', {
                duration: 0.5,
                opacity: 0,
                y: 30,
                stagger: 0.2,
                ease: 'power2.out',
                delay: 0.6
            });
        }
    }
});