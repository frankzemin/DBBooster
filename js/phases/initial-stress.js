function initInitialStress() {
    console.log('Initial Stress module loaded');

    function createInitialStressState() {
         return {
             fileName: null,
             originalHeaders: [],
             data: [],
             editedData: {},
             filters: {},
             currentPage: 1,
             rowsPerPage: 25,
             totalRows: 0,
             filteredRows: 0,
             analysisResults: {
                averageStressPerSolid: [],
                patternAnalysis: []
             }
         };
    }

    let state = createInitialStressState();

    attachInitialStressListeners();

    function attachInitialStressListeners() {
        const fileInput = document.getElementById('file-upload-initialStress');
        const clearButton = document.getElementById('clear-data-btn-initialStress');
        const rowsSelect = document.getElementById('rows-per-page-initialStress');
        const prevButton = document.getElementById('prev-page-initialStress');
        const nextButton = document.getElementById('next-page-initialStress');
        const runAnalysisButton = document.getElementById('run-analysis-btn-initialStress');
        const generateConcatButton = document.getElementById('generate-concatenation-btn');
        const copyConcatButton = document.getElementById('copy-concat-btn');

        fileInput?.addEventListener('change', handleInitialStressFileUpload);
        clearButton?.addEventListener('click', clearInitialStressData);
        rowsSelect?.addEventListener('change', handleInitialStressRowsChange);
        prevButton?.addEventListener('click', () => handleInitialStressPagination('prev'));
        nextButton?.addEventListener('click', () => handleInitialStressPagination('next'));
        runAnalysisButton?.addEventListener('click', performStressAnalysis);
        generateConcatButton?.addEventListener('click', generateConcatenatedOutput);
        copyConcatButton?.addEventListener('click', copyConcatenatedOutput);
    }

    function handleInitialStressFileUpload(event) {
         const file = event.target.files[0];
         const fileNameDisplay = document.getElementById('file-name-initialStress');
         const clearButton = document.getElementById('clear-data-btn-initialStress');
         const loadingIndicator = document.getElementById('loading-indicator-initialStress');
         const dataViewSection = document.getElementById('data-view-section-initialStress');
         const analysisSection = document.getElementById('stress-analysis-section-initialStress');
         const concatSection = document.getElementById('concatenation-module-section');

         if (!file) return;

         fileNameDisplay.textContent = file.name;
         clearButton.classList.remove('hidden');
         loadingIndicator.classList.remove('hidden');
         dataViewSection.classList.remove('hidden');
         analysisSection?.classList.remove('hidden');
         concatSection?.classList.remove('hidden');

         state = createInitialStressState();
         state.fileName = file.name;
         renderInitialStressGrid();

         const reader = new FileReader();
         reader.onload = function (e) {
             try {
                 const data = e.target.result;
                 const workbook = XLSX.read(data, { type: file.name.endsWith('.xlsx') ? 'binary' : 'string' });
                 const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                 const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", rawNumbers: false });
                 const extractedData = [];
                 const headerRow = jsonData[0] || [];
                 const headers = [ headerRow[0] ?? 'A', headerRow[5] ?? 'F', headerRow[6] ?? 'G', headerRow[7] ?? 'H' ];

                 for (let i = 3; i < jsonData.length; i++) {
                     const row = jsonData[i];
                     if (row && (row[0] || row[5] || row[6] || row[7])) {
                         extractedData.push([row[0] ?? "", row[5] ?? "", row[6] ?? "", row[7] ?? ""]);
                     }
                 }

                 state.originalHeaders = headers;
                 state.data = extractedData;
                 state.totalRows = extractedData.length;
                 state.filteredRows = extractedData.length;

                 renderInitialStressGrid();
                 updateInitialStressSummary();

             } catch (error) {
                 console.error("Error processing file:", error);
             } finally {
                 loadingIndicator.classList.add('hidden');
             }
         };
         reader.readAsBinaryString(file);
    }

    function clearInitialStressData() {
         state = createInitialStressState();
         document.getElementById('file-upload-initialStress').value = '';
         document.getElementById('file-name-initialStress').textContent = 'No file selected';
         document.getElementById('clear-data-btn-initialStress').classList.add('hidden');
         document.getElementById('data-view-section-initialStress').classList.add('hidden');
         document.getElementById('stress-analysis-section-initialStress')?.classList.add('hidden');
         document.getElementById('concatenation-module-section')?.classList.add('hidden');
         renderInitialStressGrid();
    }

    function updateInitialStressSummary() {
        const summaryEl = document.getElementById('summary-stats-initialStress');
        if (summaryEl) {
            const totalPages = Math.ceil(state.filteredRows / state.rowsPerPage) || 1;
            summaryEl.innerHTML = `<strong>File:</strong> ${state.fileName || 'N/A'} | <strong>Total Rows:</strong> ${state.totalRows} | <strong>Displayed:</strong> ${state.filteredRows}`;
        }
    }

    function renderInitialStressGrid() {
         const head = document.getElementById('grid-head-initialStress');
         const body = document.getElementById('grid-body-initialStress');
         const placeholder = document.getElementById('grid-placeholder-initialStress');
         const gridContainer = document.getElementById('data-grid-container-initialStress');
         const paginationControls = document.getElementById('pagination-controls-initialStress');

         if (!head || !body) return;

         head.innerHTML = '';
         body.innerHTML = '';

         if (state.data.length === 0) {
             placeholder.classList.remove('hidden');
             gridContainer.classList.add('hidden');
             paginationControls.classList.add('hidden');
             return;
         }

         placeholder.classList.add('hidden');
         gridContainer.classList.remove('hidden');
         paginationControls.classList.remove('hidden');

         let filteredData = state.data;
         // Filtering logic here...
         state.filteredRows = filteredData.length;

         const totalPages = Math.ceil(state.filteredRows / state.rowsPerPage) || 1;
         state.currentPage = Math.max(1, Math.min(state.currentPage, totalPages));
         const startRow = (state.currentPage - 1) * state.rowsPerPage;
         const endRow = startRow + state.rowsPerPage;
         const paginatedData = filteredData.slice(startRow, endRow);

         const trHead = head.insertRow();
         state.originalHeaders.forEach((headerText, index) => {
             const th = document.createElement('th');
             th.innerHTML = `<div>${headerText}</div><input type="text" class="is-filter-input" data-col-index="${index}">`;
             trHead.appendChild(th);
         });

         paginatedData.forEach((row, rowIndex) => {
             const tr = body.insertRow();
             row.forEach((cellValue, colIndex) => {
                 const td = tr.insertCell();
                 td.textContent = cellValue;
                 td.contentEditable = "true";
             });
         });

         document.getElementById('page-info-initialStress').textContent = `Page ${state.currentPage} of ${totalPages}`;
    }
}
