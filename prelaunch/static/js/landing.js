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
    
    // Get Started button - redirect to signup
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            window.location.href = '/premium-signup';
        });
    }

    // Login button - redirect to login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }

    // Parallax effect for the 3D background
    const hero3DBackground = document.querySelector('.hero-3d-background');
    if (hero3DBackground) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            hero3DBackground.style.transform = `translateY(${scrollPosition * 0.5}px) translateZ(-1px) scale(2)`;
        });
    }
});
