// Newsletter signup functionality with Firebase Firestore
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const submitBtn = document.querySelector('.newsletter-submit-btn');
    
    // Only run if we're on a page with the newsletter form
    if (!newsletterForm || !emailInput) {
        return; // Exit if newsletter form doesn't exist
    }
    
    console.log('Newsletter form detected - initializing newsletter functionality');
    
    // Wait for Firebase to be ready
    async function waitForFirebase(maxWait = 5000) {
        const startTime = Date.now();
        while (typeof window.db === 'undefined' && (Date.now() - startTime) < maxWait) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return typeof window.db !== 'undefined';
    }
    
    // Handle form submission
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim().toLowerCase();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNewsletterMessage('Please enter a valid email address! 💕', 'error');
            return;
        }
        
        // Wait for Firebase to be ready
        const firebaseReady = await waitForFirebase();
        if (!firebaseReady) {
            console.error('Firebase not loaded after waiting! Please check firebase-config.js');
            showNewsletterMessage('Newsletter signup temporarily unavailable. Please refresh the page! 💕', 'error');
            return;
        }
        
        // Verify all required Firebase functions are available
        if (!window.collection || !window.query || !window.getDocs || !window.addDoc || !window.where || !window.serverTimestamp) {
            console.error('Firebase functions not available:', {
                collection: !!window.collection,
                query: !!window.query,
                getDocs: !!window.getDocs,
                addDoc: !!window.addDoc,
                where: !!window.where,
                serverTimestamp: !!window.serverTimestamp
            });
            showNewsletterMessage('Firebase configuration incomplete. Please check the console! 💕', 'error');
            return;
        }
        
        // Disable submit button to prevent double submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing... ✨';
        
        try {
            // Check if email already exists
            const subscribersRef = window.collection(window.db, 'newsletterSubscribers');
            const q = window.query(subscribersRef, window.where('email', '==', email));
            const querySnapshot = await window.getDocs(q);
            
            if (!querySnapshot.empty) {
                // Email already exists
                showNewsletterMessage('You\'re already subscribed! Thanks for your support! 💕✨', 'info');
                emailInput.value = '';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Subscribe ✨';
                return;
            }
            
            // Add email to Firestore
            await window.addDoc(subscribersRef, {
                email: email,
                timestamp: window.serverTimestamp(),
                subscribed: true
            });
            
            console.log('Newsletter subscription added:', email);
            
            // Show success message
            showNewsletterMessage('Successfully subscribed! Welcome to the family! 🦊✨💕', 'success');
            
            // Clear form
            emailInput.value = '';
            
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            
            // Show more helpful error message
            let errorMessage = 'Failed to subscribe. Please try again! 💕';
            if (error.code === 'permission-denied') {
                errorMessage = 'Permission denied. Please check Firebase security rules. 💕';
            } else if (error.message) {
                console.error('Firebase error:', error.message);
            }
            
            showNewsletterMessage(errorMessage, 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe ✨';
        }
    });
    
    function showNewsletterMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'newsletter-message';
        
        // Set styles based on type
        const colors = {
            success: {
                background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
                shadow: 'rgba(76, 175, 80, 0.3)'
            },
            error: {
                background: 'linear-gradient(90deg, #ff6961 0%, #ff8e8e 100%)',
                shadow: 'rgba(255, 105, 97, 0.3)'
            },
            info: {
                background: 'linear-gradient(90deg, #a2aaff 0%, #ffe0fa 100%)',
                shadow: 'rgba(162, 170, 255, 0.3)'
            }
        };
        
        const colorScheme = colors[type] || colors.info;
        
        messageDiv.style.cssText = `
            margin-top: 20px;
            background: ${colorScheme.background};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 16px ${colorScheme.shadow};
            font-family: 'Montserrat', Arial, sans-serif;
            font-weight: bold;
            font-size: 1rem;
            text-align: center;
            animation: slideDown 0.3s ease;
        `;
        
        messageDiv.textContent = message;
        
        // Add animation keyframes if not already added
        if (!document.getElementById('newsletter-animations')) {
            const style = document.createElement('style');
            style.id = 'newsletter-animations';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Insert message after the form
        newsletterForm.parentNode.insertBefore(messageDiv, newsletterForm.nextSibling);
        
        // Remove message after 5 seconds (or 7 seconds for info messages)
        const duration = type === 'info' ? 7000 : 5000;
        setTimeout(() => {
            messageDiv.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, duration);
    }
});

