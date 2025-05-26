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


window.addEventListener('DOMContentLoaded', (event) => {
    console.log("entrou na funcao")
    const selectElement = document.getElementById('setorFilter');

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
});

function loadContent(callback) {
    console.log("Loading dynamic content...");
    // Simulate dynamic loading process. Replace with actual AJAX/fetch for HTML content.
    setTimeout(() => {
        const contentContainer = document.getElementById('contentContainer');
        if (contentContainer) {
            // Make sure you are adding the correct HTML structure here
            contentContainer.innerHTML = '<select id="setorFilter"></select>'; // Example content loading
            console.log("Dynamic content loaded:", contentContainer.innerHTML);
            callback();
        } else {
            console.error('Container for dynamic content not found.');
        }
    }, 1000);
}

function loadSectors() {
    console.log("Attempting to load sectors");
    const selectElement = document.getElementById('setorFilter');
    console.log('selectElement:', selectElement);

    if (!selectElement) {
        console.error('Select element not found.');
        return;
    }

    fetch('http://localhost:8080/api/setor')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            selectElement.innerHTML = '';

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

// Example call to simulate loading content dynamically
loadContent(() => {
    console.log("Running callback after loading content");
    loadSectors();
});
// Call this function to simulate loading content dynamically
loadContent(() => {
    console.log("Running callback after loading content");
    loadSectors();
});

// Ensure that this is called once your content is successfully loaded and the element is present
loadContent(() => {
    // Wait for the DOM update, or directly call after insertion if your method supports it
    const interval = setInterval(() => {
        if (document.getElementById('setorFilter')) {
            clearInterval(interval);
            loadSectors(); // now the element should exist
        }
    }, 3000); // or adjust timing based on your specific load strategy
});