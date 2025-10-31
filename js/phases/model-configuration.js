function initModelConfiguration() {
    console.log('Model Configuration module loaded');

    let globalState = {
        interfaces: {
            modelConfig: createInitialState()
        }
    };

    const RESTRAINT_COL_INDICES = [4, 6, 8, 10, 12, 14];

    function createInitialState() {
        return {
            rawData: "", delimiters: [],
            tableSchemas: {
                jointCoordinates: { key: 'jointCoordinates', name: 'JOINT COORDINATES', headers: ['Joint', 'X', 'Y', 'Z', 'C5', 'C6'] },
                connectivitySolid: { key: 'connectivitySolid', name: 'CONNECTIVITY - SOLID', headers: ['Solid', 'J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8'] },
                jointRestraints: { key: 'jointRestraints', name: 'JOINT RESTRAINT ASSIGNMENTS', headers: ['Joint', 'UX', 'UY', 'UZ', 'RX', 'RY', 'RZ'] },
                solidProperties: { key: 'solidProperties', name: 'SOLID PROPERTY ASSIGNMENTS', headers: ['Solid', 'Material'] }
            },
            tables: { jointCoordinates: [], connectivitySolid: [], jointRestraints: [], solidProperties: [] },
            editedSourceData: {}, activeInspectTab: 'jointCoordinates', sourceColumnSelections: {}, sourceSubstitutions: {},
            convertedSourceData: {},
            formats: [ { id: 1, name: "Node format", primaryBaseTable: "jointCoordinates", secondaryBaseTable: "jointRestraints", columns: [], editedData: {} }, { id: 2, name: "Element format", primaryBaseTable: "connectivitySolid", secondaryBaseTable: "solidProperties", columns: [], editedData: {} } ],
            activeFormatId: 1, nextFormatId: 3, draggedHeaderIndex: null,
        };
    }

    initialize();

    function initialize() {
        const interfaceKey = 'modelConfig';
        renderInspectPanel(interfaceKey);
        renderTabs(interfaceKey);
        renderActiveFormatTabContent(interfaceKey);
        attachModelConfigListeners(interfaceKey);
    }

    function attachModelConfigListeners(interfaceKey) {
        document.getElementById(`file-upload-${interfaceKey}`)?.addEventListener('change', (e) => handleFileUpload(e, interfaceKey));
        document.getElementById(`clear-data-btn-${interfaceKey}`)?.addEventListener('click', () => clearData(interfaceKey));
        document.getElementById(`parse-btn-${interfaceKey}`)?.addEventListener('click', () => parseData(interfaceKey));
        document.getElementById(`add-tab-btn-${interfaceKey}`)?.addEventListener('click', () => addNewFormatTab(interfaceKey));
    }

    function renderTabs(interfaceKey) {
        if (interfaceKey !== 'modelConfig') return;
        const state = globalState.interfaces[interfaceKey];
        const nav = document.getElementById(`format-tabs-nav-${interfaceKey}`);
        if (!nav) return;

        nav.innerHTML = "";
        state.formats.forEach(format => {
            const btn = document.createElement('button');
            btn.className = `tab-btn py-2 px-4 text-sm font-medium ${state.activeFormatId === format.id ? 'active' : 'text-gray-400 hover:text-gray-300'}`;
            btn.textContent = format.name;
            btn.dataset.id = format.id;
            btn.addEventListener('click', (e) => switchFormatTab(interfaceKey, e));

            const span = document.createElement('span');
            span.innerHTML = "&nbsp;&nbsp;&times;";
            span.className = "text-red-500 hover:text-red-400 font-bold";
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteFormatTab(interfaceKey, format.id);
            });

            btn.addEventListener('dblclick', (e) => renameFormatTab(interfaceKey, e));
            btn.appendChild(span);
            nav.appendChild(btn);
        });
    }

    function renderActiveFormatTabContent(interfaceKey) {
        // Implementation from original file
    }

    function addNewFormatTab(interfaceKey, defaults = {}) {
        // Implementation from original file
    }

    function switchFormatTab(interfaceKey, event) {
        // Implementation from original file
    }

    function renameFormatTab(interfaceKey, event) {
        // Implementation from original file
    }

    function deleteFormatTab(interfaceKey, tabId) {
        // Implementation from original file
    }

    function handleFileUpload(event, interfaceKey) {
        // Implementation from original file
    }

    function clearData(interfaceKey) {
        // Implementation from original file
    }

    function parseData(interfaceKey) {
        // Implementation from original file
    }

    function renderInspectPanel(interfaceKey) {
        // Implementation from original file
    }
}
