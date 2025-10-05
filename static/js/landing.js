// Modern Landing Page JavaScript

// Network Animation
class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        this.ctx.fill();
        
        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
            
            // Connect to mouse
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.particles[i].x - this.mouse.x;
                const dy = this.particles[i].y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const opacity = (1 - distance / this.mouse.radius) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Mouse repulsion
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.vx += Math.cos(angle) * force * 0.2;
                    particle.vy += Math.sin(angle) * force * 0.2;
                }
            }
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.particles.forEach(particle => this.drawParticle(particle));
        this.updateParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// Initialize network animation
const network = new NetworkAnimation();

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Modal Functionality
    const modal = document.getElementById('waitlistModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Open modal buttons
    const openModalButtons = [
        document.getElementById('navJoinBtn'),
        document.getElementById('heroJoinBtn'),
        document.getElementById('joinBtn')
    ].filter(btn => btn !== null);
    
    openModalButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });
    
    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form Submission
    const form = document.getElementById('waitlistForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // Validation
            if (!name || !email) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Get submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting...</span>';
            submitBtn.disabled = true;
            
            try {
                // Send data to backend
                const response = await fetch('/join-waiting-list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        userType: 'trader' // Default user type
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification(`Welcome aboard, ${name}!`, 'success');
                    form.reset();
                    
                    // Close modal after delay
                    setTimeout(() => {
                        closeModal();
                    }, 2000);
                } else {
                    showNotification(result.message || 'Something went wrong. Please try again.', 'error');
                }
                
            } catch (error) {
                showNotification('Something went wrong. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        });
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification-toast');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 
                     'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.feature-box, .step, .earnings-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Navbar Scroll Effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.background = 'rgba(5, 8, 22, 0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(5, 8, 22, 0.95)';
                navbar.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Add notification styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification-toast {
            position: fixed;
            top: 100px;
            right: -400px;
            background: rgba(10, 14, 39, 0.95);
            border: 1px solid var(--primary);
            border-radius: 15px;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 3000;
            transition: right 0.3s ease-out;
            min-width: 300px;
        }
        
        .notification-toast.show {
            right: 20px;
        }
        
        .notification-toast i {
            font-size: 1.5rem;
            color: var(--primary);
        }
        
        .notification-toast.success {
            border-color: #00ff88;
        }
        
        .notification-toast.success i {
            color: #00ff88;
        }
        
        .notification-toast.error {
            border-color: #ff4444;
        }
        
        .notification-toast.error i {
            color: #ff4444;
        }
        
        .notification-toast span {
            flex: 1;
            color: var(--text);
        }
        
        @media (max-width: 640px) {
            .notification-toast {
                left: 50%;
                right: auto;
                transform: translateX(-50%) translateY(-100px);
                min-width: 90%;
            }
            
            .notification-toast.show {
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Counter Animation for Stats
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    };
    
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K+';
        }
        return num.toString();
    };
    
    // Trigger counter animation when stats are visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const h3 = entry.target.querySelector('h3');
                if (h3) {
                    const text = h3.textContent;
                    const num = parseInt(text.replace(/\D/g, ''));
                    if (num && !entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        animateCounter(h3, num);
                    }
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
});