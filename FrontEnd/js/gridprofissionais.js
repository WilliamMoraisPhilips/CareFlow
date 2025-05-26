function renderTable(data) {
    const tableBody = document.querySelector("#profissionaisTable tbody");

    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    // Clear previous data
    tableBody.innerHTML = '';

    // Render new data
    data.forEach(profissional => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${profissional["NOME DO FUNCIONARIO"]}</td>
            <td>${profissional.CPF}</td>
            <td>${profissional.CARGO}</td>
            <td>${profissional.SETOR}</td>
            <td>${profissional.TELEFONE}</td>
            <td><button id="deleteButton"><img id="deleteImg" src="/FrontEnd/imagens/delete.png" alt="Delete Icon"></button></td>
        `;
        tableBody.appendChild(row);
    });
}



function loadData(setor = "") {
    let url = setor
        ? `http://localhost:8080/api/profissionais/setor/${encodeURIComponent(setor)}`
        : `http://localhost:8080/api/profissionais`;

    fetch(url)
        .then(response => response.json())
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
        console.log("funcao filtro funcionando");
        event.preventDefault();

        let inputValue = event.target.value.trim();

        if (inputValue) {
            let url = `http://localhost:8080/api/profissionais/nome/${encodeURIComponent(inputValue)}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log("Success:", data);
                    renderTable(data); // Render the table with filtered data
                })
                .catch(error => console.error("Error:", error));
        }
    }
});




window.onload = function () {
    fetch("http://localhost:8080/api/setor")
        .then(response => response.json())
        .then(data => {
            console.log("Data received:", data); // Debugging output
            const setorFilter = document.getElementById("setorFilter");

            if (!setorFilter) {
                console.error("Select element #setorFilter not found!");
                return;
            }

            setorFilter.innerHTML = '<option value="">Selecione o setor</option>';

            data.forEach(setor => {
                let option = document.createElement("option");
                option.value = setor.ID;
                option.textContent = setor.NOME;
                setorFilter.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching setores:", error));
};


document.getElementById("setorFilter").addEventListener("change", function () {
    let selectedSetor = this.value; // Get selected sector ID
    console.log("Filtering by setor:", selectedSetor); // Debugging output

    loadData(selectedSetor); // Fetch and render filtered data
});

document.getElementById("setorFilter").addEventListener("change", function () {
    let selectedSetor = this.value;
    console.log("Filtering by setor:", selectedSetor); // Debugging output

    if (selectedSetor) {
        loadData(selectedSetor);
    } else {
        loadData(); // Reload full data if "Selecione o setor" is chosen
    }
});

window.addEventListener("pageshow", function () {
    fetch("http://localhost:8080/api/setor")
        .then(response => response.json())
        .then(data => {
            console.log("Reloading setor list:", data); // Debugging output
            const setorFilter = document.getElementById("setorFilter");

            if (!setorFilter) {
                console.error("Select element #setorFilter not found!");
                return;
            }

            setorFilter.innerHTML = '<option value="">Selecione o setor</option>';

            data.forEach(setor => {
                let option = document.createElement("option");
                option.value = setor.ID;
                option.textContent = setor.NOME;
                setorFilter.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching setores:", error));
});

setTimeout(() => {
    const setorFilter = document.getElementById("setorFilter");
    console.log("Checking for setorFilter:", setorFilter); // Should return an object or `null`
}, 2000);

window.addEventListener("pageshow", function () {
    console.log("Page reloaded, fetching data...");

    // Reload both the table and dropdown listbox each time the page is shown
    loadData(); // Refresh professionals list
    fetchSetores(); // Refresh setor dropdown
});

function fetchSetores() {
    fetch("http://localhost:8080/api/setor")
        .then(response => response.json())
        .then(data => {
            console.log("Reloading setor list:", data); // Debugging output
            const setorFilter = document.getElementById("setorFilter");

            if (!setorFilter) {
                console.error("Select element #setorFilter not found!");
                return;
            }

            setorFilter.innerHTML = '<option value="">Selecione o setor</option>';

            data.forEach(setor => {
                let option = document.createElement("option");
                option.value = setor.ID;
                option.textContent = setor.NOME;
                setorFilter.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching setores:", error));
}


