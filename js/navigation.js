document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeNav = document.querySelector('.close-mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.add('open');
        });
    }
    
    if (closeNav && mobileNav) {
        closeNav.addEventListener('click', function() {
            mobileNav.classList.remove('open');
        });
    }
    
    // Close mobile nav when clicking a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('open');
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav && 
            !mobileNav.contains(event.target) && 
            !menuToggle.contains(event.target) && 
            mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
        }
    });
    
    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's not a scroll link
            if (href === '#' || href === '' || !href.startsWith('#')) return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Get header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to nav link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        // Get all sections with IDs
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all nav links
                document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's nav link
                const currentId = section.getAttribute('id');
                document.querySelectorAll(`.desktop-nav a[href="#${currentId}"], .mobile-nav a[href="#${currentId}"]`).forEach(link => {
                    link.classList.add('active');
                });
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active link on page load
    updateActiveNavLink();
});