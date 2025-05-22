document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        // Redirect to login page if not admin
        // Commented out for demo purposes
        // window.location.href = 'login.html';
    }
    
    // Load orders
    loadOrders();
    
    // Load reviews
    loadAdminReviews();
    
    // Admin profile dropdown
    const adminProfile = document.querySelector('.admin-profile');
    if (adminProfile) {
        adminProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.admin-dropdown-menu');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            const dropdown = adminProfile.querySelector('.admin-dropdown-menu');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Order details modal functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-order-btn')) {
            const orderId = e.target.getAttribute('data-id');
            const order = getOrderById(orderId);
            
            if (order) {
                // Populate order details modal
                document.getElementById('detailOrderId').textContent = order.id;
                document.getElementById('detailOrderDate').textContent = order.date;
                document.getElementById('detailOrderStatus').textContent = order.status;
                document.getElementById('detailOrderStatus').className = `order-status status-${order.status.toLowerCase()}`;
                
                document.getElementById('detailCustomerName').textContent = order.customer.name;
                document.getElementById('detailCustomerEmail').textContent = order.customer.email;
                document.getElementById('detailCustomerPhone').textContent = order.customer.phone;
                document.getElementById('detailCustomerAddress').textContent = order.customer.address;
                document.getElementById('detailCustomerZone').textContent = order.customer.zone;
                
                document.getElementById('detailGallons').textContent = order.order.gallons;
                document.getElementById('detailSubtotal').textContent = formatCurrency(order.order.subtotal);
                document.getElementById('detailTotal').textContent = formatCurrency(order.order.total);
                document.getElementById('detailPaymentMethod').textContent = order.order.paymentMethod;
                
                // Show modal
                openModal('orderDetailsModal');
            }
        }
    });
    
    // Update Status Button
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', function() {
            const orderId = document.getElementById('detailOrderId').textContent;
            const currentStatus = document.getElementById('detailOrderStatus').textContent;
            
            // Define status progression
            const statuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
            const currentIndex = statuses.indexOf(currentStatus);
            let nextIndex = (currentIndex + 1) % statuses.length;
            
            // Skip "Cancelled" in normal progression
            if (nextIndex === 3 && currentIndex !== 3) {
                nextIndex = 0;
            }
            
            const newStatus = statuses[nextIndex];
            
            // Update order status
            updateOrderStatus(orderId, newStatus);
            
            // Update UI
            document.getElementById('detailOrderStatus').textContent = newStatus;
            document.getElementById('detailOrderStatus').className = `order-status status-${newStatus.toLowerCase()}`;
            
            // Reload orders
            loadOrders();
        });
    }
    
    // Assign Delivery Button
    const assignDeliveryBtn = document.getElementById('assignDeliveryBtn');
    if (assignDeliveryBtn) {
        assignDeliveryBtn.addEventListener('click', function() {
            alert('Delivery assigned successfully!');
        });
    }
});

// Load orders into table
function loadOrders() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;
    
    const orders = getOrders();
    let ordersHTML = '';
    
    orders.forEach(order => {
        const statusClass = `status-${order.status.toLowerCase()}`;
        
        ordersHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer.name}</td>
                <td>${order.customer.zone}, ${order.customer.address}</td>
                <td>${order.date}</td>
                <td>${order.order.gallons}</td>
                <td>${formatCurrency(order.order.total)}</td>
                <td><span class="status-label ${statusClass}">${order.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <a href="#" class="action-btn view-order-btn" data-id="${order.id}"><i class="fas fa-eye"></i></a>
                        <a href="#" class="action-btn"><i class="fas fa-edit"></i></a>
                        <a href="#" class="action-btn"><i class="fas fa-trash"></i></a>
                    </div>
                </td>
            </tr>
        `;
    });
    
    ordersTableBody.innerHTML = ordersHTML;
}

// Load reviews for admin
function loadAdminReviews() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;
    
    const reviews = getReviews().slice(0, 4); // Show only 4 recent reviews
    let reviewsHTML = '';
    
    reviews.forEach(review => {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        
        const avatarId = Math.floor(Math.random() * 70) + 1;
        const avatarUrl = `https://i.pravatar.cc/150?img=${avatarId}`;
        
        reviewsHTML += `
            <div class="review">
                <div class="review-header">
                    <div class="review-avatar">
                        <img src="${avatarUrl}" alt="${review.name}">
                    </div>
                    <div class="review-info">
                        <h3>${review.name}</h3>
                        <p class="review-date">${review.date}</p>
                    </div>
                </div>
                <div class="review-rating">
                    ${starsHTML}
                </div>
                <p class="review-comment">${review.comment}</p>
            </div>
        `;
    });
    
    reviewsGrid.innerHTML = reviewsHTML;
}

// Get order by ID
function getOrderById(id) {
    const orders = getOrders();
    return orders.find(order => order.id === id);
}

// Update order status
function updateOrderStatus(id, status) {
    let orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('waterStationOrders', JSON.stringify(orders));
    }
}