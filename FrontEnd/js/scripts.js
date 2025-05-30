







function setupChart() {
    console.log("setup function called");

    // Identify the visible container
    const barraContainer = document.getElementById("graficoBarra");
    const linhaContainer = document.getElementById("graficoLinha");

    let selectedCanvas;
    if (barraContainer && barraContainer.style.display !== "none") {
        selectedCanvas = document.getElementById("chartPontoBarra");
    } else if (linhaContainer && linhaContainer.style.display !== "none") {
        selectedCanvas = document.getElementById("chartPontoLinha");
    } else {
        console.error("No active chart container found.");
        return;
    }

    if (!selectedCanvas) {
        console.error("No valid canvas found for chart initialization.");
        return;
    }

    const ctx = selectedCanvas.getContext('2d');

    // Clear previous chart instance if necessary
    if (selectedCanvas.chartInstance) {
        selectedCanvas.chartInstance.destroy();
    }

    // Initialize the correct chart
    selectedCanvas.chartInstance = new Chart(ctx, {
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

    console.log("Chart setup successfully in the active container!");
}



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
    console.log("init function called");

    const waitForElement = setInterval(() => {
        const divBarra = document.getElementById("graficoBarra");
        const divLinha = document.getElementById("graficoLinha");

        if (divBarra && divLinha) {
            clearInterval(waitForElement); // Stop checking once found

            // Show the correct chart container
            if (tipo === 'bar') {
                divBarra.style.display = 'block';
                divLinha.style.display = 'none';

                const canvasBar = document.getElementById("chartPontoBarra");
                if (!canvasBar) {
                    console.error("Canvas for bar chart not found!");
                    return;
                }

                const ctxBar = canvasBar.getContext('2d');

                // ✅ Destroy the previous chart instance before creating a new one
                if (window.chartBarra) {
                    window.chartBarra.destroy();
                }

                window.chartBarra = new Chart(ctxBar, {
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

            } else if (tipo === 'line') {
                divBarra.style.display = 'none';
                divLinha.style.display = 'block';

                const canvasLinha = document.getElementById("chartPontoLinha");
                if (!canvasLinha) {
                    console.error("Canvas for line chart not found!");
                    return;
                }

                const ctxLinha = canvasLinha.getContext('2d');

                // ✅ Destroy the previous chart instance before creating a new one
                if (window.chartLinha) {
                    window.chartLinha.destroy();
                }

                window.chartLinha = new Chart(ctxLinha, {
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

            console.log("Chart initialized successfully!");
        } else {
            console.warn("graficoBarra or graficoLinha not found. Waiting...");
        }
    }, 300); // Check every 300ms until element appears
}

if (pageUrl = undefined) {
    const pageUrl = "";
}
try {
    if (pageUrl.includes("registroponto.html")) {
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
    }
}
catch {

}
//Initialize with bar chart
try {
    if (pageUrl.includes("registroponto.html")) {
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
    }
}
catch {

}








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

function adicionarNovoRegistro() {
    const newWindow = window.open(
        "/FrontEnd/cadastroprofissionais.html",
        "CareFlow",
        "width=" + screen.width + ",height=" + screen.height + ",top=0,left=0,resizable=yes"
    );

    if (newWindow) {
        newWindow.moveTo(0, 0); // Positions the window at the top-left corner
        newWindow.resizeTo(screen.width, screen.height); // Expands to full-screen
    } else {
        alert("Popup blocking may be preventing the new window from opening.");
    }
}




function filtrar() {
    var filterBox = document.querySelector('.filter-box');;
    if (filterBox.classList.contains('hidden')) {
        filterBox.style.display = 'block';
        setTimeout(() => {
            filterBox.classList.remove('hidden');
            filterBox.style.opacity = '1';
            filterBox.style.visibility = 'visible';
        }, 10);
    } else {
        filterBox.style.opacity = '0';

        setTimeout(() => {
            filterBox.classList.add('hidden');
            filterBox.style.visibility = 'hidden';
            filterBox.style.display = 'none';
        }, 150);
    }
}
