const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const atomContainer = document.querySelector('.atom-container');

let width, height, centerX, centerY;
let particles = [];
let targetSphereRadius = 150; // Radius of the target sphere
// Palette
const greenColors = ['#2D3A2D', '#1A1C18', '#3E4B3E', '#252822', '#4A5D4A'];
const mustardColor = '#E1AD01';

// Mobile adjustments
let isMobile = window.innerWidth <= 768;

function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;

    // Calculate center based on the atom container position relative to the canvas
    const atomRect = atomContainer.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    centerX = (atomRect.left + atomRect.width / 2) - canvasRect.left;
    centerY = (atomRect.top + atomRect.height / 2) - canvasRect.top;

    isMobile = window.innerWidth <= 768;
    targetSphereRadius = isMobile ? 100 : 150;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        // Funnel Definition
        // Start (Left): centerX - 350, Height: 200 (±100)
        // End (Near Core): centerX - 90, Height: 40 (±20)

        const funnelStart = centerX - 350;
        const funnelEnd = centerX - 90;
        const funnelLength = funnelEnd - funnelStart;

        // Pick random X within funnel range
        this.x = funnelStart + Math.random() * funnelLength;

        // Calculate max Y deviation at this X (Linear interpolation)
        const progress = (this.x - funnelStart) / funnelLength; // 0 to 1
        const startHalfHeight = 100; // Wide at start
        const endHalfHeight = 10;   // Narrow at end

        // Funnel shape: wider at start, narrow at end
        // Using easeIn/Out or linear? Linear is a straight funnel.
        const currentHalfHeight = startHalfHeight - (progress * (startHalfHeight - endHalfHeight));

        this.y = centerY + (Math.random() - 0.5) * 2 * currentHalfHeight;

        this.size = Math.random() * (isMobile ? 2 : 3) + 1;
        this.color = greenColors[Math.floor(Math.random() * greenColors.length)]; // Use greenColors as 'colors' is undefined

        // State: 0=Chaos (Funnel Flow), 1=Sucking, 2=Sphere
        this.state = 0;

        // Velocity: Drift Rightwards (Flowing down funnel)
        this.vx = 0.2 + Math.random() * 0.3;
        this.vy = (Math.random() - 0.5) * 0.2;

        // Target (Sphere) variables
        this.targetAnglePhi = Math.random() * Math.PI * 2;
        this.targetAngleTheta = Math.random() * Math.PI;
        this.targetRadius = targetSphereRadius + (Math.random() - 0.5) * 20;
    }

    update() {
        if (this.state === 0) {
            // FUNNEL FLOW
            this.x += this.vx;
            this.y += this.vy;

            // Recalculate envelope to keep them inside
            const funnelStart = centerX - 350;
            const funnelEnd = centerX - 90;

            // Respawn if passed end
            if (this.x > funnelEnd) {
                // Chance to get sucked in if at the narrow tip
                if (Math.random() > 0.8) {
                    this.state = 1;
                } else {
                    this.reset();
                    this.x = funnelStart; // Reset to start to keep flow continuous
                }
            }

            // Bounce off funnel walls (Simple check)
            const funnelLength = funnelEnd - funnelStart;
            const progress = (this.x - funnelStart) / funnelLength;
            const startHalfHeight = 100;
            const endHalfHeight = 10;
            const currentHalfHeight = startHalfHeight - (progress * (startHalfHeight - endHalfHeight));

            if (this.y < centerY - currentHalfHeight || this.y > centerY + currentHalfHeight) {
                this.vy *= -1; // Bounce
            }

        } else if (this.state === 1) {
            // SUCKING: Accelerate towards center
            const dx = centerX - this.x;
            const dy = centerY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const speed = 5;
            this.x += (dx / dist) * speed;
            this.y += (dy / dist) * speed;

            // Shrink as it enters
            this.size = Math.max(0.5, this.size - 0.05);

            // Reached center? Eject!
            if (dist < 20) {
                this.state = 2;
                this.x = centerX;
                this.y = centerY;
                // Eject to right -> Change to Mustard (Saga)
                this.color = mustardColor;
                this.size = Math.random() * (isMobile ? 2 : 3) + 1; // Restore size
            }

        } else if (this.state === 2) {
            // SPHERE FORMATION
            // Calculate target position on sphere (positioned to the right)
            // We project 3D sphere coords onto 2D plane + offset

            // Rotate the entire sphere slowly
            const rotationSpeed = 0.005;
            this.targetAnglePhi += rotationSpeed;

            const sphereX = this.targetRadius * Math.sin(this.targetAngleTheta) * Math.cos(this.targetAnglePhi);
            const sphereY = this.targetRadius * Math.sin(this.targetAngleTheta) * Math.sin(this.targetAnglePhi);
            // const sphereZ = this.targetRadius * Math.cos(this.targetAngleTheta); // Depth not directly used for x/y but for scale/z-index mock

            const targetX = centerX + (isMobile ? 120 : 250) + sphereX; // Offset to right
            const targetY = centerY + sphereY;

            // Move towards target
            const dx = targetX - this.x;
            const dy = targetY - this.y;

            this.x += dx * 0.05;
            this.y += dy * 0.05;

            // Respawn eventually to keep cycle going
            if (Math.random() > 0.995) this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function init() {
    resize();
    const particleCount = isMobile ? 60 : 150;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    init(); // Re-init to adjust particle counts and positions
});

// Start
init();
animate();
