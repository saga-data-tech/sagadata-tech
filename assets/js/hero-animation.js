document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const particleCount = 500;
    const maxDistance = 600; // px spread

    // Select Container
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    // cleanup
    const oldCanvas = document.getElementById('hero-canvas');
    if (oldCanvas) oldCanvas.remove();
    let container = document.querySelector('.particle-container');
    if (container) container.remove();

    // Create Container
    container = document.createElement('div');
    container.classList.add('particle-container');
    heroVisual.appendChild(container);

    // Style Container to be centered
    Object.assign(container.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '0',
        height: '0',
        zIndex: '0', // Behind the atom
        animation: 'rot 60s linear infinite' // Slow rotation of the whole cloud
    });

    // Generate Dynamic CSS - PERFORMANCE OPTIMIZED
    let styleSheet = document.getElementById('particle-styles');
    if (styleSheet) styleSheet.remove();
    styleSheet = document.createElement('style');
    styleSheet.id = 'particle-styles';

    // Increased base size to 3px (visible start), no box-shadow for performance
    let css = `
        .particle-container div {
            position: absolute;
            height: 3px;
            width: 3px;
            margin: -1.5px; 
            border-radius: 50%;
            opacity: 0;
            will-change: transform, opacity;
        }
        @keyframes rot {
            100% { transform: rotate(360deg); }
        }
    `;

    for (let i = 1; i <= particleCount; i++) {
        const randomSignX = Math.random() > 0.5 ? 1 : -1;
        const randomSignY = Math.random() > 0.5 ? 1 : -1;
        const tx = Math.floor(Math.random() * maxDistance) * randomSignX;
        const ty = Math.floor(Math.random() * maxDistance) * randomSignY;

        const animName = `p_anim_${i}`;
        const delay = (i / particleCount) * -4 + 's';
        const duration = (2 + Math.random() * 2) + 's';

        // Pick an Olive shade for the start/outer state
        const oliveShades = ['#556B2F', '#6B8E23', '#4E3B31'];
        const startColor = oliveShades[Math.floor(Math.random() * oliveShades.length)];
        const targetColor = '#E1AD01'; // Mustard

        // Add particle DIV
        const p = document.createElement('div');
        container.appendChild(p);

        // Keyframe Logic (Reverse Playback: 100% -> 0%):
        // 100% (Outer Start): Scale 1.2, Opacity 0 (Fade in from void)
        // 80% (Outer Visible): Scale 1, Opacity 0.8, Color Olive
        // 20% (Outside Ring ~120px): Color Olive (Holding color)
        // 15% (Ring Boundary ~90px): Color SWAP to Mustard (Data Upgrade) + Shrink starts
        // 0% (Center End): Scale 0, Opacity 0 (Disappear into brain), Color Mustard

        css += `
            .particle-container div:nth-child(${i}) {
                background-color: ${startColor}; 
                animation: ${animName} ${duration} ease-in infinite reverse;
                animation-delay: ${delay};
            }
            @keyframes ${animName} {
                0% { transform: translate(0,0) scale(0); opacity: 0; background-color: ${targetColor}; }
                15% { transform: translate(${tx * 0.15}px, ${ty * 0.15}px) scale(0.6); background-color: ${targetColor}; }
                20% { transform: translate(${tx * 0.20}px, ${ty * 0.20}px) scale(0.8); background-color: ${startColor}; }
                80% { opacity: 0.8; }
                100% { transform: translate(${tx}px, ${ty}px) scale(1.2); opacity: 0; background-color: ${startColor}; }
            }
        `;
    }

    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);


    // ==========================================
    // BRAIN ANIMATION LOGIC
    // ==========================================

    function neuralize() {
        const brainContainer = document.querySelector(".brainContainer");
        // svg variable is GLOBAL from brain-svg.js
        if (brainContainer && typeof svg !== 'undefined') {
            brainContainer.innerHTML = svg;
            requestAnimationFrame(animateSVGs);
            addClass("path", "animatePaths");
            addClass("rect", "animateRects");
            addClass("circle", "animateCircles");
            addClass("ellipse", "animateCircles");
        }
    }

    function addClass(query, theClass) {
        const brainContainer = document.querySelector(".brainContainer");
        if (brainContainer) {
            var x = brainContainer.querySelectorAll(query);
            for (var i = 0; i < x.length; i++) {
                x[i].classList.add(theClass);
            }
        }
    }

    function randNum(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    function animateSVGs() {
        const brainContainer = document.querySelector(".brainContainer");
        if (!brainContainer) return;

        var allPaths = brainContainer.querySelectorAll("path");
        for (var i = 0; i < allPaths.length; i++) {
            var lineLength = allPaths[i].getTotalLength();
            allPaths[i].style.strokeDasharray = lineLength;
            allPaths[i].style.strokeDashoffset = lineLength;
            allPaths[i].style.animationDelay = randNum(-50, 50) / 10 + "s";
        }
        var allRects = brainContainer.querySelectorAll("rect");
        for (var i = 0; i < allRects.length; i++) {
            allRects[i].style.animationDelay = randNum(-50, 50) / 10 + "s";
        }
        var allCircles = brainContainer.querySelectorAll("circle");
        for (var i = 0; i < allCircles.length; i++) {
            allCircles[i].style.animationDelay = randNum(-50, 50) / 10 + "s";
        }
        var allEllipses = brainContainer.querySelectorAll("ellipse");
        for (var i = 0; i < allEllipses.length; i++) {
            allEllipses[i].style.animationDelay = randNum(-50, 50) / 10 + "s";
        }
    }

    // Trigger Brain Animation
    neuralize();

});
