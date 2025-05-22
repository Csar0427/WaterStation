// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme;
    }
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('light-mode')) {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Function to open modal
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };
    
    // Function to close modal
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };
    
    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    });
    
    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Toggle password visibility
    const togglePassword = document.querySelectorAll('.toggle-password');
    togglePassword.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
});

// Generate a random order ID
function generateOrderId() {
    return 'WS' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

// Format date to a readable string
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Format currency
function formatCurrency(amount) {
    return '₱' + parseFloat(amount).toFixed(2);
}

// Get current date
function getCurrentDate() {
    return formatDate(new Date());
}

// Store orders in localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('waterStationOrders')) || [];
    orders.push(order);
    localStorage.setItem('waterStationOrders', JSON.stringify(orders));
}

// Get all orders from localStorage
function getOrders() {
    return JSON.parse(localStorage.getItem('waterStationOrders')) || [];
}

// Store reviews in localStorage
function saveReview(review) {
    let reviews = JSON.parse(localStorage.getItem('waterStationReviews')) || [];
    reviews.push(review);
    localStorage.setItem('waterStationReviews', JSON.stringify(reviews));
}

// Get all reviews from localStorage
function getReviews() {
    return JSON.parse(localStorage.getItem('waterStationReviews')) || [];
}

// Store user in localStorage
function saveUser(user) {
    let users = JSON.parse(localStorage.getItem('waterStationUsers')) || [];
    users.push(user);
    localStorage.setItem('waterStationUsers', JSON.stringify(users));
}

// Validate user login
function validateLogin(email, password) {
    const users = JSON.parse(localStorage.getItem('waterStationUsers')) || [];
    return users.find(user => user.email === email && user.password === password);
}

// Initialize example data if not exists
function initializeExampleData() {
    // Check if example data already exists
    if (!localStorage.getItem('waterStationOrders')) {
        // Create example orders
        const exampleOrders = [
            {
                id: 'WS1234',
                customer: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '(123) 456-7890',
                    address: '123 Main St, Apartment 4B',
                    zone: 'Zone A'
                },
                order: {
                    gallons: 3,
                    subtotal: 150,
                    deliveryFee: 20,
                    total: 170,
                    paymentMethod: 'Cash'
                },
                date: getCurrentDate(),
                status: 'Delivered'
            },
            {
                id: 'WS5678',
                customer: {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '(234) 567-8901',
                    address: '456 Oak Ave',
                    zone: 'Zone B'
                },
                order: {
                    gallons: 2,
                    subtotal: 100,
                    deliveryFee: 20,
                    total: 120,
                    paymentMethod: 'GCash'
                },
                date: getCurrentDate(),
                status: 'Processing'
            },
            {
                id: 'WS9012',
                customer: {
                    name: 'Bob Johnson',
                    email: 'bob@example.com',
                    phone: '(345) 678-9012',
                    address: '789 Pine St',
                    zone: 'Zone C'
                },
                order: {
                    gallons: 5,
                    subtotal: 250,
                    deliveryFee: 20,
                    total: 270,
                    paymentMethod: 'Cash'
                },
                date: getCurrentDate(),
                status: 'Pending'
            }
        ];
        
        localStorage.setItem('waterStationOrders', JSON.stringify(exampleOrders));
    }
    
    // Create example reviews if not exists
    if (!localStorage.getItem('waterStationReviews')) {
        const exampleReviews = [
            {
                name: 'Maria Garcia',
                email: 'maria@example.com',
                rating: 5,
                comment: 'Excellent service! My water was delivered promptly and the staff was very friendly.',
                date: getCurrentDate()
            },
            {
                name: 'David Lee',
                email: 'david@example.com',
                rating: 4,
                comment: 'Good quality water and fast delivery. Will order again.',
                date: getCurrentDate()
            },
            {
                name: 'Sarah Williams',
                email: 'sarah@example.com',
                rating: 5,
                comment: 'I love how convenient it is to order water from this station. The online ordering system is very user-friendly.',
                date: getCurrentDate()
            }
        ];
        
        localStorage.setItem('waterStationReviews', JSON.stringify(exampleReviews));
    }
    
    // Create example users if not exists
    if (!localStorage.getItem('waterStationUsers')) {
        const exampleUsers = [
            {
                name: 'Admin User',
                email: 'admin@waterstation.com',
                password: 'admin123',
                phone: '(123) 456-7890',
                role: 'admin'
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '(123) 456-7890',
                role: 'customer'
            }
        ];
        
        localStorage.setItem('waterStationUsers', JSON.stringify(exampleUsers));
    }
}

// Call the initialize function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeExampleData();
});