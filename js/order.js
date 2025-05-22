document.addEventListener('DOMContentLoaded', function() {
    // Order Form Elements
    const orderForm = document.getElementById('waterOrderForm');
    const gallonsInput = document.getElementById('gallons');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    const summaryGallons = document.getElementById('summaryGallons');
    const totalAmount = document.getElementById('totalAmount');
    
    // Constants
    const PRICE_PER_GALLON = 50;
    const DELIVERY_FEE = 20;
    
    // Initialize values
    if (gallonsInput && summaryGallons && totalAmount) {
        gallonsInput.value = 1;
        summaryGallons.textContent = 1;
        totalAmount.textContent = formatCurrency(PRICE_PER_GALLON + DELIVERY_FEE);
    }
    
    // Quantity buttons functionality
    if (decreaseBtn && increaseBtn && gallonsInput) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(gallonsInput.value);
            if (currentValue > 1) {
                currentValue--;
                gallonsInput.value = currentValue;
                updateOrderSummary();
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(gallonsInput.value);
            currentValue++;
            gallonsInput.value = currentValue;
            updateOrderSummary();
        });
        
        gallonsInput.addEventListener('change', function() {
            let currentValue = parseInt(gallonsInput.value);
            if (currentValue < 1) {
                gallonsInput.value = 1;
            }
            updateOrderSummary();
        });
    }
    
    // Update order summary
    function updateOrderSummary() {
        if (summaryGallons && totalAmount) {
            const gallons = parseInt(gallonsInput.value);
            const subtotal = gallons * PRICE_PER_GALLON;
            const total = subtotal + DELIVERY_FEE;
            
            summaryGallons.textContent = gallons;
            totalAmount.textContent = formatCurrency(total);
        }
    }
    
    // Form Validation
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const zone = document.getElementById('zone').value;
            const address = document.getElementById('address').value;
            const gallons = parseInt(document.getElementById('gallons').value);
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            
            // Validate fields
            let isValid = true;
            
            // Validate Full Name
            if (!fullName) {
                showError('fullName', 'Please enter your full name');
                isValid = false;
            } else {
                hideError('fullName');
            }
            
            // Validate Email
            if (!email) {
                showError('email', 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            } else {
                hideError('email');
            }
            
            // Validate Phone
            if (!phone) {
                showError('phone', 'Please enter your phone number');
                isValid = false;
            } else {
                hideError('phone');
            }
            
            // Validate Zone
            if (!zone) {
                showError('zone', 'Please select your zone');
                isValid = false;
            } else {
                hideError('zone');
            }
            
            // Validate Address
            if (!address) {
                showError('address', 'Please enter your delivery address');
                isValid = false;
            } else {
                hideError('address');
            }
            
            // Validate Gallons
            if (!gallons || gallons < 1) {
                showError('gallons', 'Please enter a valid number of gallons');
                isValid = false;
            } else {
                hideError('gallons');
            }
            
            // If form is valid, show confirmation modal
            if (isValid) {
                // Calculate subtotal and total
                const subtotal = gallons * PRICE_PER_GALLON;
                const total = subtotal + DELIVERY_FEE;
                
                // Populate confirmation modal
                document.getElementById('confirmName').textContent = fullName;
                document.getElementById('confirmPhone').textContent = phone;
                document.getElementById('confirmAddress').textContent = address;
                document.getElementById('confirmZone').textContent = zone;
                document.getElementById('confirmGallons').textContent = gallons;
                document.getElementById('confirmPayment').textContent = paymentMethod;
                document.getElementById('confirmAmount').textContent = formatCurrency(total);
                
                // Show confirmation modal
                openModal('orderConfirmModal');
            }
        });
    }
    
    // Show error message
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
        }
    }
    
    // Hide error message
    function hideError(fieldId) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('error');
        }
    }
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Edit Order Button
    const editOrderBtn = document.getElementById('editOrderBtn');
    if (editOrderBtn) {
        editOrderBtn.addEventListener('click', function() {
            closeModal('orderConfirmModal');
        });
    }
    
    // Confirm Order Button
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', function() {
            // Close confirmation modal
            closeModal('orderConfirmModal');
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const zone = document.getElementById('zone').value;
            const address = document.getElementById('address').value;
            const gallons = parseInt(document.getElementById('gallons').value);
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            
            // Calculate subtotal and total
            const subtotal = gallons * PRICE_PER_GALLON;
            const total = subtotal + DELIVERY_FEE;
            
            // Generate order ID
            const orderId = generateOrderId();
            
            // Create order object
            const order = {
                id: orderId,
                customer: {
                    name: fullName,
                    email: email,
                    phone: phone,
                    address: address,
                    zone: zone
                },
                order: {
                    gallons: gallons,
                    subtotal: subtotal,
                    deliveryFee: DELIVERY_FEE,
                    total: total,
                    paymentMethod: paymentMethod
                },
                date: getCurrentDate(),
                status: 'Pending'
            };
            
            // Save order
            saveOrder(order);
            
            // Populate receipt
            document.getElementById('receiptOrderId').textContent = orderId;
            document.getElementById('receiptDate').textContent = getCurrentDate();
            document.getElementById('receiptName').textContent = fullName;
            document.getElementById('receiptAddress').textContent = `${address} (${zone})`;
            document.getElementById('receiptPhone').textContent = phone;
            document.getElementById('receiptGallons').textContent = gallons;
            document.getElementById('receiptSubtotal').textContent = formatCurrency(subtotal);
            document.getElementById('receiptTotal').textContent = formatCurrency(total);
            document.getElementById('receiptPayment').textContent = paymentMethod;
            
            // Show success modal
            openModal('orderSuccessModal');
            
            // Reset form
            orderForm.reset();
            gallonsInput.value = 1;
            updateOrderSummary();
        });
    }
    
    // Back to Home Button
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            closeModal('orderSuccessModal');
            window.location.href = 'index.html';
        });
    }
});