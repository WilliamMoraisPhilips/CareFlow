
console.log('scripts loaded successfully');
let chartPizza;
let chartLinha;

function mostrarGrafico(tipo) {
    const waitForElements = setInterval(() => {
        const divPizza = document.getElementById("graficoPizza");
        const divLinha = document.getElementById("graficoLinha");

        if (divPizza && divLinha) {
            clearInterval(waitForElements); // Stop waiting once elements exist

            divPizza.style.display = 'none';
            divLinha.style.display = 'none';

            // Destroy previous chart before switching
            if (chartPizza && tipo === 'linha') {
                chartPizza.destroy();
                chartPizza = null;
            }
            if (chartLinha && tipo === 'pizza') {
                chartLinha.destroy();
                chartLinha = null;
            }

            if (tipo === 'pizza') {
                divPizza.style.display = 'block';

                if (!chartPizza) {
                    const ctxPizza = document.getElementById('chartLeitosPizza').getContext('2d');
                    chartPizza = new Chart(ctxPizza, {
                        type: 'doughnut',
                        data: {
                            labels: ['Ocupados', 'Livres'],
                            datasets: [{ data: [3, 2], backgroundColor: ['#e74c3c', '#2ecc71'], hoverOffset: 10 }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: { legend: { position: 'bottom' } }
                        }
                    });
                } else {
                    chartPizza.update();
                }

            } else if (tipo === 'linha') {
                divLinha.style.display = 'block';

                if (!chartLinha) {
                    const ctxLinha = document.getElementById('chartLeitosLinha').getContext('2d');
                    chartLinha = new Chart(ctxLinha, {
                        type: 'line',
                        data: {
                            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                            datasets: [{ label: 'Leitos Ocupados', data: [2, 3, 3, 4, 3, 2, 3], borderColor: '#3498db', fill: false, tension: 0.4 }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                            plugins: { legend: { position: 'bottom' } }
                        }
                    });
                } else {
                    chartLinha.update();
                }
            }
        }
    }, 300);
}
function clearChartInstances() {
    if (chartPizza) {
        chartPizza.destroy();
        chartPizza = null;
    }
    if (chartBarra) {
        chartBarra.destroy();
        chartBarra = null;
    }
    if (chartLinha) {
        chartLinha.destroy();
        chartLinha = null;
    }
}


// Add window resize handler
window.addEventListener('resize', function () {
    if (chartPizza) chartPizza.resize();
    if (chartLinha) chartLinha.resize();
});




setTimeout(() => {
    const divPizza = document.getElementById("chartPizza");
    const divLinha = document.getElementById("chartLinha");

    if (divLinha) {  // ✅ Avoids the error if divLinha doesn't exist
        divLinha.style.display = 'none';
    } else {
        console.warn("graficoLinha not found in DOM.");
    }

    if (divPizza) {
        divBarra.style.display = 'block';
        mostrarGrafico('pizza');
        console.log("Solicitação feita!");
    } else {
        console.warn("graficoPizza not found in DOM.");
    }
}, 3000);








function initializeChart() {
    console.log("init function called");
    const waitForElement = setInterval(() => {
        const canvas = document.getElementById('graficoPacientes');

        if (canvas) {
            clearInterval(waitForElement); // Stop checking once found

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Atendidos', 'Não Atendidos', 'Em Espera'],
                    datasets: [{
                        label: 'Situação dos Pacientes',
                        data: [60, 25, 15],
                        backgroundColor: ['#4CAF50', '#F44336', '#808080'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, position: 'right' },
                        title: { display: true, text: 'Pacientes', align: 'center' }
                    }
                }
            });

            console.log("Chart initialized successfully!");
        } else {
            console.warn("graficoPacientes not found. Waiting...");
        }
    }, 300); // Check every 300ms until element appears
}







let chartBarra = null;



function mostrarGraficoPonto(tipo) {
    const divBarra = document.getElementById("graficoBarra");
    const divLinha = document.getElementById("graficoLinha");

    // Check if the elements exist before proceeding
    if (!divBarra || !divLinha) {
        console.warn('graficoBarra or graficoLinha not found in DOM yet.');
        return; // Exit the function if the elements are not in the DOM
    }

    // Destroy existing charts before switching
    if (tipo === 'bar' && chartLinha) {
        chartLinha.destroy();
        chartLinha = null;
    } else if (tipo === 'line' && chartBarra) {
        chartBarra.destroy();
        chartBarra = null;
    }

    // Show the correct chart
    if (tipo === 'bar') {
        divBarra.style.display = 'block';
        divLinha.style.display = 'none';

        if (!chartBarra) {
            const ctxBar = divBarra.querySelector('canvas').getContext('2d'); // Ensure the canvas is inside the div
            chartBarra = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['Maria', 'Carlos', 'Paulo'],
                    datasets: [{
                        label: 'Horas Trabalhadas',
                        data: [8, 8, 8],
                        backgroundColor: ['#2980b9', '#27ae60', '#f39c12']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                        }
                    }
                }
            });
        }
    } else if (tipo === 'line') {
        divBarra.style.display = 'none';
        divLinha.style.display = 'block';

        if (!chartLinha) {
            const ctxLinha = divLinha.querySelector('canvas').getContext('2d');
            chartLinha = new Chart(ctxLinha, {
                type: 'line',
                data: {
                    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
                    datasets: [
                        {
                            label: 'Maria',
                            data: [8, 8, 7, 8, 8],
                            borderColor: '#2980b9',
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: 'Carlos',
                            data: [8, 7, 8, 7, 8],
                            borderColor: '#27ae60',
                            fill: false,
                            tension: 0.4
                        },
                        {
                            label: 'Paulo',
                            data: [7, 8, 8, 7, 7],
                            borderColor: '#f39c12',
                            fill: false,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                        }
                    }
                }
            });
        }
    }
}
// Enhanced resize handler with debounce
let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        if (chartBarra) {
            chartBarra.resize();
        }
        if (chartLinha) {
            chartLinha.resize();
        }
    }, 200); // 200ms debounce time
});

//Initialize with bar chart

setTimeout(() => {
    const divBarra = document.getElementById("graficoBarra");
    const divLinha = document.getElementById("graficoLinha");

    if (divLinha) {  // ✅ Avoids the error if divLinha doesn't exist
        divLinha.style.display = 'none';
    } else {
        console.warn("graficoLinha not found in DOM.");
    }

    if (divBarra) {
        divBarra.style.display = 'block';
        mostrarGraficoPonto('bar');
        console.log("Solicitação feita!");
    } else {
        console.warn("graficoBarra not found in DOM.");
    }
}, 3000);








function showTab(tabId) {
    // Hide all content sections
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('visible');
        content.style.display = 'none'; // Hide
    });

    const tabContent = document.getElementById(tabId);
    tabContent.classList.add('visible');
    tabContent.style.display = 'block'; // Show

    // Highlight active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    event.target.classList.add('active-tab');


}

function abrirRelatorio() {
    window.open(
        "/FrontEnd/relatorioprofissional.html",
        "CareFlow",
        "width=800,height=600,resizable=yes"
    );
}

function adicionarNovoRegistro() {
    window.open(
        "/FrontEnd/cadastroprofissionais.html",
        "CareFlow",
        "width=800,height=600,resizable=yes"
    );
}