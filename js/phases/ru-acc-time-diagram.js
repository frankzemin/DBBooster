function initRuAccTimeDiagram() {
    console.log('Ru-Acc-Time Diagram module loaded');

    const globalState = {
        ruAccTime: {
            chart: null,
            ruDatasets: [],
            timeAccDatasets: [],
            displacementDatasets: [],
            samplingFactor: 1,
        }
    };

    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    const BASE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
    let colorIndex = 0;

    initialize();

    function initialize() {
        if (typeof Chart !== 'undefined' && Chart.registry.plugins.get('annotation')) {
            initializeRuAccTimeChart();
            attachEventListeners();
        } else {
            console.error("Chart.js or Annotation plugin not loaded!");
        }
    }

    function attachEventListeners() {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        setupFileUpload('ru');
        setupFileUpload('timeAcc');
        setupFileUpload('displacement');

        document.getElementById('controls-toggle')?.addEventListener('click', () => {
            document.getElementById('controls-content')?.classList.toggle('open');
            document.getElementById('controls-chevron')?.classList.toggle('fa-chevron-down');
            document.getElementById('controls-chevron')?.classList.toggle('fa-chevron-up');
        });

        document.getElementById('dataset-controls-list')?.addEventListener('change', (e) => {
            const { id, type, prop } = e.target.dataset;
            if (!id || !type || !prop) return;
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            updateDatasetSetting(id, type, prop, value);
        });

        document.getElementById('apply-axis-limits')?.addEventListener('click', updateChartAxisLimits);
        document.getElementById('data-sampling')?.addEventListener('change', (e) => {
            globalState.ruAccTime.samplingFactor = parseFloat(e.target.value);
            updateChart();
        });

        document.getElementById('export-chart-image')?.addEventListener('click', exportChartImage);
        document.getElementById('clear-all-data')?.addEventListener('click', clearAllData);
    }

    function setupFileUpload(dataType) {
        let uploadAreaId, fileInputId;
        if (dataType === 'ru') {
            uploadAreaId = 'ru-upload-area';
            fileInputId = 'ru-file-input';
        } else if (dataType === 'timeAcc') {
            uploadAreaId = 'time-acc-upload-area';
            fileInputId = 'time-acc-file-input';
        } else {
            uploadAreaId = 'displacement-upload-area';
            fileInputId = 'displacement-file-input';
        }

        const uploadArea = document.getElementById(uploadAreaId);
        const fileInput = document.getElementById(fileInputId);

        if (!uploadArea || !fileInput) return;

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files, dataType);
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleFileUpload(e.target.files, dataType);
            e.target.value = null;
        });
    }

    function initializeRuAccTimeChart() {
        const ctx = document.getElementById('ru-acc-time-chart');
        if (!ctx) return;

        Chart.defaults.color = '#e2e8f0';
        Chart.defaults.borderColor = 'rgba(100, 116, 139, 0.2)';

        globalState.ruAccTime.chart = new Chart(ctx, {
            type: 'line',
            data: { datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { type: 'linear', title: { display: true, text: 'Time (seconds)' } },
                    y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Acceleration (g)', color: '#f59e0b' } },
                    y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'RU Value', color: '#3b82f6' }, grid: { drawOnChartArea: false } },
                    y2: { type: 'linear', display: true, position: 'left', offset: true, title: { display: true, text: 'Displacement', color: '#10b981' }, grid: { drawOnChartArea: false } }
                },
                plugins: {
                    legend: { display: false },
                    annotation: { annotations: {} }
                },
                animation: false,
                normalized: true,
                parsing: false,
            }
        });
    }

    function handleFileUpload(files, dataType) {
        Array.from(files).forEach(file => {
            if (file.size > MAX_FILE_SIZE) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = parseFileData(e.target.result, file.name);
                    if (!data) return;

                    const dataset = createDataset(file.name, data, dataType);

                    if (dataType === 'ru') {
                        dataset.analysis = analyzeLiquefaction(dataset.data);
                        globalState.ruAccTime.ruDatasets.push(dataset);
                        updateLiquefactionFindings();
                    } else if (dataType === 'timeAcc') {
                        globalState.ruAccTime.timeAccDatasets.push(dataset);
                    } else {
                        globalState.ruAccTime.displacementDatasets.push(dataset);
                    }

                    updateFileList(dataType);
                    updateChart();
                    updateChartControlsUI();
                } catch (error) {
                    console.error("Error parsing file:", error);
                }
            };

            if (file.name.endsWith('.xlsx')) {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    function parseFileData(fileContent, fileName) {
        let rawData = [];
        if (fileName.endsWith('.xlsx')) {
            const workbook = XLSX.read(fileContent, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        } else {
            rawData = fileContent.split(/\r?\n/).map(line => line.trim().split(/[\s,;:\t]+/));
        }

        const data = [];
        let startRow = (rawData.length > 0 && isNaN(parseFloat(rawData[0][0]))) ? 1 : 0;

        for (let i = startRow; i < rawData.length; i++) {
            if (rawData[i] && rawData[i].length >= 2) {
                const time = parseFloat(rawData[i][0]);
                const value = parseFloat(rawData[i][1]);
                if (!isNaN(time) && !isNaN(value)) {
                    data.push({ x: time, y: value });
                }
            }
        }
        return data;
    }

    function createDataset(name, data, dataType) {
        const id = `${dataType}-${Date.now()}`;
        colorIndex = (colorIndex + 1) % BASE_COLORS.length;
        let yAxisID = (dataType === 'ru') ? 'y1' : (dataType === 'timeAcc') ? 'y' : 'y2';

        return {
            id: id, name: name, data: data,
            settings: {
                visible: true, color: BASE_COLORS[colorIndex], style: 'solid',
                thickness: 2, opacity: 0.9, yAxisID: yAxisID
            },
            analysis: null
        };
    }

    function updateFileList(dataType) {
        // Implementation from original file
    }

    function removeDataset(id, dataType) {
        // Implementation from original file
    }

    function clearAllData() {
        // Implementation from original file
    }

    function analyzeLiquefaction(data) {
        // Implementation from original file
        return {}; // Placeholder
    }

    function updateLiquefactionFindings() {
        // Implementation from original file
    }

    function updateChartAnnotations() {
        // Implementation from original file
    }

    function updateChart() {
        // Implementation from original file
    }

    function updateChartControlsUI() {
        // Implementation from original file
    }

    function updateDatasetSetting(id, dataType, prop, value) {
        // Implementation from original file
    }

    function updateChartAxisLimits() {
        // Implementation from original file
    }

    function exportChartImage() {
        // Implementation from original file
    }
}
