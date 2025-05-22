document.addEventListener('DOMContentLoaded', function() {
    // Load and display reviews
    loadReviews();
    
    // Review button click event
    const reviewBtn = document.querySelector('.review-btn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', function() {
            openModal('reviewModal');
        });
    }
    
    // Rating star functionality
    const ratingStars = document.querySelectorAll('.rating i');
    const ratingInput = document.getElementById('reviewRating');
    
    if (ratingStars.length > 0 && ratingInput) {
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                ratingInput.value = rating;
                
                // Update star appearance
                ratingStars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
            
            // Hover effect
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                ratingStars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = parseInt(ratingInput.value);
                
                ratingStars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= currentRating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
    }
    
    // Review form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reviewName').value;
            const email = document.getElementById('reviewEmail').value;
            const rating = parseInt(document.getElementById('reviewRating').value);
            const comment = document.getElementById('reviewComment').value;
            
            // Validate form
            if (!name || !email || !rating || !comment) {
                alert('Please fill in all fields');
                return;
            }
            
            // Create review object
            const review = {
                name,
                email,
                rating,
                comment,
                date: getCurrentDate()
            };
            
            // Save review
            saveReview(review);
            
            // Close modal
            closeModal('reviewModal');
            
            // Reload reviews
            loadReviews();
            
            // Reset form
            reviewForm.reset();
            ratingStars.forEach(s => {
                s.classList.remove('fas');
                s.classList.add('far');
            });
            document.getElementById('reviewRating').value = 0;
            
            // Show success message
            alert('Thank you for your review!');
        });
    }
});

// Load and display reviews
function loadReviews() {
    const reviewsContainer = document.querySelector('.reviews-container');
    if (!reviewsContainer) return;
    
    const reviews = getReviews();
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to write a review!</p>';
        return;
    }
    
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
        
        // Get random avatar
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
    
    reviewsContainer.innerHTML = reviewsHTML;
}