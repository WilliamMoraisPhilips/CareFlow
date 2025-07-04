
console.log("progfissionaisjs loaded!")

function renderTable(data) {
    const tableBody = document.querySelector("#profissionaisTable tbody");

    // if (!tableBody) {
    //     console.error("Table body not found!");
    //     return;
    // }

    tableBody.innerHTML = ''; // Clear previous data

    data.forEach(profissional => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td onclick = "abrirRelatorio('${profissional.ID}')">${profissional["NOME DO FUNCIONARIO"]}</td>
            <td onclick = "abrirRelatorio('${profissional.ID}')">${profissional.CPF}</td>
            <td onclick = "abrirRelatorio('${profissional.ID}')">${profissional.CARGO}</td>
            <td onclick = "abrirRelatorio('${profissional.ID}')">${profissional.SETOR}</td>
            <td onclick = "abrirRelatorio('${profissional.ID}')">${profissional.TELEFONE}</td>
            <td><button class="deleteButton" data-id="${profissional.ID}"><img id="deleteImg" src="/FrontEnd/imagens/delete.png" alt="Delete Icon"></button></td>
        `;
        tableBody.appendChild(row);
    });

    setupDeleteHandlers(); // Attach event handlers once the table is fully rendered
}

function abrirRelatorio(id) {
    const newWindow = window.open(
        "/FrontEnd/relatorioprofissional.html?id=" + id,
        "CareFlow",
        "width=" + screen.width + ",height=" + screen.height + ",top=0,left=0,resizable=yes"
    );

    if (newWindow) {
        newWindow.moveTo(0, 0); // Ensure it starts at the top-left
        newWindow.resizeTo(screen.width, screen.height); // Force full-screen size
    } else {
        alert("Popup blocking may be preventing the new window from opening.");
    }
}


window.loadData = function (setor = "") {
    let url = setor
        ? `http://localhost:8080/api/setores/${encodeURIComponent(setor)}`
        : `http://localhost:8080/api/profissionais`;

    console.log("Fetching data from URL:", url); // Debug log

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Filtered Data:", data); // Debugging output
            renderTable(data); // Populate table with filtered data
        })
        .catch(error => console.error("Error fetching data:", error));
}


window.loadData2 = function (cargo = "") {
    let url = cargo
        ? `http://localhost:8080/api/cargos/${encodeURIComponent(cargo)}`
        : `http://localhost:8080/api/profissionais`;

    console.log("Fetching data from URL:", url); // Debug log

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Filtered Data:", data); // Debugging output
            renderTable(data); // Populate table with filtered data
        })
        .catch(error => console.error("Error fetching data:", error));
}


document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("profissionaisTable")) {
        loadData(); // Run only if table exists
    } else {
        console.warn("Table not found. Waiting for dynamic load...");
        waitForTableToLoad();
    }
});



function waitForTableToLoad() {
    const observer = new MutationObserver((mutations, obs) => {
        if (document.getElementById("profissionaisTable")) {
            obs.disconnect(); // Stop observing once the table exists
            loadData();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}



document.addEventListener("keydown", function (event) {
    if (event.target.id === "employeeFilter" && event.key === "Enter") {
        console.log("Funcao filtro funcionando");
        event.preventDefault();

        let inputValue = event.target.value.trim();

        // Determine URL based on whether inputValue is present
        let url = inputValue
            ? `http://localhost:8080/api/profissionais/nome/${encodeURIComponent(inputValue)}`
            : `http://localhost:8080/api/profissionais`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Success:", data);
                renderTable(data); // Render the table with either filtered or unfiltered data
            })
            .catch(error => console.error("Error:", error));
    }
});



//Aqui começa o problema
if (pageUrl = undefined) {
    const pageUrl = "";
}
try {
    if (pageUrl.includes("gridprofissionais.html")) {

        window.addEventListener('DOMContentLoaded', (event) => {
            console.log("entrou na funcao")
            const selectElement = document.getElementById('setorFilter');
            const selectElement2 = document.getElementById('cargoFilter');

            fetch('http://localhost:8080/api/cargo')
                .then(response => response.json())
                .then(data => {
                    // Clear existing options
                    selectElement2.innerHTML = '';

                    // Populate select with the results
                    data.forEach(cargo => {
                        const option = document.createElement('option');
                        option.value = cargo.ID;
                        option.textContent = cargo.DESCRICAO;
                        selectElement2.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error fetching cargos:', error);
                });

        });
    }
}
catch {

}
try {
    if (pageUrl.includes("gridprofissionais.html")) {
        fetch('http://localhost:8080/api/setor')
            .then(response => response.json())
            .then(data => {
                // Clear existing options
                selectElement.innerHTML = '';

                // Populate select with the results
                data.forEach(sector => {
                    const option = document.createElement('option');
                    option.value = sector.ID;
                    option.textContent = sector.NOME;
                    selectElement.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching sectors:', error);
            });
    }
}
catch {

}

function loadCargos() {
    console.log("loadCargos is running");
    const select = document.getElementById('cargoFilter');
    if (!select) {
        console.error('Select element #cargoFilter not found.');
        return;
    }
    fetch('http://localhost:8080/api/cargo')
        .then(res => {
            if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
            return res.json();
        })
        .then(cargos => {
            select.innerHTML = '';
            const allOption = document.createElement('option');
            allOption.value = "";
            allOption.textContent = "Todos";
            allOption.selected = true;
            select.appendChild(allOption);

            cargos.forEach(car => {
                const opt = document.createElement('option');
                opt.value = car.ID;
                opt.textContent = car.DESCRICAO;
                select.appendChild(opt);
            });
        })
        .catch(err => console.error('Error fetching cargos:', err));
}
window.loadCargos = loadCargos; // Explicitly attach to `window`

window.loadSectors = function () {
    console.log("Function inside gridprofissionais.js is running!");
    const select = document.getElementById('setorFilter');
    if (!select) {
        console.error('Select element #setorFilter not found.');
        return;
    }
    fetch('http://localhost:8080/api/setor')
        .then(res => {
            if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
            return res.json();
        })
        .then(sectors => {
            // default "Todos" option to show all
            select.innerHTML = '';
            const allOption = document.createElement('option');
            allOption.value = "";
            allOption.textContent = "Todos";
            allOption.selected = true;
            select.appendChild(allOption);

            // populate sectors
            sectors.forEach(sec => {
                const opt = document.createElement('option');
                opt.value = sec.ID;
                opt.textContent = sec.NOME;
                select.appendChild(opt);
            });
        })
        .catch(err => console.error('Error fetching sectors:', err));
}


function cargoChanged() {
    const selectElement = document.getElementById('cargoFilter');
    const selectedId = selectElement.value;

    if (selectedId) {
        // Send request to the server
        fetch(`http://localhost:8080/api/cargos/${selectedId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                // Do something with the received data
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}


function setorChanged() {
    const selectElement = document.getElementById('setorFilter');
    const selectedId = selectElement.value;

    if (selectedId) {
        // Send request to the server
        fetch(`http://localhost:8080/api/setores/${selectedId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                // Do something with the received data
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}


function initCargoFilter() {
    const select = document.getElementById('cargoFilter');
    if (!select) return;

    // On change, reload professionals table
    select.addEventListener('change', () => {
        const selectedId = select.value;
        console.log('Cargo changed:', selectedId);
        loadData2(selectedId);
    });
}

function initSetorFilter() {
    const select = document.getElementById('setorFilter');
    if (!select) return;

    // On change, reload professionals table
    select.addEventListener('change', () => {
        const selectedId = select.value;
        console.log('Sector changed:', selectedId);
        loadData(selectedId);
    });
}

function setupDeleteHandlers() {
    const deleteButtons = document.querySelectorAll('button.deleteButton');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            showConfirmationModal(id); // Show the confirmation modal with the ID
        });
    });
}



document.addEventListener('DOMContentLoaded', fetchAndRenderTable);

function fetchAndRenderTable() {
    fetch('http://localhost:8080/api/profissionais')
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function showConfirmationModal(id) {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';

    document.getElementById('confirmYes').onclick = function () {
        modal.style.display = 'none';
        deleteProfissional(id); // Proceed with deletion
    };

    document.getElementById('confirmNo').onclick = function () {
        modal.style.display = 'none'; // Simply close the modal without deletion
    };
}

function deleteProfissional(id) {
    fetch(`http://localhost:8080/api/profissionais/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                alert(`A exclusão foi realizada com sucesso.`);
                // Re-fetch and render the updated table
                fetchAndRenderTable();
            } else {
                alert(`Falha ao realizar a exclusão.\nAinda há algum contrato vigente ou paciente(s) em atendimento por esse profissional.`);
            }
        })
        .catch(error => console.error('Error:', error));
}