document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. BRAIN ANIMATION (SVG INJECTION)
    // ==========================================
    function neuralize() {
        const brainContainer = document.querySelector(".brainContainer");
        // svg variable is GLOBAL from brain-svg.js
        if (brainContainer && typeof svg !== 'undefined') {
            brainContainer.innerHTML = svg;
            // The CSS (.brainContainer svg) handles the "glow" and "stroke" colors.
            // The CSS (g#a path) handles the "waves" and "pulse" animations if applied.
        } else {
            console.error("Brain Container or SVG missing.");
        }
    }
    neuralize();

    // ==========================================
    // 2. PARTICLE SYSTEM (Mustard/Olive Flow)
    // ==========================================
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    // Cleanup existing
    const oldCanvas = document.getElementById('hero-canvas');
    if (oldCanvas) oldCanvas.remove();
    const existingContainer = document.querySelector('.particle-container');
    if (existingContainer) existingContainer.remove();

    // Create container
    const container = document.createElement('div');
    container.classList.add('particle-container');
    heroVisual.appendChild(container); // Append to hero-visual to be behind/around the brain

    // Center the container
    Object.assign(container.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '0',
        height: '0',
        zIndex: 5, // Below Brain (z-index 10) but visible
        overflow: 'visible'
    });

    // Particle Configuration
    const particleCount = 200; // Enough density
    const maxDist = 525; // Scaled up 1.5x
    const ringDist = 210; // Scaled up 1.5x
    const brainDist = 100; // Scaled up 1.5x


    // Colors
    const oliveColor = '#556B2F';
    const mustardColor = '#E1AD01';

    let styleContent = `
        .particle-container div {
            position: absolute;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background-color: ${oliveColor};
            opacity: 0;
            will-change: transform, opacity, background-color;
        }
    `;

    for (let i = 0; i < particleCount; i++) {
        // Random Angle
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3; // 2s to 5s duration
        const delay = Math.random() * -5; // Negative delay for instant start

        // Start Position (Far away)
        const sx = Math.cos(angle) * maxDist;
        const sy = Math.sin(angle) * maxDist;

        // End Position (Center - theoretical)
        const ex = 0;
        const ey = 0;

        // Keyframe Name
        const animName = `ptcl${i}`;

        // Add Div
        const p = document.createElement('div');
        // Add random slight offsets to start to avoid perfect circles
        p.style.top = (Math.random() * 10 - 5) + 'px';
        p.style.left = (Math.random() * 10 - 5) + 'px';
        p.style.animation = `${animName} ${speed}s linear infinite`;
        p.style.animationDelay = `${delay}s`;
        container.appendChild(p);

        // Calculate Percentages for breakpoints
        // Total Distance = maxDist (approx 350)
        // Ring Distance = 140 -> approx 60% of travel (from outside in)
        // Brain Distance = 70 -> approx 80% of travel
        // Actually, traveling FROM 350 TO 0.
        // 350 -> 100% (Start)
        // 140 -> 40% distance remaining (so 60% progress)
        // 70 -> 20% distance remaining (so 80% progress)

        styleContent += `
            @keyframes ${animName} {
                0% {
                    transform: translate(${sx}px, ${sy}px);
                    opacity: 0;
                    background-color: ${oliveColor};
                }
                10% {
                    opacity: 0.8;
                }
                55% {
                    /* Approaching Ring Boundary */
                    background-color: ${oliveColor};
                    transform: translate(${sx * 0.45}px, ${sy * 0.45}px);
                }
                60% {
                    /* Crossed Ring Boundary - Turn Mustard */
                    background-color: ${mustardColor};
                    transform: translate(${sx * 0.40}px, ${sy * 0.40}px);
                }
                80% {
                    /* Approaching Brain - Still Visible */
                    opacity: 1;
                    transform: translate(${sx * 0.20}px, ${sy * 0.20}px);
                }
                85% {
                    /* Hit Brain Boundary - Vanish */
                    opacity: 0;
                    transform: translate(${sx * 0.15}px, ${sy * 0.15}px);
                }
                100% {
                    opacity: 0;
                    transform: translate(0, 0);
                }
            }
        `;
    }

    // Inject Styles
    let styleTag = document.getElementById('particle-styles');
    if (styleTag) styleTag.remove();
    styleTag = document.createElement('style');
    styleTag.id = 'particle-styles';
    styleTag.textContent = styleContent;
    document.head.appendChild(styleTag);

});
