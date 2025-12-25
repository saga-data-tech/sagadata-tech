const container = document.getElementById('particle-container');
const path = document.getElementById('master-path');
const stations = document.querySelectorAll('.station');
const modelStation = document.querySelector('.s1');
const pathLength = path.getTotalLength();
const duration = 8000;

const MILESTONE_GENERATE = 0.13;
const MILESTONE_INGEST = 0.25;
const MILESTONE_TRANSFORM = 0.58;
const MILESTONE_INTELLIGENCE = 0.75;
const MILESTONE_SERVE = 0.87;

const s2Coords = path.getPointAtLength(MILESTONE_GENERATE * pathLength);
const s3Coords = path.getPointAtLength(MILESTONE_INGEST * pathLength);

function createParticle(type) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    let width, height, driftX, driftY, animDuration, startX, startY, color, isFolder = false;
    const elapsed = (Date.now() % duration);
    const progress = elapsed / duration;

    if (type === 'fan-in') {
        startX = s2Coords.x + (Math.random() - 0.5) * 40;
        startY = s2Coords.y + (Math.random() - 0.5) * 40;
        width = Math.random() * 4 + 2; height = width;
        particle.style.borderRadius = '1px';
        driftX = (s3Coords.x - startX) + (Math.random() - 0.5) * 10;
        driftY = (s3Coords.y - startY) + (Math.random() - 0.5) * 10;
        animDuration = 800 + Math.random() * 400;
        color = 'var(--accent-color)';
    } else {
        const actualPathProgress = MILESTONE_INGEST + (progress * (1 - MILESTONE_INGEST));
        const point = path.getPointAtLength(actualPathProgress * pathLength);
        startX = point.x; startY = point.y;

        if (actualPathProgress > MILESTONE_SERVE - 0.02 && actualPathProgress < MILESTONE_SERVE + 0.02) {
            return;
        }

        if (actualPathProgress > MILESTONE_SERVE) {
            isFolder = true;
            width = 10; height = 8;
            driftX = 0; driftY = 0;
            color = 'white';
            particle.classList.add('folder');
        } else if (actualPathProgress > MILESTONE_INTELLIGENCE) {
            color = 'var(--intel-color)';
            particle.style.boxShadow = '0 0 5px var(--intel-color)';
        } else {
            color = 'var(--accent-color)';
        }

        if (!isFolder) {
            if (actualPathProgress > MILESTONE_TRANSFORM) {
                width = 15; height = 2;
                driftX = (Math.random() - 0.5) * 2; driftY = (Math.random() - 0.5) * 2;
                particle.style.borderRadius = '0';
            } else {
                width = Math.random() * 4 + 2; height = width;
                driftX = (Math.random() - 0.5) * 45; driftY = (Math.random() - 0.5) * 45;
                particle.style.borderRadius = '1px';
            }
        }
        animDuration = 500 + Math.random() * 300;
    }

    particle.style.background = color;
    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;

    container.appendChild(particle);

    const animation = particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
        { transform: `translate(${driftX}px, ${driftY}px) scale(0)`, opacity: 0 }
    ], {
        duration: animDuration,
        easing: 'ease-out'
    });
    animation.onfinish = () => particle.remove();
}

setInterval(() => createParticle('main'), 8);
setInterval(() => createParticle('fan-in'), 20);

function updateStationHighlights() {
    const elapsed = (Date.now() % duration);
    const progress = elapsed / duration;

    const pixelSteps = 5;
    const currentFill = Math.floor(progress * pixelSteps) * (100 / pixelSteps);
    if(modelStation) modelStation.style.setProperty('--model-fill', `${currentFill}%`);

    stations.forEach(station => {
        const milestone = parseFloat(station.dataset.milestone);
        let isNear = false;

        if (milestone !== 0) {
            const headPos = MILESTONE_INGEST + (progress * (1 - MILESTONE_INGEST));
            const diff = headPos - milestone;
            isNear = diff >= -0.01 && diff <= 0.04;
        } else {
            isNear = progress > 0.01 && progress < 0.99;
        }

        if (isNear) {
            station.classList.add('active');
        } else {
            station.classList.remove('active');
        }
    });
    requestAnimationFrame(updateStationHighlights);
}
requestAnimationFrame(updateStationHighlights);
