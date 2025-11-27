document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on window resize if it gets too large
        window.addEventListener('resize', function () {
            if (window.innerWidth > 968) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Orbital system with richer, layered rotation and scale
    anime({
        targets: '.orbit-1',
        rotate: '360deg',
        scale: [1, 1.05, 1],
        duration: 24000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
    });
    anime({
        targets: '.orbit-2',
        rotate: '-360deg',
        scale: [1, 1.08, 1],
        duration: 18000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
    });
    anime({
        targets: '.orbit-3',
        rotate: '360deg',
        scale: [1, 1.12, 1],
        duration: 12000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
    });

    // Core morphing with more pronounced pulse and color flicker
    anime({
        targets: '.core-inner',
        scale: [1, 1.13, 1],
        rotateZ: [0, 8, 0],
        background: [
            { value: '#ffffff' },
            { value: '#e0e0e0' },
            { value: '#ffffff' }
        ],
        boxShadow: [
            '0 0 40px rgba(255,255,255,0.3), inset 0 0 20px rgba(0,0,0,0.1)',
            '0 0 100px rgba(255,255,255,0.6), inset 0 0 40px rgba(0,0,0,0.18)',
            '0 0 40px rgba(255,255,255,0.3), inset 0 0 20px rgba(0,0,0,0.1)'
        ],
        duration: 4200,
        loop: true,
        easing: 'easeInOutSine'
    });

    // VL text animation - smooth scaling effect
    anime({
        targets: '.core-inner',
        scale: [1, 1.15, 0.95, 1],
        rotateZ: [0, 2, -2, 0],
        textShadow: [
            '0 0 0px rgba(0,0,0,0)',
            '0 2px 12px rgba(0,0,0,0.4)',
            '0 1px 6px rgba(0,0,0,0.2)',
            '0 0 0px rgba(0,0,0,0)'
        ],
        duration: 4000,
        loop: true,
        easing: 'easeInOutSine',
        delay: 800
    });

    // Simple Orbital Animation System
    const productBalls = document.querySelectorAll('.product-ball');

    if (productBalls.length === 0) {
        console.log('No product balls found - orbital animation will not start');
        return;
    }

    console.log(`Found ${productBalls.length} product balls for orbital animation`);

    // Animation control variables - declare before use
    let animationPaused = false;
    const pauseThreshold = 768; // Pause on mobile devices

    // Physics-based animation with gravity
    const gravity = 0.5; // Gravitational strength
    const damping = 0.998; // Very slight damping to maintain stable orbits

    // Ball physics objects - configured for stable circular orbits
    const ballPhysics = [
        // LATMO - starts on right side with tangential upward velocity
        {
            x: 150,
            y: 0,
            vx: 0,
            vy: 2.8,
            mass: 1,
            targetRadius: 150,  // Designated orbital radius
            isPaused: false  // Individual pause state
        },
        // MAi - starts on left side with tangential downward velocity
        {
            x: -180,
            y: 0,
            vx: 0,
            vy: -2.6,
            mass: 1,
            targetRadius: 180,  // Designated orbital radius
            isPaused: false  // Individual pause state
        },
        // FuturED - starts at top with tangential rightward velocity
        {
            x: 0,
            y: -150,
            vx: 2.7,
            vy: 0,
            mass: 1,
            targetRadius: 150,  // Designated orbital radius
            isPaused: false  // Individual pause state
        }
    ];

    // Center (Sun/VL) collision boundary
    const sunRadius = 60; // Half of the rotating orb size (80px / 2 = 40) + safety margin

    // Initialize balls with initial positions and individual hover pause
    productBalls.forEach((ball, index) => {
        if (index >= ballPhysics.length) return;

        const physics = ballPhysics[index];

        // Set initial position
        ball.style.transform = `translate(${physics.x - 15}px, ${physics.y - 15}px)`;
        ball.style.opacity = '1';
        ball.style.pointerEvents = 'auto';

        console.log(`Ball ${index} initialized at (${physics.x}, ${physics.y}) with target radius ${physics.targetRadius}`);

        // Add individual hover pause functionality
        ball.addEventListener('mouseenter', function () {
            physics.isPaused = true;
            console.log(`Ball ${index} paused`);
        });

        ball.addEventListener('mouseleave', function () {
            physics.isPaused = false;
            console.log(`Ball ${index} resumed`);
        });

        // Add click functionality
        ball.addEventListener('click', function () {
            const product = this.getAttribute('data-product');
            if (product === 'latmo') {
                window.location.href = 'latmo.html';
            } else if (product === 'mai') {
                window.location.href = 'mai.html';
            } else if (product === 'futured') {
                window.location.href = 'FuturED-Spaces.github.io-main/index.html';
            }
        });
    });

    // Physics-based gravity animation loop with orbital constraints
    function animateOrbitalSystem() {
        // Skip animation updates if paused (for mobile performance)
        // This global pause is now only for visibilitychange, not hover.
        if (animationPaused) {
            requestAnimationFrame(animateOrbitalSystem);
            return;
        }

        productBalls.forEach((ball, index) => {
            if (index >= ballPhysics.length) return;

            const physics = ballPhysics[index];

            // Skip physics update if this individual ball is paused
            if (physics.isPaused) {
                return; // Keep ball at current position, don't update physics
            }

            // Calculate distance to center (gravitational pull point)
            const dx = 0 - physics.x;
            const dy = 0 - physics.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Prevent division by zero
            if (distance === 0) return;

            // Calculate gravitational force with sun collision boundary
            const effectiveDistance = Math.max(distance, sunRadius);
            const force = gravity / (effectiveDistance * effectiveDistance) * 1000;

            // Calculate acceleration components
            const ax = (dx / distance) * force;
            const ay = (dy / distance) * force;

            // Update velocity with acceleration and damping
            physics.vx = (physics.vx + ax) * damping;
            physics.vy = (physics.vy + ay) * damping;

            // Update position with velocity
            physics.x += physics.vx;
            physics.y += physics.vy;

            // BOUNDARY CONSTRAINT: Keep ball on its designated circular orbit
            const currentDistance = Math.sqrt(physics.x * physics.x + physics.y * physics.y);

            if (currentDistance > 0) {
                // Normalize position to target radius (circular orbit constraint)
                const normalizedX = (physics.x / currentDistance) * physics.targetRadius;
                const normalizedY = (physics.y / currentDistance) * physics.targetRadius;

                // Blend current position with normalized position for smooth constraint
                const constraintStrength = 0.15; // How strongly to pull back to circular orbit
                physics.x = physics.x * (1 - constraintStrength) + normalizedX * constraintStrength;
                physics.y = physics.y * (1 - constraintStrength) + normalizedY * constraintStrength;
            }

            // COLLISION PREVENTION: Ensure ball never gets closer than sun boundary
            const finalDistance = Math.sqrt(physics.x * physics.x + physics.y * physics.y);
            if (finalDistance < sunRadius) {
                // Push ball away from center to maintain minimum distance
                const pushFactor = sunRadius / finalDistance;
                physics.x *= pushFactor;
                physics.y *= pushFactor;

                // Reflect velocity to bounce away from center
                const dotProduct = (physics.vx * physics.x + physics.vy * physics.y) / finalDistance;
                physics.vx = physics.vx - 2 * dotProduct * (physics.x / finalDistance);
                physics.vy = physics.vy - 2 * dotProduct * (physics.y / finalDistance);
            }

            // Update ball visual position
            ball.style.transform = `translate(${physics.x - 15}px, ${physics.y - 15}px)`;
            ball.style.opacity = '1';
        });

        requestAnimationFrame(animateOrbitalSystem);
    }

    // Start the gravity-based orbital animation
    console.log('Starting gravity-based orbital animation system...');
    animateOrbitalSystem();

    // Pause orbital animation on hover
    const orbitalSystem = document.querySelector('.orbital-system');
    if (orbitalSystem) {
        // Removed global hover pause, now handled individually by balls
    }

    // Handle window resize for responsive orbital system
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            // Recalculate scale for new screen size
            const screenWidth = window.innerWidth;
            const scaleFactor = screenWidth <= 480 ? 0.6 : screenWidth <= 768 ? 0.8 : 1.0;

            // Scale all ball positions and velocities
            ballPhysics.forEach((physics, index) => {
                if (index === 0) { // LATMO
                    physics.x = 150 * scaleFactor * (physics.x > 0 ? 1 : -1);
                } else if (index === 1) { // MAi
                    physics.x = -180 * scaleFactor * (physics.x > 0 ? 1 : -1);
                } else if (index === 2) { // FuturED
                    physics.y = -150 * scaleFactor * (physics.y > 0 ? 1 : -1);
                }
            });

            console.log('Orbital physics updated for screen size:', screenWidth);
        }, 250); // Debounce resize events
    });

    // Pause animations on mobile when not visible for better performance
    function handleVisibilityChange() {
        if (window.innerWidth <= pauseThreshold) {
            if (document.hidden) {
                animationPaused = true;
            } else {
                animationPaused = false;
            }
        } else {
            // Always keep animations running on desktop
            animationPaused = false;
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);


    // Smooth Rhombus color animation for both rhombuses
    const rhombuses = ['#line1', '#line2']; // Both rhombus IDs
    const originalColor = 'rgba(68, 250, 255, 0.8)'; // Bright cyan color

    // Array of vibrant colors for random selection
    const colors = [
        'rgba(255, 68, 68, 0.8)',   // Red
        'rgba(68, 255, 68, 0.8)',   // Green  
        'rgba(68, 68, 255, 0.8)',   // Blue
        'rgba(255, 255, 68, 0.8)',  // Yellow
        'rgba(255, 68, 255, 0.8)',  // Magenta
        'rgba(255, 136, 68, 0.8)',  // Orange
        'rgba(136, 255, 68, 0.8)',  // Lime
        'rgba(68, 136, 255, 0.8)',  // Light Blue
        'rgba(255, 68, 136, 0.8)',  // Pink
        'rgba(136, 68, 255, 0.8)'   // Purple
    ];

    // Helper to get a random color from the array
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    console.log('Setting up rhombus color animations...');

    rhombuses.forEach((rhombusId, index) => {
        const rhombus = document.querySelector(rhombusId);
        console.log(`Looking for rhombus: ${rhombusId}`, rhombus);

        if (rhombus) {
            // Set initial color
            rhombus.style.stroke = originalColor;
            console.log(`Rhombus ${rhombusId} found and initial color set`);

            function animateRhombusColor() {
                const randomColor = getRandomColor();
                console.log(`Animating ${rhombusId} to color: ${randomColor}`);

                // Animate to random color with smooth transition
                anime({
                    targets: rhombus,
                    stroke: randomColor,
                    duration: 1200,
                    easing: 'easeInOutCubic',
                    complete: () => {
                        // Hold the color for a moment
                        setTimeout(() => {
                            console.log(`Returning ${rhombusId} to original color: ${originalColor}`);
                            // Animate back to original color
                            anime({
                                targets: rhombus,
                                stroke: originalColor,
                                duration: 1500,
                                easing: 'easeInOutCubic',
                                complete: () => {
                                    // Wait before next color change with random delay
                                    setTimeout(animateRhombusColor, 2500 + Math.random() * 2000);
                                }
                            });
                        }, 1000); // Hold the random color for 1000ms
                    }
                });
            }

            // Start each rhombus animation with a slight delay offset
            setTimeout(animateRhombusColor, 2000 + (index * 1000));
        } else {
            console.error(`Rhombus not found: ${rhombusId}`);
        }
    });

    // Connection lines: more dynamic dash and color fade
    anime({
        targets: '.connection-line',
        strokeDashoffset: [0, -60],
        opacity: [
            { value: 0.15, duration: 0 },
            { value: 0.7, duration: 1800 },
            { value: 0.15, duration: 1800 }
        ],
        stroke: [
            { value: 'rgba(255,255,255,0.2)' },
            { value: 'rgba(68,255,255,0.3)' },
            { value: 'rgba(255,255,255,0.2)' }
        ],
        duration: 6000,
        loop: true,
        easing: 'easeInOutSine'
    });

    // Metrics: bounce and color flicker
    animateMetrics();

    // Product cards: simple fade-in without bounce
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 800,
                    delay: index * 200,
                    easing: 'easeOutQuart'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Parallax: add subtle rotation and scale for depth
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        function updateParallax() {
            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;
            anime.set('.orbital-system', {
                translateX: currentX * 28,
                translateY: currentY * 28,
                rotateX: currentY * 7,
                rotateY: currentX * 7,
                scale: 1 + (Math.abs(currentX) + Math.abs(currentY)) * 0.04
            });
            anime.set('.metric-display', {
                translateX: currentX * -16,
                translateY: currentY * -16,
                scale: 1 + (Math.abs(currentX) + Math.abs(currentY)) * 0.02
            });
            requestAnimationFrame(updateParallax);
        }
        updateParallax();
    }

    // Scroll: Adapt orbital system to theme transitions
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollPercentage = Math.min(scrollY / window.innerHeight, 1);

        // Smoother orbital system scaling
        anime.set('.orbital-system', {
            scale: 1 - scrollPercentage * 0.08,
            opacity: Math.max(0.2, 1 - scrollPercentage * 0.25),
        });

        // Update orbital rings color based on scroll position
        const isNearProductsSection = scrollY > window.innerHeight * 0.5;
        if (isNearProductsSection !== (lastScrollY > window.innerHeight * 0.5)) {
            const orbits = document.querySelectorAll('.orbit-ring');
            orbits.forEach(orbit => {
                orbit.style.transition = 'border-color 0.6s ease';
                orbit.style.borderColor = isNearProductsSection ?
                    'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)';
            });
        }

        lastScrollY = scrollY;
    });

    // Product icon: 3D spin without bounce
    document.querySelectorAll('.product-card').forEach(card => {
        const icon = card.querySelector('.product-icon svg');
        card.addEventListener('mouseenter', () => {
            anime({
                targets: icon,
                rotateY: '+=360deg',
                scale: [1, 1.08, 1],
                duration: 600,
                easing: 'easeOutQuart'
            });
        });
    });

});

// Custom Video Player for LATMO demo - works on any page
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('latmoVideo');
    if (!video) return;

    console.log('Video player initialized');

    // Get all control elements
    const playPauseBtn = document.getElementById('playPauseBtn');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeFill = document.getElementById('volumeFill');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (!playPauseBtn) {
        console.error('Play button not found');
        return;
    }

    // Format time helper
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Play/Pause functionality
    function togglePlayPause() {
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');

        if (video.paused) {
            video.play().then(() => {
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
            }).catch(e => console.error('Play failed:', e));
        } else {
            video.pause();
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
    }

    playPauseBtn.addEventListener('click', togglePlayPause);

    // Update time display and progress bar
    video.addEventListener('timeupdate', () => {
        if (!video.duration) return;

        const progress = (video.currentTime / video.duration) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressHandle) progressHandle.style.left = `${progress}%`;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
    });

    // Set duration when metadata loads
    video.addEventListener('loadedmetadata', () => {
        if (durationEl) durationEl.textContent = formatTime(video.duration);
        console.log('Video metadata loaded, duration:', video.duration);
    });

    // Progress bar seeking
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (!video.duration) return;
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            video.currentTime = progress * video.duration;
        });
    }

    // Volume control
    let lastVolume = 1;
    if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
            if (video.volume > 0) {
                lastVolume = video.volume;
                video.volume = 0;
                if (volumeFill) volumeFill.style.width = '0%';
            } else {
                video.volume = lastVolume;
                if (volumeFill) volumeFill.style.width = `${lastVolume * 100}%`;
            }
        });
    }

    // Volume slider
    if (volumeSlider) {
        volumeSlider.addEventListener('click', (e) => {
            const rect = volumeSlider.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const volume = Math.max(0, Math.min(1, clickX / rect.width));
            video.volume = volume;
            if (volumeFill) volumeFill.style.width = `${volume * 100}%`;
        });
    }

    // Fullscreen functionality
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                video.parentElement.requestFullscreen().catch(e => {
                    console.error('Fullscreen failed:', e);
                });
            }
        });
    }

    // Click video to play/pause
    video.addEventListener('click', togglePlayPause);

    console.log('Video player setup complete');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Scroll-based white theme transition for Our Innovations section
document.addEventListener('DOMContentLoaded', function () {
    const productsSection = document.getElementById('products');
    const header = document.querySelector('.header');
    if (!productsSection) return;

    let isLightMode = false;
    let fontCycleInterval = null;
    let currentFontIndex = 0;

    // Array of fonts to cycle through (using the provided Google Fonts)
    const fonts = [
        { family: "'Bitcount', monospace", weight: "600", spacing: "1px", transform: "uppercase" },
        { family: "'Notable', sans-serif", weight: "400", spacing: "2px", transform: "uppercase" },
        { family: "'Raleway', sans-serif", weight: "700", spacing: "-1px", transform: "none" },
        { family: "'Special Gothic Expanded One', sans-serif", weight: "400", spacing: "2px", transform: "uppercase" },
        { family: "'Bodoni Moda', serif", weight: "700", spacing: "0px", transform: "none" },
        { family: "'Bodoni Moda SC', serif", weight: "600", spacing: "1px", transform: "uppercase" },
        { family: "'Cinzel', serif", weight: "600", spacing: "1.5px", transform: "uppercase" }
    ];

    // Function to get a random font different from current
    function getRandomFont() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * fonts.length);
        } while (randomIndex === currentFontIndex && fonts.length > 1);

        currentFontIndex = randomIndex;
        return fonts[randomIndex];
    }

    // Function to apply random font to section header
    function applyRandomFont(sectionHeader) {
        const randomFont = getRandomFont();
        sectionHeader.style.fontFamily = randomFont.family;
        sectionHeader.style.fontWeight = randomFont.weight;
        sectionHeader.style.letterSpacing = randomFont.spacing;
        sectionHeader.style.textTransform = randomFont.transform;
    }

    // Function to start font cycling
    function startFontCycling(sectionHeader) {
        if (fontCycleInterval) return; // Already running

        fontCycleInterval = setInterval(() => {
            applyRandomFont(sectionHeader);
        }, 800); // Change font every 800ms
    }

    // Function to stop font cycling
    function stopFontCycling(sectionHeader) {
        if (fontCycleInterval) {
            clearInterval(fontCycleInterval);
            fontCycleInterval = null;

            // Revert to original font (matching CSS)
            sectionHeader.style.fontFamily = "";
            sectionHeader.style.fontWeight = "800";
            sectionHeader.style.letterSpacing = "-2px";
            sectionHeader.style.textTransform = "none";
        }
    }

    function updateTheme(progress) {
        // Calculate color values based on scroll progress (0 = dark, 1 = light)
        const bgR = Math.round(10 + (255 - 10) * progress);
        const bgG = Math.round(10 + (255 - 10) * progress);
        const bgB = Math.round(10 + (255 - 10) * progress);

        const textR = Math.round(255 - 255 * progress);
        const textG = Math.round(255 - 255 * progress);
        const textB = Math.round(255 - 255 * progress);

        // Apply theme to body
        document.body.style.backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`;
        document.body.style.color = `rgb(${textR}, ${textG}, ${textB})`;

        // Apply theme to header
        if (header) {
            header.style.background = `rgba(${bgR}, ${bgG}, ${bgB}, 0.6)`;
            header.style.color = `rgb(${textR}, ${textG}, ${textB})`;

            // Update logo color
            const logo = header.querySelector('.logo');
            if (logo) {
                logo.style.color = `rgb(${textR}, ${textG}, ${textB})`;
            }

            // Update nav links
            const navLinks = header.querySelectorAll('.nav a');
            navLinks.forEach(link => {
                const inactiveOpacity = progress > 0.5 ? 0.6 : 0.53;
                link.style.color = `rgba(${textR}, ${textG}, ${textB}, ${inactiveOpacity})`;
            });
        }

        // Apply theme to products section
        const sectionBgR = Math.round(8 + (255 - 8) * progress);
        const sectionBgG = Math.round(8 + (255 - 8) * progress);
        const sectionBgB = Math.round(8 + (255 - 8) * progress);
        productsSection.style.backgroundColor = `rgb(${sectionBgR}, ${sectionBgG}, ${sectionBgB})`;

        // Update section header with font changes
        const sectionHeader = document.getElementById('innovations-title');
        const sectionText = productsSection.querySelector('.section-header p');
        if (sectionHeader) {
            sectionHeader.style.color = `rgb(${textR}, ${textG}, ${textB})`;
            sectionHeader.style.transition = 'color 0.3s ease, font-family 0.4s ease, font-weight 0.4s ease, letter-spacing 0.4s ease, text-transform 0.4s ease';

            // Start/stop random font cycling based on white theme progress
            if (progress > 0.5) {
                // In white theme - start random font cycling
                startFontCycling(sectionHeader);
            } else {
                // In dark theme - stop cycling and use original font
                stopFontCycling(sectionHeader);
            }
        }
        if (sectionText) {
            const subTextR = Math.round(136 + (51 - 136) * progress);
            const subTextG = Math.round(136 + (51 - 136) * progress);
            const subTextB = Math.round(136 + (51 - 136) * progress);
            sectionText.style.color = `rgb(${subTextR}, ${subTextG}, ${subTextB})`;
        }

        // Update product cards
        const productCards = productsSection.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const cardBgR = Math.round(17 + (248 - 17) * progress);
            const cardBgG = Math.round(17 + (248 - 17) * progress);
            const cardBgB = Math.round(17 + (248 - 17) * progress);
            card.style.backgroundColor = `rgb(${cardBgR}, ${cardBgG}, ${cardBgB})`;

            const borderOpacity = progress > 0.5 ? 0.1 : 0.1;
            const borderR = Math.round(255 * (1 - progress));
            const borderG = Math.round(255 * (1 - progress));
            const borderB = Math.round(255 * (1 - progress));
            card.style.borderColor = `rgba(${borderR}, ${borderG}, ${borderB}, ${borderOpacity})`;

            // Update card text elements
            const cardTitle = card.querySelector('h3');
            const cardText = card.querySelector('p');
            const cardFeatures = card.querySelectorAll('.product-features li');
            const statusText = card.querySelector('.status-text');
            const learnMoreBtn = card.querySelector('.btn-primary');

            if (cardTitle) cardTitle.style.color = `rgb(${textR}, ${textG}, ${textB})`;

            if (cardText) {
                const cardTextR = Math.round(160 + (51 - 160) * progress);
                const cardTextG = Math.round(160 + (51 - 160) * progress);
                const cardTextB = Math.round(160 + (51 - 160) * progress);
                cardText.style.color = `rgb(${cardTextR}, ${cardTextG}, ${cardTextB})`;
            }

            if (statusText) {
                const statusR = Math.round(136 + (102 - 136) * progress);
                const statusG = Math.round(136 + (102 - 136) * progress);
                const statusB = Math.round(136 + (102 - 136) * progress);
                statusText.style.color = `rgb(${statusR}, ${statusG}, ${statusB})`;
            }

            cardFeatures.forEach(feature => {
                const featureR = Math.round(204 + (68 - 204) * progress);
                const featureG = Math.round(204 + (68 - 204) * progress);
                const featureB = Math.round(204 + (68 - 204) * progress);
                feature.style.color = `rgb(${featureR}, ${featureG}, ${featureB})`;

                // Fix arrow (::before) color for light theme
                if (progress > 0.5) {
                    feature.style.setProperty('--arrow-color', '#000000');
                } else {
                    feature.style.setProperty('--arrow-color', '#ffffff');
                }
            });

            // Update Learn More button for light mode
            if (learnMoreBtn) {
                if (progress > 0.5) {
                    learnMoreBtn.style.backgroundColor = '#000000';
                    learnMoreBtn.style.color = '#ffffff';
                    learnMoreBtn.style.border = '2px solid #000000';
                } else {
                    learnMoreBtn.style.backgroundColor = '#ffffff';
                    learnMoreBtn.style.color = '#0a0a0a';
                    learnMoreBtn.style.border = '2px solid #ffffff';
                }
            }
        });

        // Update hero Explore Solutions button if visible
        const exploreSolutionsBtn = document.querySelector('.hero .btn-primary');
        if (exploreSolutionsBtn && progress > 0.3) {
            if (progress > 0.5) {
                exploreSolutionsBtn.style.backgroundColor = '#000000';
                exploreSolutionsBtn.style.color = '#ffffff';
                exploreSolutionsBtn.style.border = '2px solid #000000';
            } else {
                exploreSolutionsBtn.style.backgroundColor = '#ffffff';
                exploreSolutionsBtn.style.color = '#0a0a0a';
                exploreSolutionsBtn.style.border = '2px solid #ffffff';
            }
        }
    }

    // Scroll-based theme transition
    function handleScroll() {
        const sectionTop = productsSection.offsetTop;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Start transition when section is 80% of viewport away
        const transitionStart = sectionTop - windowHeight * 0.8;
        // Complete transition when section top reaches viewport
        const transitionEnd = sectionTop - windowHeight * 0.1;

        let progress = 0;

        if (scrollY >= transitionStart && scrollY <= transitionEnd) {
            // We're in the transition zone - gradually change from dark to light
            progress = (scrollY - transitionStart) / (transitionEnd - transitionStart);
            progress = Math.max(0, Math.min(1, progress));
        } else if (scrollY > transitionEnd) {
            // We've reached the section, stay in full light mode
            progress = 1;
        } else {
            // We're before the transition zone, stay in dark mode
            progress = 0;
        }

        updateTheme(progress);
        isLightMode = progress > 0.5;
    }

    // Throttled scroll handler for better performance
    let ticking = false;
    function throttledScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Listen to scroll events
    window.addEventListener('scroll', throttledScrollHandler);

    // Initial call
    handleScroll();
});

// Function to scroll to products section with white theme transition
function scrollToProducts() {
    console.log('scrollToProducts called'); // Debug log

    const productsSection = document.getElementById('products');
    if (!productsSection) {
        console.log('Products section not found');
        return;
    }

    console.log('Products section found, creating overlay'); // Debug log

    // Create and show white flash overlay immediately
    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: white;
        z-index: 99999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-in-out;
    `;

    document.body.appendChild(flashOverlay);

    // Force immediate white flash
    requestAnimationFrame(() => {
        flashOverlay.style.opacity = '0.95';
        console.log('White flash started'); // Debug log
    });

    // Start scroll after brief delay
    setTimeout(() => {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        console.log('Scroll started'); // Debug log
    }, 200);

    // Fade out white overlay
    setTimeout(() => {
        flashOverlay.style.opacity = '0';
        console.log('White flash ending'); // Debug log
    }, 800);

    // Clean up overlay
    setTimeout(() => {
        if (flashOverlay.parentNode) {
            flashOverlay.parentNode.removeChild(flashOverlay);
        }
        console.log('Overlay removed'); // Debug log
    }, 1200);
}