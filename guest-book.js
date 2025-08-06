// Guest Book JavaScript with Firebase Firestore - Shared messages between all visitors
document.addEventListener('DOMContentLoaded', function() {
    const guestBookForm = document.getElementById('guestBookForm');
    const entriesContainer = document.getElementById('entriesContainer');
    
    // Only run if we're on the guest book page
    if (!guestBookForm || !entriesContainer) {
        return; // Exit if not on guest book page
    }
    
    console.log('Guest book page detected - initializing Firebase guest book functionality');
    
    // Check if Firebase is loaded
    if (typeof window.db === 'undefined') {
        console.error('Firebase not loaded! Please check firebase-config.js');
        entriesContainer.innerHTML = '<div class="empty-message">Guest book temporarily unavailable. Please try again later! 💕</div>';
        return;
    }
    
    // Load existing entries on page load
    loadGuestBookEntries();
    
    // Handle form submission
    guestBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('guestName');
        const messageInput = document.getElementById('guestMessage');
        const submitBtn = document.querySelector('.submit-btn');
        
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        if (name && message) {
            // Disable submit button to prevent double submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending... ✨';
            
            addGuestBookEntry(name, message)
                .then(() => {
                    // Clear form
                    nameInput.value = '';
                    messageInput.value = '';
                    
                    // Show success feedback
                    showSuccessMessage();
                })
                .catch((error) => {
                    console.error('Error adding message:', error);
                    showErrorMessage('Failed to send message. Please try again!');
                })
                .finally(() => {
                    // Re-enable submit button
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Leave Message ✨';
                });
        }
    });
    
    async function loadGuestBookEntries() {
        console.log('Loading guest book entries from Firebase...');
        
        try {
            // Show loading state
            entriesContainer.innerHTML = '<div class="empty-message">Loading messages... ✨</div>';
            
            // Get messages from Firestore, ordered by timestamp (newest first)
            const messagesRef = collection(window.db, 'guestBookMessages');
            const q = query(messagesRef, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const entries = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                entries.push({
                    id: doc.id,
                    name: data.name,
                    message: data.message,
                    date: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'Unknown date',
                    timestamp: data.timestamp
                });
            });
            
            console.log('Found entries:', entries.length);
            
            if (entries.length === 0) {
                console.log('No entries found, showing empty message');
                entriesContainer.innerHTML = '<div class="empty-message">No messages yet. Be the first to leave a message! 💕</div>';
                return;
            }
            
            console.log('Rendering entries...');
            entriesContainer.innerHTML = entries.map(entry => `
                <div class="entry" data-id="${entry.id}">
                    <div class="entry-header">
                        <span class="entry-name">${escapeHtml(entry.name)}</span>
                        <span class="entry-date">${entry.date}</span>
                    </div>
                    <div class="entry-message">${escapeHtml(entry.message)}</div>
                </div>
            `).join('');
            
            console.log('Entries rendered successfully');
            
        } catch (error) {
            console.error('Error loading messages:', error);
            entriesContainer.innerHTML = '<div class="empty-message">Failed to load messages. Please refresh the page! 💕</div>';
        }
    }
    
    async function addGuestBookEntry(name, message) {
        console.log('Adding guest book entry to Firebase:', { name, message });
        
        try {
            // Add message to Firestore
            const messagesRef = collection(window.db, 'guestBookMessages');
            const docRef = await addDoc(messagesRef, {
                name: name,
                message: message,
                timestamp: window.serverTimestamp()
            });
            
            console.log('Message added with ID:', docRef.id);
            
            // Refresh the display to show the new message
            await loadGuestBookEntries();
            
        } catch (error) {
            console.error('Error adding message to Firebase:', error);
            throw error;
        }
    }
    

    
    function showSuccessMessage() {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
            z-index: 1000;
            font-family: 'Montserrat', Arial, sans-serif;
            font-weight: bold;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        successDiv.textContent = 'Message sent! ✨';
        
        document.body.appendChild(successDiv);
        
        // Animate in
        setTimeout(() => {
            successDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }
    
    function showErrorMessage(message) {
        // Create a temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(90deg, #ff6961 0%, #ff8e8e 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(255, 105, 97, 0.3);
            z-index: 1000;
            font-family: 'Montserrat', Arial, sans-serif;
            font-weight: bold;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Animate in
        setTimeout(() => {
            errorDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 5000);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}); 