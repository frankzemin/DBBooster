document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('nav a');

    const phases = {
        'introduction': { html: 'phases/introduction.html', js: 'js/phases/introduction.js', init: 'initIntroduction' },
        'initial-stress': { html: 'phases/initial-stress.html', js: 'js/phases/initial-stress.js', init: 'initInitialStress' },
        'cm-parameters': { html: 'phases/cm-parameters.html', js: 'js/phases/cm-parameters.js', init: 'initCmParameters' },
        'model-configuration': { html: 'phases/model-configuration.html', js: 'js/phases/model-configuration.js', init: 'initModelConfiguration' },
        'equal-disp-boundary': { html: 'phases/equal-disp-boundary.html', js: 'js/phases/equal-disp-boundary.js', init: 'initEqualDispBoundary' },
        'earthquake-step-setting': { html: 'phases/earthquake-step-setting.html', js: 'js/phases/earthquake-step-setting.js', init: 'initEarthquakeStepSetting' },
        'ru-acc-time-diagram': { html: 'phases/ru-acc-time-diagram.html', js: 'js/phases/ru-acc-time-diagram.js', init: 'initRuAccTimeDiagram' }
    };

    async function loadPhase(phaseName) {
        const phase = phases[phaseName];
        if (!phase) {
            mainContent.innerHTML = '<p>Phase not found.</p>';
            return;
        }

        try {
            const response = await fetch(phase.html);
            if (!response.ok) {
                throw new Error(`Failed to load ${phase.html}`);
            }
            mainContent.innerHTML = await response.text();

            // Remove any existing phase script
            const oldScript = document.getElementById('phase-script');
            if (oldScript) {
                oldScript.remove();
            }

            // Load new phase script
            const script = document.createElement('script');
            script.id = 'phase-script';
            script.src = phase.js;
            script.onload = () => {
                if (window[phase.init] && typeof window[phase.init] === 'function') {
                    window[phase.init]();
                }
            };
            document.body.appendChild(script);

        } catch (error) {
            console.error('Error loading phase:', error);
            mainContent.innerHTML = `<p>Error loading phase: ${phaseName}</p>`;
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const phaseName = link.getAttribute('href').substring(1);
            loadPhase(phaseName);
        });
    });

    // Load the introduction phase by default
    loadPhase('introduction');
});
