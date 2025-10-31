function initIntroduction() {
    console.log('Introduction module loaded');

    function createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        const particleCount = Math.floor(window.innerWidth / 30);

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 8 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            const duration = Math.random() * 20 + 10;
            particle.style.animationDuration = `${duration}s`;

            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;

            container.appendChild(particle);
        }
    }

    createParticles();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const container = document.getElementById('particles-container');
            if (container) {
                container.innerHTML = '';
                createParticles();
            }
        }, 250);
    });
}
