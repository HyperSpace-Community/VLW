document.addEventListener('DOMContentLoaded', function() {
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

    // Realistic Solar System Physics
    const productBalls = document.querySelectorAll('.product-ball');
    const ballPhysics = [];
    const sunCore = document.querySelector('.core-inner');
    
    // Simple orbital physics constants
    const ORBITAL_SPEED = 0.02; // Base orbital speed
    const SLINGSHOT_DISTANCE = 60; // Distance for slingshot effect
    const SLINGSHOT_BOOST = 1.5; // Speed multiplier during slingshot
    
    // Get responsive scaling factor based on screen size
    function getResponsiveScale() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) return 0.5;      // Very small screens
        if (screenWidth <= 640) return 0.6;      // Small screens  
        if (screenWidth <= 968) return 0.75;     // Medium screens
        if (screenWidth <= 1200) return 0.9;     // Large screens
        return 1.0;                              // Extra large screens
    }

    // Initialize simple circular orbits
    productBalls.forEach((ball, index) => {
        const scale = getResponsiveScale();
        
        // Simple orbital parameters
        const orbitRadius = (index === 0 ? 100 : 150) * scale; // LATMO closer, MAi farther
        const baseSpeed = ORBITAL_SPEED * (index === 0 ? 1.2 : 0.8); // Inner planet faster
        
        // Start at different positions
        const initialAngle = index * Math.PI; // Start on opposite sides
        
        const ballData = {
            element: ball,
            
            // Orbital state
            angle: initialAngle,
            orbitRadius: orbitRadius,
            baseSpeed: baseSpeed,
            currentSpeed: baseSpeed,
            
            // Slingshot state
            slingshotActive: false,
            slingshotCooldown: 0,
            
            // Visual properties
            scale: 1,
            glow: { 
                radius: 20, 
                opacity: 0.5, 
                color: index === 0 ? [99, 232, 241] : [16, 185, 129] 
            },
            isHovered: false
        };
        
        ballPhysics.push(ballData);
        
        // Calculate initial position
        const x = ballData.orbitRadius * Math.cos(ballData.angle);
        const y = ballData.orbitRadius * Math.sin(ballData.angle);
        
        // Set initial position immediately for visibility
        ballData.element.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        ballData.element.style.opacity = 1;
        ballData.element.style.zIndex = 10;
        
        console.log(`Initialized planet ${index}: radius=${ballData.orbitRadius}, angle=${ballData.angle}, pos(${x}, ${y})`);
        
        // Original hover functionality
        ball.addEventListener('mouseenter', function() {
            ballData.isHovered = true;
            ball.style.cursor = 'pointer';
            // Add subtle scale effect on hover
            ball.style.transition = 'transform 0.3s ease';
            ball.style.transform += ' scale(1.1)';
        });
        
        ball.addEventListener('mouseleave', function() {
            ballData.isHovered = false;
            ball.style.cursor = 'default';
            // Remove scale effect
            ball.style.transition = 'transform 0.3s ease';
            // The transform will be updated by the animation loop
        });
        
        // Click functionality
        ball.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            if (product === 'latmo') {
                window.location.href = 'latmo.html';
            } else if (product === 'mai') {
                window.location.href = 'mai.html';
            }
        });
    });

    function updateSimpleOrbitalSystem() {
        ballPhysics.forEach((planet, index) => {
            if (!planet.isHovered) {
                // Decrease slingshot cooldown
                if (planet.slingshotCooldown > 0) {
                    planet.slingshotCooldown--;
                }
                
                // Update orbital angle
                planet.angle += planet.currentSpeed;
                
                // Calculate current position
                const x = planet.orbitRadius * Math.cos(planet.angle);
                const y = planet.orbitRadius * Math.sin(planet.angle);
                
                // Check for slingshot effects
                checkSlingshotEffects(planet, index);
                
                // Apply slingshot speed boost
                if (planet.slingshotActive && planet.slingshotCooldown === 0) {
                    planet.currentSpeed = planet.baseSpeed * SLINGSHOT_BOOST;
                    planet.slingshotCooldown = 60; // 1 second cooldown at 60fps
                } else if (!planet.slingshotActive) {
                    // Gradually return to normal speed
                    planet.currentSpeed = planet.currentSpeed * 0.98 + planet.baseSpeed * 0.02;
                }
                
                // Apply visual effects during slingshot
                const scale = planet.slingshotActive ? 1.3 : 1.0;
                const glowIntensity = planet.slingshotActive ? 1.5 : 1.0;
                
                // Update position
                planet.element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
                planet.element.style.opacity = 1;
                planet.element.style.zIndex = 10;
                
                // Update glow effect
                const balls = planet.element.querySelector('.ball-content');
                if (balls) {
                    const baseColor = planet.glow.color;
                    const glowColor = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${planet.glow.opacity * glowIntensity})`;
                    const glowRadius = planet.glow.radius * glowIntensity;
                    balls.style.boxShadow = `0 0 ${glowRadius}px ${glowColor}`;
                }
            }
        });
        
        requestAnimationFrame(updateSimpleOrbitalSystem);
    }
    
    function checkSlingshotEffects(planet, planetIndex) {
        planet.slingshotActive = false;
        
        // Check distance to sun (center)
        const distanceToSun = planet.orbitRadius;
        if (distanceToSun < SLINGSHOT_DISTANCE) {
            planet.slingshotActive = true;
        }
        
        // Check distance to other planets
        ballPhysics.forEach((otherPlanet, otherIndex) => {
            if (planetIndex !== otherIndex) {
                const x1 = planet.orbitRadius * Math.cos(planet.angle);
                const y1 = planet.orbitRadius * Math.sin(planet.angle);
                const x2 = otherPlanet.orbitRadius * Math.cos(otherPlanet.angle);
                const y2 = otherPlanet.orbitRadius * Math.sin(otherPlanet.angle);
                
                const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                
                if (distance < SLINGSHOT_DISTANCE) {
                    planet.slingshotActive = true;
                }
            }
        });
    }
    
    // Start the simple orbital system with slingshot physics
    updateSimpleOrbitalSystem();

    // Handle window resize for responsive orbital system
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Recalculate orbital parameters for new screen size
            const newScale = getResponsiveScale();
            
            ballPhysics.forEach((planet, index) => {
                // Update orbital radius with new scale
                planet.orbitRadius = (index === 0 ? 100 : 150) * newScale;
            });
        }, 250); // Debounce resize events
    });


    // Smooth Rhombus color animation for both rhombuses
    const rhombuses = ['#line1', '#line2']; // Both rhombus IDs
    const originalColor = '#44faff'; // Default original color
    
    // Array of vibrant colors for random selection
    const colors = [
        '#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff',
        '#ff8844', '#88ff44', '#4488ff', '#ff4488', '#88ff88', '#8844ff',
        '#ffaa44', '#44ffaa', '#aa44ff', '#ff44aa', '#aaff44', '#44aaff',
        '#ff6b6b', '#6bff6b', '#6b6bff', '#ffff6b', '#ff6bff', '#6bffff'
    ];
    
    // Helper to get a random color from the array
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    
    rhombuses.forEach((rhombusId, index) => {
        const rhombus = document.querySelector(rhombusId);
        if (rhombus) {
            function animateRhombusColor() {
                const randomColor = getRandomColor();
                
                // Animate to random color with smooth transition
                anime({
                    targets: rhombus,
                    stroke: randomColor,
                    duration: 1000, // Longer duration for smoother transition
                    easing: 'easeInOutCubic',
                    complete: () => {
                        // Hold the color for a moment
                        setTimeout(() => {
                            // Animate back to original color
                            anime({
                                targets: rhombus,
                                stroke: originalColor,
                                duration: 1200, // Even smoother return transition
                                easing: 'easeInOutCubic',
                                complete: () => {
                                    // Wait before next color change with random delay
                                    setTimeout(animateRhombusColor, 2000 + Math.random() * 1500);
                                }
                            });
                        }, 800); // Hold the random color for 800ms
                    }
                });
            }
            
            // Start each rhombus animation with a slight delay offset
            setTimeout(animateRhombusColor, 1000 + (index * 500));
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
document.addEventListener('DOMContentLoaded', function() {
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
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Scroll-based white theme transition for Our Innovations section
document.addEventListener('DOMContentLoaded', function() {
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