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

    // Enhanced Gravitational Orbital System
    const productBalls = document.querySelectorAll('.product-ball');
    const ballPhysics = [];
    const sunCore = document.querySelector('.core-inner');
    
    // Advanced physics constants
    const GRAVITATIONAL_CONSTANT = 1.2;
    const SUN_MASS = 150;
    const BALL_MASS = 1;
    
    // Energy classification thresholds
    const LOW_ENERGY_THRESHOLD = 0.3;
    const MEDIUM_ENERGY_THRESHOLD = 0.6;
    const HIGH_ENERGY_THRESHOLD = 1.0;
    const EXTREME_ENERGY_THRESHOLD = 1.5;
    
    // Physics simulation parameters
    const TIME_STEP = 1 / 60; // 60 FPS simulation
    const FORCE_DAMPENING = 0.98;
    const VELOCITY_SMOOTHING = 0.95;
    
    // Get responsive scaling factor based on screen size
    function getResponsiveScale() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) return 0.5;      // Very small screens
        if (screenWidth <= 640) return 0.6;      // Small screens  
        if (screenWidth <= 968) return 0.75;     // Medium screens
        if (screenWidth <= 1200) return 0.9;     // Large screens
        return 1.0;                              // Extra large screens
    }

    // Initialize enhanced physics objects for each ball
    productBalls.forEach((ball, index) => {
        const scale = getResponsiveScale();
        
        // Enhanced multi-dimensional orbital characteristics for each ball (responsive)
        const semiMajorAxis = (index === 0 ? 140 : 190) * scale; // LATMO closer, MAi farther
        const eccentricity = index === 0 ? 0.25 : 0.35; // More pronounced elliptical orbits
        const orbitalPeriod = index === 0 ? 6 : 9; // Faster, more dynamic speeds
        const inclination = index === 0 ? Math.PI * 0.15 : Math.PI * 0.25; // Orbital tilt angles
        const argumentOfPeriapsis = index * Math.PI * 0.7; // Orientation of ellipse
        
        // Enhanced 4-dimensional orbital parameters (WXYZ) with more variety
        const orbitalPlanes = [
            { 
                name: 'XY_Enhanced', 
                xAxis: 1, yAxis: 1, zAxis: 0.3, wAxis: 0.1, 
                tilt: 0,
                rotationSpeed: 0.02,
                precessionRate: 0.001
            },
            { 
                name: 'XZ_Dynamic', 
                xAxis: 0.8, yAxis: 0.2, zAxis: 1, wAxis: 0.3, 
                tilt: Math.PI/4,
                rotationSpeed: -0.015,
                precessionRate: 0.0008
            },
            { 
                name: 'YZ_Tilted', 
                xAxis: 0.1, yAxis: 1, zAxis: 0.8, wAxis: 0.2, 
                tilt: Math.PI/3,
                rotationSpeed: 0.025,
                precessionRate: 0.0012
            },
            { 
                name: 'XW_Complex', 
                xAxis: 1, yAxis: 0.4, zAxis: 0.2, wAxis: 0.8, 
                tilt: Math.PI/6,
                rotationSpeed: -0.01,
                precessionRate: 0.0006
            }
        ];
        
        const plane = orbitalPlanes[index % orbitalPlanes.length];
        const initialAngle = (index * Math.PI * 1.3) + (Math.random() * Math.PI * 0.2); // More varied start positions
        
        // Calculate initial position in 4D space (responsive)
        const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
        const focus = semiMajorAxis * eccentricity;
        
        // Base elliptical coordinates (scaled for device)
        const baseX = semiMajorAxis * Math.cos(initialAngle) + focus;
        const baseY = semiMinorAxis * Math.sin(initialAngle);
        const baseZ = semiMajorAxis * Math.sin(initialAngle + plane.tilt) * 0.8; // Enhanced Z-depth component
        const baseW = semiMajorAxis * Math.cos(initialAngle + plane.tilt) * 0.4; // W-axis component
        
        // Apply 4D transformation matrix
        const initialX = baseX * plane.xAxis + baseZ * plane.zAxis * 0.7 + baseW * plane.wAxis * 0.4;
        const initialY = baseY * plane.yAxis + baseZ * plane.zAxis * 0.5 + baseW * plane.wAxis * 0.3;
        const initialZ = baseZ * 0.9 + baseW * 0.6; // Enhanced Z-depth for behind-sun positioning
        const initialW = baseW * 0.5; // 4th dimension component
        
        const ballData = {
            element: ball,
            
            // Enhanced orbital parameters
            angle: initialAngle,
            semiMajorAxis: semiMajorAxis,
            eccentricity: eccentricity,
            orbitalPeriod: orbitalPeriod,
            angularVelocity: (2 * Math.PI) / (orbitalPeriod * 60),
            baseAngularVelocity: (2 * Math.PI) / (orbitalPeriod * 60),
            inclination: inclination,
            argumentOfPeriapsis: argumentOfPeriapsis,
            
            // 4D orbital plane with enhanced dynamics
            orbitalPlane: plane,
            planeRotation: 0, // Additional rotation within the plane
            precessionAngle: 0, // Orbital precession for realistic motion
            nodeRotation: Math.random() * Math.PI * 2, // Ascending node rotation
            
            // Advanced 4D physics state
            position: { x: initialX, y: initialY, z: initialZ, w: initialW },
            velocity: { x: 0, y: 0, z: 0, w: 0 },
            acceleration: { x: 0, y: 0, z: 0, w: 0 },
            force: { x: 0, y: 0, z: 0, w: 0 },
            radius: Math.sqrt(initialX * initialX + initialY * initialY + initialZ * initialZ),
            targetRadius: semiMajorAxis,
            isHovered: false,
            
            // Physical properties
            mass: BALL_MASS,
            collisionRadius: 25,
            kineticEnergy: 0,
            potentialEnergy: 0,
            totalEnergy: 0,
            energyLevel: 'low', // low, medium, high, extreme
            
            // Gravitational interactions
            gravitationalForces: [],
            inGravitationalField: false,
            fieldStrength: 0,
            
            // Slingshot mechanics
            solarSlingshot: false,
            ballSlingshot: false,
            slingshotEnergy: 0,
            slingshotType: 'none', // none, solar, planetary, combined
            
            // Visual state management
            visualState: {
                scale: 1,
                glow: { radius: 20, opacity: 0.5, color: index === 0 ? [99, 232, 241] : [16, 185, 129] },
                trail: { opacity: 0, length: 0 }
            }
        };
        
        ballPhysics.push(ballData);
        
        // Original hover functionality with enhanced physics
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

    function updateAdvancedPhysicsSystem() {
        const currentTime = Date.now();
        
        // Reset forces for this frame
        ballPhysics.forEach(ball => {
            ball.force = { x: 0, y: 0, z: 0, w: 0 };
            ball.gravitationalForces = [];
            ball.slingshotEnergy = 0; // Reset slingshot energy each frame
        });
        
        // Calculate all gravitational forces
        calculateGravitationalForces();
        
        // Update physics for each ball
        ballPhysics.forEach((ball, index) => {
            if (!ball.isHovered) {
                updateBallPhysics(ball, currentTime);
                calculateEnergyState(ball);
                classifyEnergyLevel(ball);
            }
            
            // Apply energy-responsive visual effects
            applyEnergyResponsiveVisuals(ball, index);
            
            // Calculate distance from viewer for perspective scaling
            // Use Z-position as primary depth indicator (negative Z = behind sun = farther)
            const distanceFromViewer = Math.sqrt(
                ball.position.x * ball.position.x + 
                ball.position.y * ball.position.y + 
                Math.abs(ball.position.z) * Math.abs(ball.position.z)
            );
            
            // Enhanced distance calculation with Z-depth priority
            const zDepthFactor = ball.position.z < 0 ? 1.5 : 1.0; // Behind sun = farther
            const effectiveDistance = distanceFromViewer * zDepthFactor;
            
            // Distance-based scaling with reasonable limits
            const baseDistance = ball.semiMajorAxis;
            const distanceRatio = baseDistance / effectiveDistance;
            const distanceScale = Math.max(0.6, Math.min(1.4, distanceRatio)); // More conservative scaling
            
            // Ensure balls never get larger than sun (sun core is 120px, ball base is 30px)
            // Maximum allowed scale is 3.0x (90px) to stay smaller than sun
            const maxAllowedScale = 3.0;
            const finalScale = Math.min(maxAllowedScale, ball.visualState.scale * distanceScale);
            
            // Apply 4D transform with distance-based scaling
            ball.element.style.transform = `translate(${ball.position.x}px, ${ball.position.y * 0.6}px) scale(${finalScale})`;
            
            // Enhanced depth-based opacity for behind-sun positioning (no blur)
            const depthOpacity = Math.max(0.2, 1 - Math.abs(ball.position.z) * 0.001);
            const wOpacity = Math.max(0.3, 1 - Math.abs(ball.position.w) * 0.0008);
            
            // Z-index management for proper layering (negative Z means behind sun)
            const zIndex = ball.position.z < 0 ? 5 : 15; // Behind sun = lower z-index
            ball.element.style.zIndex = zIndex;
            ball.element.style.opacity = depthOpacity * wOpacity;
        });
        
        requestAnimationFrame(updateAdvancedPhysicsSystem);
    }
    
    // Kepler's equation solver for realistic elliptical orbits
    function solveKeplersEquation(meanAnomaly, eccentricity, tolerance = 1e-8) {
        let eccentricAnomaly = meanAnomaly;
        let delta = 1;
        let iterations = 0;
        const maxIterations = 20;
        
        // Newton-Raphson method to solve Kepler's equation
        while (Math.abs(delta) > tolerance && iterations < maxIterations) {
            const f = eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly;
            const df = 1 - eccentricity * Math.cos(eccentricAnomaly);
            delta = f / df;
            eccentricAnomaly -= delta;
            iterations++;
        }
        
        return eccentricAnomaly;
    }
    
    function calculateGravitationalForces() {
        // Solar gravitational forces in 4D space
        ballPhysics.forEach(ball => {
            const distanceToSun = Math.sqrt(
                ball.position.x * ball.position.x + 
                ball.position.y * ball.position.y + 
                ball.position.z * ball.position.z * 0.5 +
                ball.position.w * ball.position.w * 0.3
            );
            
            if (distanceToSun > 0) {
                // Gravitational force towards sun in 4D
                const solarForce = (GRAVITATIONAL_CONSTANT * SUN_MASS * ball.mass) / (distanceToSun * distanceToSun);
                const forceDirection = { 
                    x: -ball.position.x / distanceToSun, 
                    y: -ball.position.y / distanceToSun,
                    z: -ball.position.z / distanceToSun * 0.5,
                    w: -ball.position.w / distanceToSun * 0.3
                };
                
                ball.force.x += solarForce * forceDirection.x;
                ball.force.y += solarForce * forceDirection.y;
                ball.force.z += solarForce * forceDirection.z;
                ball.force.w += solarForce * forceDirection.w;
                
                // Track solar interaction
                const solarFieldStrength = solarForce / (SUN_MASS * ball.mass);
                ball.fieldStrength = solarFieldStrength;
                ball.inGravitationalField = distanceToSun < 150;
                
                // Solar slingshot detection
                if (distanceToSun < 100 && solarFieldStrength > 0.8) {
                    ball.solarSlingshot = true;
                    ball.slingshotEnergy = solarFieldStrength * distanceToSun;
                    ball.slingshotType = ball.ballSlingshot ? 'combined' : 'solar';
                } else {
                    ball.solarSlingshot = false;
                    if (ball.slingshotType === 'solar') ball.slingshotType = 'none';
                }
            }
        });
        
        // Ball-to-ball gravitational interactions in 4D space
        for (let i = 0; i < ballPhysics.length; i++) {
            for (let j = i + 1; j < ballPhysics.length; j++) {
                const ball1 = ballPhysics[i];
                const ball2 = ballPhysics[j];
                
                const dx = ball2.position.x - ball1.position.x;
                const dy = ball2.position.y - ball1.position.y;
                const dz = ball2.position.z - ball1.position.z;
                const dw = ball2.position.w - ball1.position.w;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz * 0.5 + dw * dw * 0.3);
                
                if (distance > 0 && distance < 120) {
                    // Mutual gravitational force in 4D
                    const mutualForce = (GRAVITATIONAL_CONSTANT * ball1.mass * ball2.mass) / (distance * distance);
                    const forceX = mutualForce * (dx / distance);
                    const forceY = mutualForce * (dy / distance);
                    const forceZ = mutualForce * (dz / distance) * 0.5;
                    const forceW = mutualForce * (dw / distance) * 0.3;
                    
                    // Apply forces
                    ball1.force.x += forceX;
                    ball1.force.y += forceY;
                    ball1.force.z += forceZ;
                    ball1.force.w += forceW;
                    ball2.force.x -= forceX;
                    ball2.force.y -= forceY;
                    ball2.force.z -= forceZ;
                    ball2.force.w -= forceW;
                    
                    // Slingshot mechanics
                    if (distance < 80) {
                        const slingshotIntensity = (80 - distance) / 80;
                        const energyTransfer = slingshotIntensity * mutualForce;
                        
                        ball1.ballSlingshot = true;
                        ball2.ballSlingshot = true;
                        ball1.slingshotEnergy = Math.max(ball1.slingshotEnergy, energyTransfer);
                        ball2.slingshotEnergy = Math.max(ball2.slingshotEnergy, energyTransfer);
                        ball1.slingshotType = ball1.solarSlingshot ? 'combined' : 'planetary';
                        ball2.slingshotType = ball2.solarSlingshot ? 'combined' : 'planetary';
                    } else {
                        ball1.ballSlingshot = false;
                        ball2.ballSlingshot = false;
                        if (ball1.slingshotType === 'planetary') ball1.slingshotType = 'none';
                        if (ball2.slingshotType === 'planetary') ball2.slingshotType = 'none';
                    }
                }
            }
        }
    }
    
    function updateBallPhysics(ball, currentTime) {
        // Update orbital angle - this is the primary motion driver
        ball.angle += ball.angularVelocity;
        
        // Update precession and node rotation for more realistic orbital dynamics
        ball.precessionAngle += ball.orbitalPlane.precessionRate;
        ball.nodeRotation += ball.orbitalPlane.rotationSpeed;
        ball.planeRotation += ball.angularVelocity * 0.2; // Reduced for smoother motion
        
        // Enhanced elliptical orbit calculations using eccentric anomaly
        const eccentricAnomaly = solveKeplersEquation(ball.angle, ball.eccentricity);
        const trueAnomaly = 2 * Math.atan2(
            Math.sqrt(1 + ball.eccentricity) * Math.sin(eccentricAnomaly / 2),
            Math.sqrt(1 - ball.eccentricity) * Math.cos(eccentricAnomaly / 2)
        );
        
        // Calculate orbital radius using true anomaly
        const orbitalRadius = ball.semiMajorAxis * (1 - ball.eccentricity * ball.eccentricity) / 
                             (1 + ball.eccentricity * Math.cos(trueAnomaly));
        
        // Calculate position in orbital plane
        const cosTA = Math.cos(trueAnomaly + ball.argumentOfPeriapsis);
        const sinTA = Math.sin(trueAnomaly + ball.argumentOfPeriapsis);
        
        // Enhanced elliptical coordinates with orbital mechanics
        const baseX = orbitalRadius * cosTA;
        const baseY = orbitalRadius * sinTA * Math.cos(ball.inclination);
        const baseZ = orbitalRadius * sinTA * Math.sin(ball.inclination);
        const baseW = orbitalRadius * Math.cos(trueAnomaly + ball.precessionAngle) * 0.3;
        
        // Apply 4D transformation with enhanced dynamics
        const plane = ball.orbitalPlane;
        const cosNode = Math.cos(ball.nodeRotation);
        const sinNode = Math.sin(ball.nodeRotation);
        
        // Rotate around ascending node
        const rotatedX = baseX * cosNode - baseY * sinNode;
        const rotatedY = baseX * sinNode + baseY * cosNode;
        
        // Apply 4D transformation based on orbital plane with precession
        ball.position.x = rotatedX * plane.xAxis + baseZ * plane.zAxis * 0.8 + baseW * plane.wAxis * 0.5;
        ball.position.y = rotatedY * plane.yAxis + baseZ * plane.zAxis * 0.6 + baseW * plane.wAxis * 0.4;
        ball.position.z = baseZ * 1.1 + baseW * 0.8 + Math.sin(ball.precessionAngle) * orbitalRadius * 0.2;
        ball.position.w = baseW * 0.7 + Math.cos(ball.precessionAngle + ball.nodeRotation) * orbitalRadius * 0.15;
        
        // Calculate 4D radius for distance calculations
        ball.radius = Math.sqrt(
            ball.position.x * ball.position.x + 
            ball.position.y * ball.position.y + 
            ball.position.z * ball.position.z * 0.5
        );
        
        // Apply enhanced Kepler's second law with realistic velocity variation
        if (orbitalRadius > 0) {
            // Calculate velocity based on vis-viva equation
            const specificOrbitalEnergy = -(GRAVITATIONAL_CONSTANT * SUN_MASS) / (2 * ball.semiMajorAxis);
            const velocityMagnitude = Math.sqrt(2 * ((GRAVITATIONAL_CONSTANT * SUN_MASS) / orbitalRadius - (-specificOrbitalEnergy)));
            
            // Convert to angular velocity with enhanced variation
            const keplerFactor = Math.sqrt(ball.semiMajorAxis / orbitalRadius) * 1.2;
            ball.angularVelocity = ball.baseAngularVelocity * keplerFactor;
            
            // Add slight velocity fluctuations for more dynamic motion
            const fluctuation = Math.sin(currentTime * 0.001 + ball.angle * 3) * 0.05;
            ball.angularVelocity *= (1 + fluctuation);
        }
        
        // Apply slingshot velocity boosts
        if (ball.solarSlingshot) {
            ball.angularVelocity *= (1 + ball.slingshotEnergy * 0.3);
        }
        if (ball.ballSlingshot) {
            ball.angularVelocity *= (1 + ball.slingshotEnergy * 0.2);
        }
        
        // Apply enhanced 4D gravitational perturbations with smoother variations
        const timeScale = currentTime * 0.0005;
        const orbitInfluence = (ball.fieldStrength || 0) * 0.3;
        
        // Multi-layered perturbations for more natural orbital variations
        const primaryPerturbX = Math.sin(ball.angle * 2.3 + timeScale) * orbitInfluence;
        const primaryPerturbY = Math.cos(ball.angle * 1.7 + timeScale * 1.3) * orbitInfluence;
        const primaryPerturbZ = Math.sin(ball.angle * 3.1 + ball.precessionAngle + timeScale * 0.8) * orbitInfluence * 0.7;
        const primaryPerturbW = Math.cos(ball.angle * 2.9 + ball.nodeRotation + timeScale * 0.6) * orbitInfluence * 0.5;
        
        // Secondary harmonic perturbations
        const secondaryPerturbX = Math.sin(ball.angle * 7.2 + timeScale * 2.1) * orbitInfluence * 0.3;
        const secondaryPerturbY = Math.cos(ball.angle * 5.8 + timeScale * 1.9) * orbitInfluence * 0.25;
        const secondaryPerturbZ = Math.sin(ball.angle * 9.1 + ball.precessionAngle * 2 + timeScale * 1.2) * orbitInfluence * 0.2;
        
        // Apply smoothed perturbations
        ball.position.x += primaryPerturbX + secondaryPerturbX;
        ball.position.y += primaryPerturbY + secondaryPerturbY;
        ball.position.z += primaryPerturbZ + secondaryPerturbZ;
        ball.position.w += primaryPerturbW;
        
        // Apply forces for advanced physics interactions in 4D
        ball.acceleration.x = ball.force.x / ball.mass;
        ball.acceleration.y = ball.force.y / ball.mass;
        ball.acceleration.z = ball.force.z / ball.mass;
        ball.acceleration.w = ball.force.w / ball.mass;
        
        ball.velocity.x += ball.acceleration.x * TIME_STEP;
        ball.velocity.y += ball.acceleration.y * TIME_STEP;
        ball.velocity.z += ball.acceleration.z * TIME_STEP;
        ball.velocity.w += ball.acceleration.w * TIME_STEP;
        
        // Apply small velocity corrections to position
        ball.position.x += ball.velocity.x * TIME_STEP * 0.1;
        ball.position.y += ball.velocity.y * TIME_STEP * 0.1;
        ball.position.z += ball.velocity.z * TIME_STEP * 0.05;
        ball.position.w += ball.velocity.w * TIME_STEP * 0.03;
        
        // Dampen velocity for stability
        ball.velocity.x *= VELOCITY_SMOOTHING;
        ball.velocity.y *= VELOCITY_SMOOTHING;
        ball.velocity.z *= VELOCITY_SMOOTHING;
        ball.velocity.w *= VELOCITY_SMOOTHING;
    }
    
    function calculateEnergyState(ball) {
        // Kinetic energy
        const velocityMagnitude = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
        ball.kineticEnergy = 0.5 * ball.mass * ball.angularVelocity * ball.angularVelocity * ball.radius * ball.radius;
        
        // Gravitational potential energy
        ball.potentialEnergy = -(GRAVITATIONAL_CONSTANT * SUN_MASS * ball.mass) / ball.radius;
        
        // Total energy
        ball.totalEnergy = ball.kineticEnergy + ball.potentialEnergy + ball.slingshotEnergy;
    }
    
    function classifyEnergyLevel(ball) {
        const normalizedEnergy = Math.abs(ball.totalEnergy) / (ball.mass * GRAVITATIONAL_CONSTANT);
        
        if (normalizedEnergy < LOW_ENERGY_THRESHOLD) {
            ball.energyLevel = 'low';
        } else if (normalizedEnergy < MEDIUM_ENERGY_THRESHOLD) {
            ball.energyLevel = 'medium';
        } else if (normalizedEnergy < HIGH_ENERGY_THRESHOLD) {
            ball.energyLevel = 'high';
        } else {
            ball.energyLevel = 'extreme';
        }
    }
    
    function applyEnergyResponsiveVisuals(ball, index) {
        const baseColor = ball.visualState.glow.color;
        const energyFactor = Math.abs(ball.totalEnergy) / (ball.mass * GRAVITATIONAL_CONSTANT * 2);
        
        // Energy-responsive scaling (more conservative to work with distance scaling)
        switch (ball.energyLevel) {
            case 'low':
                ball.visualState.scale = ball.isHovered ? 1.05 : 1.0;
                ball.visualState.glow.radius = 12 + energyFactor * 3;
                ball.visualState.glow.opacity = 0.3 + energyFactor * 0.15;
                break;
                
            case 'medium':
                ball.visualState.scale = ball.isHovered ? 1.08 : 1.02 + energyFactor * 0.05;
                ball.visualState.glow.radius = 15 + energyFactor * 8;
                ball.visualState.glow.opacity = 0.4 + energyFactor * 0.2;
                break;
                
            case 'high':
                ball.visualState.scale = ball.isHovered ? 1.12 : 1.05 + energyFactor * 0.08;
                ball.visualState.glow.radius = 18 + energyFactor * 12;
                ball.visualState.glow.opacity = 0.5 + energyFactor * 0.25;
                break;
                
            case 'extreme':
                ball.visualState.scale = ball.isHovered ? 1.15 : 1.08 + energyFactor * 0.1;
                ball.visualState.glow.radius = 22 + energyFactor * 18;
                ball.visualState.glow.opacity = 0.6 + energyFactor * 0.3;
                break;
        }
        
        // Apply visual effects with original colors preserved
        const ballContent = ball.element.querySelector('.ball-content');
        if (ballContent) {
            const glowColor = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${ball.visualState.glow.opacity})`;
            const glowRadius = ball.visualState.glow.radius;
            
            // Multi-layered glow for high energy states (no blur)
            let boxShadow = `0 0 ${glowRadius}px ${glowColor}`;
            if (ball.energyLevel === 'high' || ball.energyLevel === 'extreme') {
                boxShadow += `, 0 0 ${glowRadius * 0.6}px ${glowColor}`;
            }
            if (ball.energyLevel === 'extreme') {
                boxShadow += `, 0 0 ${glowRadius * 1.3}px rgba(255, 255, 255, ${ball.visualState.glow.opacity * 0.3})`;
            }
            
            ballContent.style.boxShadow = boxShadow;
            // Remove brightness, saturation, contrast, and blur filters to preserve original colors
            ballContent.style.filter = 'none';
        }
    }
    
    updateAdvancedPhysicsSystem();

    // Handle window resize for responsive orbital system
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Recalculate orbital parameters for new screen size
            const newScale = getResponsiveScale();
            
            ballPhysics.forEach((ball, index) => {
                // Update orbital parameters with new scale
                ball.semiMajorAxis = (index === 0 ? 140 : 190) * newScale;
                ball.targetRadius = ball.semiMajorAxis;
                
                // Recalculate position based on enhanced orbital mechanics
                const eccentricAnomaly = solveKeplersEquation(ball.angle, ball.eccentricity);
                const trueAnomaly = 2 * Math.atan2(
                    Math.sqrt(1 + ball.eccentricity) * Math.sin(eccentricAnomaly / 2),
                    Math.sqrt(1 - ball.eccentricity) * Math.cos(eccentricAnomaly / 2)
                );
                
                const orbitalRadius = ball.semiMajorAxis * (1 - ball.eccentricity * ball.eccentricity) / 
                                     (1 + ball.eccentricity * Math.cos(trueAnomaly));
                
                const cosTA = Math.cos(trueAnomaly + ball.argumentOfPeriapsis);
                const sinTA = Math.sin(trueAnomaly + ball.argumentOfPeriapsis);
                
                const baseX = orbitalRadius * cosTA;
                const baseY = orbitalRadius * sinTA * Math.cos(ball.inclination);
                const baseZ = orbitalRadius * sinTA * Math.sin(ball.inclination);
                const baseW = orbitalRadius * Math.cos(trueAnomaly + ball.precessionAngle) * 0.3;
                
                // Apply enhanced transformation
                const plane = ball.orbitalPlane;
                const cosNode = Math.cos(ball.nodeRotation);
                const sinNode = Math.sin(ball.nodeRotation);
                
                const rotatedX = baseX * cosNode - baseY * sinNode;
                const rotatedY = baseX * sinNode + baseY * cosNode;
                
                ball.position.x = rotatedX * plane.xAxis + baseZ * plane.zAxis * 0.8 + baseW * plane.wAxis * 0.5;
                ball.position.y = rotatedY * plane.yAxis + baseZ * plane.zAxis * 0.6 + baseW * plane.wAxis * 0.4;
                ball.position.z = baseZ * 1.1 + baseW * 0.8;
                ball.position.w = baseW * 0.7;
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

    // Scroll: Only reduce scale slightly but keep orbital system visible
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollPercentage = Math.min(scrollY / window.innerHeight, 1);
        anime.set('.orbital-system', {
            scale: 1 - scrollPercentage * 0.1, // Reduced from 0.25 to 0.1
            opacity: 1 - scrollPercentage * 0.3, // Reduced from 0.9 to 0.3
        });
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