function initCmParameters() {
    console.log('CM Parameters module loaded');

    let state = {
        materials: [
            {
                id: 1,
                name: "Material 1",
                values: [
                    Array(8).fill(''),
                    Array(6).fill(''),
                    Array(6).fill('')
                ]
            }
        ],
        activeMaterialId: 1,
        nextMaterialId: 2
    };

    renderCmParamsInterface();

    document.getElementById('concat-cm-params-btn')?.addEventListener('click', generateCmParamsConcatenatedLine);
    document.getElementById('add-cm-material-btn')?.addEventListener('click', addCmMaterial);
    document.getElementById('copy-output-btn')?.addEventListener('click', copyOutputToClipboard);

    function renderCmParamsInterface() {
        renderCmParamsTabs();
        renderCmParamsSections();
    }

    function renderCmParamsTabs() {
        const nav = document.getElementById('cm-params-tabs-nav');
        if (!nav) return;

        nav.innerHTML = "";

        state.materials.forEach(material => {
            const btn = document.createElement('button');
            btn.className = `cm-tab-btn ${material.id === state.activeMaterialId ? 'active' : ''}`;
            btn.textContent = material.name;
            btn.dataset.id = material.id;
            btn.addEventListener('click', switchCmMaterialTab);

            if (state.materials.length > 1) {
                const deleteBtn = document.createElement('span');
                deleteBtn.className = 'delete-material-btn';
                deleteBtn.innerHTML = '&times;';
                deleteBtn.dataset.id = material.id;
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteCmMaterial(material.id);
                };
                btn.appendChild(deleteBtn);
            }

            nav.appendChild(btn);
        });
    }

    function renderCmParamsSections() {
        const content = document.getElementById('cm-params-content');
        if (!content) return;

        content.innerHTML = "";

        state.materials.forEach(m => {
            const section = createCmMaterialSection(m);
            section.classList.toggle('hidden', m.id !== state.activeMaterialId);
            content.appendChild(section);
        });
    }

    function createCmMaterialSection(material) {
        const section = document.createElement('div');
        section.id = `cm-material-section-${material.id}`;
        section.className = 'cm-material-section';

        section.innerHTML = `
            <h3 class="text-lg font-medium mb-4 text-blue-300">${material.name} Parameters</h3>
            <div class="param-grid-container">
                <!-- Grid content will be added here -->
            </div>
        `;

        section.querySelectorAll('.param-input').forEach(input => {
            input.addEventListener('input', handleCmInputChange);
        });

        return section;
    }

    function handleCmInputChange(event) {
        const { materialId, row, col } = event.target.dataset;
        const value = event.target.value;

        const mat = state.materials.find(m => m.id === parseInt(materialId));
        if (mat?.values[row]?.[col] !== undefined) {
            mat.values[row][col] = value;
        }
    }

    function switchCmMaterialTab(event) {
        const newId = parseInt(event.target.closest('button').dataset.id);
        if (newId !== state.activeMaterialId) {
            state.activeMaterialId = newId;
            renderCmParamsInterface();
        }
    }

    function addCmMaterial() {
        const newId = state.nextMaterialId++;

        state.materials.push({
            id: newId,
            name: `Material ${newId}`,
            values: [
                Array(8).fill(''),
                Array(6).fill(''),
                Array(6).fill('')
            ]
        });

        state.activeMaterialId = newId;
        renderCmParamsInterface();
    }

    function deleteCmMaterial(materialId) {
        if (state.materials.length <= 1) return;

        const index = state.materials.findIndex(m => m.id === materialId);
        if (index === -1) return;

        state.materials.splice(index, 1);

        if (state.activeMaterialId === materialId) {
            state.activeMaterialId = state.materials[0].id;
        }

        renderCmParamsInterface();
    }

    function generateCmParamsConcatenatedLine() {
        const outputEl = document.getElementById('concatenated-output');
        if (!outputEl) return;

        const lengths = [
            [5, 5, 10, 10, 10, 10, 10, 10],
            [10, 10, 10, 10, 10, 10],
            [10, 10, 10, 10, 10, 10]
        ];

        const pad = (val, len) => (val || "").toString().padStart(len, ' ');

        const allLines = state.materials.flatMap(m => {
            return m.values.map((rowVals, rIdx) => {
                const prefix = rIdx > 0 ? " ".repeat(10) : "";
                const paddedVals = rowVals.map((v, cIdx) => pad(v, lengths[rIdx][cIdx]));
                return prefix + paddedVals.join('');
            });
        });

        outputEl.value = allLines.join('\n');
    }

    function copyOutputToClipboard() {
        const outputEl = document.getElementById('concatenated-output');
        if (!outputEl) return;

        outputEl.select();
        document.execCommand('copy');
    }
}
