// Updated loader functionality
let loaderRequestCount = 0;

window.showLoader = function() {
    loaderRequestCount++;
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.classList.add('visible');
        loader.classList.remove('hidden');
        randomizeCandles();
    }
};

window.hideLoader = function() {
    loaderRequestCount = Math.max(0, loaderRequestCount - 1);
    if (loaderRequestCount === 0) {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.classList.remove('visible');
            }, 500);
        }
    }
};

// Initialize loader only when page starts loading
if (document.readyState === 'loading') {
    showLoader();
}

// Cleanup when page finishes loading
const hideWhenReady = () => {
    window.removeEventListener('load', hideWhenReady);
    window.removeEventListener('DOMContentLoaded', hideWhenReady);
    setTimeout(hideLoader, 500);
};

window.addEventListener('load', hideWhenReady);
document.addEventListener('DOMContentLoaded', hideWhenReady);

// Fallback cleanup
setTimeout(hideLoader, 5000);

// AJAX handling
const originalFetch = window.fetch;
window.fetch = function() {
    showLoader();
    return originalFetch.apply(this, arguments)
        .finally(hideLoader);
};

// Form submissions
document.addEventListener('submit', function(e) {
    if (!e.target.classList.contains('no-loader')) {
        showLoader();
        e.target.addEventListener('submitend', hideLoader);
    }
});

// Add this function if missing
function randomizeCandles() {
    // Your candle animation logic here
}

// Initialize particles after loader
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', window.particlesConfig);
}); 