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



function loadData() {
    console.log("Script loaded and function triggered!");
    fetch('http://localhost:8080/api/profissionais')
        .then(response => response.json())
        .then(data => {
            renderTable(data); // Render the table with all data
        })
        .catch(error => console.error('Error fetching data:', error));
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

