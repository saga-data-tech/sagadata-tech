document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const particleCount = 500;
    const colors = ['#E1AD01', '#F8D568', '#C59100', '#DAA520', '#FFBF00']; // Mustard/Gold Shades
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

    // Generate Dynamic CSS
    let styleSheet = document.getElementById('particle-styles');
    if (styleSheet) styleSheet.remove();
    styleSheet = document.createElement('style');
    styleSheet.id = 'particle-styles';

    let css = `
        .particle-container div {
            position: absolute;
            height: 1.5px; /* Extremely small dots */
            width: 1.5px;
            margin: -0.75px;
            border-radius: 50%;
            opacity: 0;
        }
        @keyframes rot {
            100% { transform: rotate(360deg); }
        }
    `;

    for (let i = 1; i <= particleCount; i++) {
        // Random Position for Keyframe (Outer limit)
        // We want them to start OUT THERE (100% state in reverse) and come to CENTER (0% state in reverse)
        // With 'reverse', 0% is end state (center) and 100% is start state (outer).
        // Wait: normal animation goes 0% -> 100%. 
        // Reverse goes 100% -> 0%.
        // So at t=0 (start of reverse playback), visual state is 100%. 
        // at t=end, visual state is 0%.

        // Logic:
        // 0% { transform: translate(0,0); opacity: 1; }  <-- The center (End goal of implosion)
        // 100% { transform: translate(randomX, randomY); opacity: 0; } <-- The outer void (Start of implosion)

        const randomSignX = Math.random() > 0.5 ? 1 : -1;
        const randomSignY = Math.random() > 0.5 ? 1 : -1;
        // Distribution: concentrate more near center or uniform? Uniform is fine.
        const tx = Math.floor(Math.random() * maxDistance) * randomSignX;
        const ty = Math.floor(Math.random() * maxDistance) * randomSignY;

        const animName = `p_anim_${i}`;
        // Delay: negative delay to pre-scatter them or staggered start? 
        // User logic: animation-delay: #{(-1/$items) * $i}s
        // This spreads the phase so they don't all pulse at once.
        const delay = (i / particleCount) * -4 + 's'; // 4s cycle spread
        const duration = (2 + Math.random() * 2) + 's'; // Varied speed 2-4s
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Add particle DIV
        const p = document.createElement('div');
        // p.style.backgroundColor = color; // Inline or class? CSS is cleaner but file size... inline is easier for color.
        // Actually huge CSS string might be heavy. Let's try inline for static distinct props if possible?
        // No, the animation keyframes MUST be in CSS.
        // Color can be inline style to save CSS string size.
        container.appendChild(p);

        css += `
            .particle-container div:nth-child(${i}) {
                background-color: ${color};
                animation: ${animName} ${duration} ease-in infinite reverse;
                animation-delay: ${delay};
                box-shadow: 0 0 2px ${color}; 
            }
            @keyframes ${animName} {
                0% { transform: translate(0,0); opacity: 1; }
                100% { transform: translate(${tx}px, ${ty}px); opacity: 0; }
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
