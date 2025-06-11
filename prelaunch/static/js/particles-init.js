// Wrap particles.js in a secure container
(function secureParticles() {
    const originalEval = window.eval;
    window.eval = function(code) {
        if (/particles/.test(code)) {
            return originalEval(code);
        }
        throw new Error('Eval usage blocked by CSP');
    };
    
    // Initialize particles after securing eval
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize particles first
        fetch('/static/js/particles-config.json')
            .then(response => response.json())
            .then(config => {
                particlesJS('particles-js', config);
                window.eval = originalEval; // Restore original eval
            });

        // Add event listeners after DOM is ready
        document.querySelector('.get-started-btn')?.addEventListener('click', showWaitlistForm);
        document.querySelector('.close')?.addEventListener('click', closeWaitlistForm);
        document.getElementById('waitlistForm')?.addEventListener('submit', submitWaitlistForm);
    });
})();

// Move your functions to this file
function showWaitlistForm() {
    const modal = document.getElementById('waitlistModal');
    modal.style.display = 'flex';
    modal.style.zIndex = '10000';
}

function closeWaitlistForm() {
    document.getElementById('waitlistModal').style.display = 'none';
}

async function submitWaitlistForm(event) {
    event.preventDefault();
    // ... keep existing submit logic ...
} 