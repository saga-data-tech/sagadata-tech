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

resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;

    // Use strict vertical centering relative to canvas
    // The hero section aligns items to center, so the atom is vertically centered.
    centerX = width * 0.58; // Approximate horizontal center of the atom (accounting for grid layout)
    // Actually, let's stick to the rect method but ensure it's robust.
    // If rect fails, fallback to height/2

    try {
        const atomRect = atomContainer.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        centerX = (atomRect.left + atomRect.width / 2) - canvasRect.left;
        centerY = (atomRect.top + atomRect.height / 2) - canvasRect.top;
    } catch (e) {
        centerX = width * 0.6; // Fallback
        centerY = height / 2;
    }

    isMobile = window.innerWidth <= 768;
    targetSphereRadius = isMobile ? 100 : 150;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        // Funnel Definition
        const funnelStart = centerX - 600; // Expanded to left (was 350)
        const funnelEnd = centerX - 90;
        const funnelLength = funnelEnd - funnelStart;

        // Pick random X within funnel range
        this.x = funnelStart + Math.random() * funnelLength;

        // Calculate max Y deviation at this X (Linear interpolation)
        const progress = (this.x - funnelStart) / funnelLength; // 0 to 1
        const startHalfHeight = 60; // Narrower funnel start (was 100)
        const endHalfHeight = 10;   // Narrow at end

        const currentHalfHeight = startHalfHeight - (progress * (startHalfHeight - endHalfHeight));

        this.y = centerY + (Math.random() - 0.5) * 2 * currentHalfHeight;

        this.size = 4; // FIXED SIZE CUBES
        this.color = greenColors[Math.floor(Math.random() * greenColors.length)];

        // State: 0=Chaos (Funnel Flow), 1=Sucking, 2=Sphere
        this.state = 0;

        // Velocity: Drift Rightwards
        this.vx = 0.5 + Math.random() * 0.5; // Faster flow
        this.vy = (Math.random() - 0.5) * 0.2;

        // Target (Sphere)
        this.targetAnglePhi = Math.random() * Math.PI * 2;
        this.targetAngleTheta = Math.random() * Math.PI;
        this.targetRadius = targetSphereRadius + (Math.random() - 0.5) * 20;
    }

    update() {
        if (this.state === 0) {
            // FUNNEL FLOW
            this.x += this.vx;
            this.y += this.vy;

            const funnelStart = centerX - 600;
            const funnelEnd = centerX - 90;

            // Respawn if passed end
            if (this.x > funnelEnd) {
                if (Math.random() > 0.8) {
                    this.state = 1;
                } else {
                    this.reset();
                    this.x = funnelStart;
                }
            }

            // Bounce off funnel walls
            const funnelLength = funnelEnd - funnelStart;
            const progress = (this.x - funnelStart) / funnelLength;
            const startHalfHeight = 60;
            const endHalfHeight = 10;
            const currentHalfHeight = startHalfHeight - (progress * (startHalfHeight - endHalfHeight));

            if (this.y < centerY - currentHalfHeight || this.y > centerY + currentHalfHeight) {
                this.vy *= -1;
            }

        } else if (this.state === 1) {
            // SUCKING
            const dx = centerX - this.x;
            const dy = centerY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const speed = 7;
            this.x += (dx / dist) * speed;
            this.y += (dy / dist) * speed;

            // NO SHRINKING
            // this.size = Math.max(0.5, this.size - 0.05);

            if (dist < 20) {
                this.state = 2;
                this.x = centerX;
                this.y = centerY;
                this.color = mustardColor;
            }

        } else if (this.state === 2) {
            // SPHERE FORMATION
            const rotationSpeed = 0.005;
            this.targetAnglePhi += rotationSpeed;

            const sphereX = this.targetRadius * Math.sin(this.targetAngleTheta) * Math.cos(this.targetAnglePhi);
            const sphereY = this.targetRadius * Math.sin(this.targetAngleTheta) * Math.sin(this.targetAnglePhi);

            const targetX = centerX + (isMobile ? 120 : 250) + sphereX;
            const targetY = centerY + sphereY;

            const dx = targetX - this.x;
            const dy = targetY - this.y;

            this.x += dx * 0.05;
            this.y += dy * 0.05;

            if (Math.random() > 0.995) this.reset();
        }
    }

    draw() {
        // Draw Cube (Square)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

// Hero Animation Script - Particles Removed
// Keeps structure safe if referenced but does nothing.

function init() {
    // console.log("Hero animation initialized - minimal mode");
}

function animate() {
    // No loop needed
}

// Start
init();
