// Custom Cursor Movement Tracking with Trail Effect
document.addEventListener('mousemove', (e) => {
    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        console.log('Custom cursor not found, creating one...');
        cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
    }
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Create trail elements (only on desktop with mouse)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        
        // Remove trail element after animation completes
        setTimeout(() => {
            trail.remove();
        }, 800); // Matches fadeOut animation duration
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Create custom cursor element if it doesn't exist
    if (!document.querySelector('.custom-cursor')) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
        console.log('Custom cursor element created');
    } else {
        console.log('Custom cursor element already exists');
    }
    
    // Modal functionality
    const modal = document.getElementById('waitlistModal');
    const getStartedBtn = document.querySelector('.get-started-btn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    
    // Open modal when "Join Waitlist" button is clicked
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            // Reset form and modal state before opening
            resetForm();
            
            // Ensure modal is properly positioned
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Force a reflow to ensure proper centering
            modal.offsetHeight;
        });
    }
    
    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
            resetForm();
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetForm();
        }
    });
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const selectedRole = null; // role selection removed
            
            // Validation
            if (!name) {
                alert('Please enter your name');
                return;
            }
            
            if (!email) {
                alert('Please enter your email');
                return;
            }
            
            const userType = 'learner';
            
            // Show loading state
            submitBtn.innerHTML = 'Submitting...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/join-waiting-list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        userType: userType
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message for new user added
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                    submitBtn.style.backgroundColor = 'var(--primary-color)';
                    submitBtn.style.color = 'var(--background-darker)';
                    submitBtn.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4)';
                    
                    // Show success message in modal
                    const modalContent = modal.querySelector('.modal-content');
                    const successDiv = document.createElement('div');
                    successDiv.className = 'success-notification';
                    
                    // Add inline styles as backup
                    successDiv.style.cssText = `
                        text-align: center !important;
                        padding: 1.2rem !important;
                        background: rgba(0, 255, 255, 0.05) !important;
                        border: 1px solid rgba(0, 255, 255, 0.2) !important;
                        border-radius: 12px !important;
                        margin-top: 0.5rem !important;
                        box-shadow: 0 0 20px rgba(0, 255, 255, 0.15) !important;
                        backdrop-filter: blur(10px) !important;
                        -webkit-backdrop-filter: blur(10px) !important;
                        position: relative !important;
                        overflow: hidden !important;
                        width: 100% !important;
                        max-width: none !important;
                        animation: fadeInUp 0.6s ease-out !important;
                    `;
                    
                    successDiv.innerHTML = `
                        <i class="fas fa-check-circle" style="font-size: 2.5rem !important; color: #00ffff !important; margin-bottom: 1rem !important; display: block !important; filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.5)) !important; animation: successPulse 2s ease-in-out infinite !important;"></i>
                        <h4 style="color: #00ffff !important; font-size: 1.4rem !important; margin-bottom: 0.6rem !important; font-weight: 600 !important; text-shadow: 0 0 10px rgba(0, 255, 255, 0.3) !important; background: linear-gradient(135deg, #00ffff, #80ffff) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; background-clip: text !important; text-align: center !important;">Welcome to Profitt!</h4>
                        <p style="color: #ffffff !important; font-size: 0.95rem !important; line-height: 1.5 !important; opacity: 0.9 !important; margin: 0 !important; text-align: center !important;">You've been added to our waitlist. We'll notify you as soon as we launch!</p>
                    `;
                    
                    // Replace form with success message
                    form.style.display = 'none';
                    modalContent.appendChild(successDiv);
                    
                    // Close modal after 3 seconds
                    setTimeout(() => {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        resetForm();
                    }, 3000);
                    
                } else {
                    // Handle both error messages and "already on waitlist" messages
                    const modalContent = modal.querySelector('.modal-content');
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'success-notification';
                    
                    // Add inline styles as backup
                    messageDiv.style.cssText = `
                        text-align: center !important;
                        padding: 1.2rem !important;
                        background: rgba(0, 255, 255, 0.05) !important;
                        border: 1px solid rgba(0, 255, 255, 0.2) !important;
                        border-radius: 12px !important;
                        margin-top: 0.5rem !important;
                        box-shadow: 0 0 20px rgba(0, 255, 255, 0.15) !important;
                        backdrop-filter: blur(10px) !important;
                        -webkit-backdrop-filter: blur(10px) !important;
                        position: relative !important;
                        overflow: hidden !important;
                        width: 100% !important;
                        max-width: none !important;
                        animation: fadeInUp 0.6s ease-out !important;
                    `;
                    
                    // Check if it's the "already on waitlist" message
                    if (result.message && result.message.includes("already on the waitlist")) {
                        // This is the "already on waitlist" case - treat it as a success
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                        submitBtn.style.backgroundColor = 'var(--primary-color)';
                        submitBtn.style.color = 'var(--background-darker)';
                        submitBtn.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4)';
                        
                        messageDiv.innerHTML = `
                            <i class="fas fa-check-circle" style="font-size: 2.5rem !important; color: #00ffff !important; margin-bottom: 1rem !important; display: block !important; filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.5)) !important; animation: successPulse 2s ease-in-out infinite !important;"></i>
                            <h4 style="color: #00ffff !important; font-size: 1.4rem !important; margin-bottom: 0.6rem !important; font-weight: 600 !important; text-shadow: 0 0 10px rgba(0, 255, 255, 0.3) !important; background: linear-gradient(135deg, #00ffff, #80ffff) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; background-clip: text !important; text-align: center !important;">Already on the Waitlist!</h4>
                            <p style="color: #ffffff !important; font-size: 0.95rem !important; line-height: 1.5 !important; opacity: 0.9 !important; margin: 0 !important; text-align: center !important;">You're already on the waitlist. We'll keep you updated!</p>
                        `;
                        
                        // Replace form with success message
                        form.style.display = 'none';
                        modalContent.appendChild(messageDiv);
                        
                        // Close modal after 3 seconds
                        setTimeout(() => {
                            modal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                            resetForm();
                        }, 3000);
                    } else {
                        // This is a real error - show alert
                        alert(result.message || 'Something went wrong. Please try again.');
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('Network error. Please check your connection and try again.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Function to reset form
    function resetForm() {
        if (form) {
            form.reset();
            form.style.display = 'block';
            
            // Remove success notification if it exists
            const successNotification = modal.querySelector('.success-notification');
            if (successNotification) {
                successNotification.remove();
            }
            
            // Reset submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = 'Submit';
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
                submitBtn.style.boxShadow = '';
            }
            
            // Reset any radio button selections
            const radioButtons = form.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.checked = false;
            });
            
            // Ensure modal content is clean
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                // Remove any dynamically added elements except the form
                const dynamicElements = modalContent.querySelectorAll('.success-notification, .error-message');
                dynamicElements.forEach(element => {
                    element.remove();
                });
            }
        }
    }

   
});
