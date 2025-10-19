// Flyer page specific functionality

// Initialize flyer page
function initializeFlyerPage() {
    console.log('Flyer page functionality initialized');
    
    // Set up phone number formatting
    setupPhoneFormatting();
    
    // Initialize image functionality
    initializeImageFunctions();
}

// Set up phone number formatting for any phone inputs
function setupPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            TournamentUtils.formatPhoneNumber(this);
        });
    });
}

// Initialize image-related functions
function initializeImageFunctions() {
    const flyerImage = document.querySelector('.flyer-image');
    if (flyerImage) {
        // Add loading state
        flyerImage.addEventListener('load', function() {
            console.log('Tournament flyer image loaded successfully');
        });
        
        // Add error handling
        flyerImage.addEventListener('error', function() {
            console.error('Failed to load tournament flyer image');
            TournamentUtils.showNotification('Failed to load tournament flyer image', 'error');
        });
    }
}

// Download image functionality
function downloadImage(format) {
    const image = document.querySelector('.flyer-image');
    if (image && image.src) {
        try {
            // Create download link
            const link = document.createElement('a');
            link.download = `king-of-spades-tournament-flyer.${format}`;
            link.href = image.src;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            TournamentUtils.showNotification(`Download started! (${format.toUpperCase()})`, 'success');
        } catch (error) {
            console.error('Download failed:', error);
            TournamentUtils.showNotification('Download failed', 'error');
        }
    } else {
        TournamentUtils.showNotification('Image not found', 'error');
    }
}

// Share on Facebook
function shareOnFacebook() {
    try {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Check out THE KING OF SPADES Tournament!');
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
        TournamentUtils.showNotification('Facebook share opened!', 'success');
    } catch (error) {
        console.error('Facebook share failed:', error);
        TournamentUtils.showNotification('Failed to open Facebook share', 'error');
    }
}

// Share on Twitter
function shareOnTwitter() {
    try {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('THE KING OF SPADES Tournament - November 8, 2025! $500 Grand Prize!');
        const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
        TournamentUtils.showNotification('Twitter share opened!', 'success');
    } catch (error) {
        console.error('Twitter share failed:', error);
        TournamentUtils.showNotification('Failed to open Twitter share', 'error');
    }
}

// Share on Instagram
function shareOnInstagram() {
    TournamentUtils.showNotification('Copy the image and share it on Instagram with #KingOfSpadesTournament', 'info');
}

// Copy link to clipboard
function copyLink() {
    TournamentUtils.copyToClipboard(window.location.href);
}

// Upload new image (if needed)
function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                TournamentUtils.showNotification('Please select a valid image file', 'error');
                return;
            }
            
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                TournamentUtils.showNotification('Image file is too large (max 10MB)', 'error');
                return;
            }
            
            // Show loading state
            const img = document.querySelector('.flyer-image');
            if (img) {
                img.style.opacity = '0.5';
            }
            
            // Read file
            const reader = new FileReader();
            reader.onload = function(e) {
                if (img) {
                    img.src = e.target.result;
                    img.style.opacity = '1';
                    TournamentUtils.showNotification('Image updated successfully!', 'success');
                }
            };
            
            reader.onerror = function() {
                if (img) {
                    img.style.opacity = '1';
                }
                TournamentUtils.showNotification('Failed to load image', 'error');
            };
            
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('flyer.html')) {
        initializeFlyerPage();
    }
});
