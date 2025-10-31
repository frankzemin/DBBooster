function initEqualDispBoundary() {
    console.log('Equal Disp Boundary module loaded');

    const state = {
        files: [],
        activeFileIndex: 0,
        formats: [{
            id: 1,
            name: "Equal Disp Format",
            columns: [],
            editedData: {}
        }],
        activeFormatId: 1,
        draggedHeaderIndex: null,
        history: [],
        historyIndex: -1
    };

    initialize();

    function initialize() {
        renderEqualDispFormatBuilder();
        attachEqualDispListeners();
    }

    function attachEqualDispListeners() {
        const dropZone = document.getElementById('drop-zone-equalDisp');
        const fileInput = document.getElementById('file-upload-equalDisp');

        dropZone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drop-zone-over');
        });

        dropZone?.addEventListener('dragleave', (e) => {
            dropZone.classList.remove('drop-zone-over');
        });

        dropZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drop-zone-over');
            handleFileDrop(e);
        });

        fileInput?.addEventListener('change', handleFileInput);
        document.getElementById('clear-files-btn-equalDisp')?.addEventListener('click', clearEqualDispFiles);
    }

    function handleFileDrop(e) {
        if (e.dataTransfer.files.length) {
            processFiles(e.dataTransfer.files);
        }
    }

    function handleFileInput(e) {
        if (e.target.files.length) {
            processFiles(e.target.files);
        }
        e.target.value = null;
    }

    function clearEqualDispFiles() {
        state.files = [];
        state.activeFileIndex = 0;
        if (state.formats[0]) {
            state.formats[0].columns = [];
            state.formats[0].editedData = {};
        }
        renderEqualDispSourceColumns();
        renderEqualDispDataView();
        renderFormatGrid_EqualDisp();
    }

    function processFiles(files) {
        // Implementation from original file
    }

    function renderEqualDispSourceColumns() {
        // Implementation from original file
    }

    function renderEqualDispDataView() {
        // Implementation from original file
    }

    function renderEqualDispFormatBuilder() {
        // Implementation from original file
    }

    function renderFormatGrid_EqualDisp() {
        // Implementation from original file
    }
}
