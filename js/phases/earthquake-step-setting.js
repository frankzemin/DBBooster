function initEarthquakeStepSetting() {
    console.log('Earthquake Step Setting module loaded');

    document.getElementById('generate-earthquake-steps-btn')?.addEventListener('click', generateEarthquakeSteps);
    document.getElementById('copy-earthquake-btn')?.addEventListener('click', copyOutput_Earthquake);
    document.getElementById('download-earthquake-btn')?.addEventListener('click', downloadOutput_Earthquake);

    function generateEarthquakeSteps() {
        const input = document.getElementById('earthquake-steps-input');
        const output = document.getElementById('earthquake-output');

        if (!input || !output) return;

        const num = parseInt(input.value, 10);

        if (isNaN(num) || num < 1) {
            output.value = "";
            return;
        }

        const lines = [];
        for (let i = 1; i <= num; i++) {
            const line = `${"1".padStart(5)}${i.toString().padStart(5, '0')}${" ".repeat(5)}${i.toString().padStart(5, '0')}${" ".repeat(14)}1`;
            lines.push(line);
        }

        output.value = lines.join('\n');
    }

    function copyOutput_Earthquake() {
        const output = document.getElementById('earthquake-output');
        if (!output || !output.value) return;

        output.select();
        document.execCommand('copy');
    }

    function downloadOutput_Earthquake() {
        const output = document.getElementById('earthquake-output');
        if (!output || !output.value) return;

        const blob = new Blob([output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'earthquake_steps.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
