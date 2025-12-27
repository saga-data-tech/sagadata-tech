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
        // Vertical Constraints: Keep away from top (Nav) and bottom (Services)
        // Use 20% padding top and bottom
        const verticalPadding = height * 0.2;
        const availableHeight = height - (verticalPadding * 2);

        // Spawn on the left side, extending almost to the center
        this.x = Math.random() * (centerX - 50); // Left side up to core with buffer
        this.y = verticalPadding + Math.random() * availableHeight;

        this.size = Math.random() * (isMobile ? 2 : 3) + 1;

        // Start as Green (Source)
        this.color = greenColors[Math.floor(Math.random() * greenColors.length)];

        // State: 0=Chaos, 1=Sucking, 2=Sphere
        this.state = 0;

        // Velocity (Chaos)
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;

        // Target (Sphere)
        this.targetAnglePhi = Math.random() * Math.PI * 2;
        this.targetAngleTheta = Math.random() * Math.PI;
        this.targetRadius = targetSphereRadius + (Math.random() - 0.5) * 20;
    }

    update() {
        const verticalPadding = height * 0.2;

        if (this.state === 0) {
            // CHAOS: Drift and slowly move towards center
            this.x += this.vx + 0.2; // Slight right drift
            this.y += this.vy;

            // Constrain chaos area vertically
            if (this.y < verticalPadding || this.y > (height - verticalPadding)) this.vy *= -1;

            // Transition to sucking if close to center horizontally (but still left)
            if (this.x > (centerX - 100) && Math.random() > 0.98) {
                this.state = 1;
            }

            // Randomly respawn if it goes off screen without state change
            if (this.x > width || this.x < -50) this.reset();

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
