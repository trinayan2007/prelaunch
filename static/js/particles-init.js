// Initialize particles.js without inline scripts (CSP-friendly)
window.addEventListener('load', function () {
    function startParticlesWithConfigUrl() {
        if (typeof particlesJS !== 'undefined' && particlesJS.load) {
            particlesJS.load('particles-js', '/static/js/particles-config.json', function () {
                console.log('particles.js config loaded');
            });
            return true;
        }
        return false;
    }

    function startParticlesWithFetchedConfig() {
        if (typeof particlesJS === 'undefined') return false;
        fetch('/static/js/particles-config.json')
            .then(function (r) { return r.json(); })
            .then(function (cfg) { particlesJS('particles-js', cfg); })
            .catch(function (err) { console.error('Failed to load particles config', err); });
        return true;
    }

    if (typeof particlesJS === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = function () {
            if (!startParticlesWithConfigUrl()) {
                startParticlesWithFetchedConfig();
            }
        };
        script.onerror = function () { console.error('Failed to load particles.js'); };
        document.head.appendChild(script);
    } else {
        if (!startParticlesWithConfigUrl()) {
            startParticlesWithFetchedConfig();
        }
    }
});


