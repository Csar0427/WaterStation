document.addEventListener('DOMContentLoaded', function() {
    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active, make it active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Add animation with GSAP
    if (typeof gsap !== 'undefined') {
        gsap.from('.faq-item', {
            duration: 0.5,
            opacity: 0,
            y: 20,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.faq-container',
                start: 'top 80%',
                end: 'bottom center',
                toggleActions: 'play none none none'
            }
        });
    }
});