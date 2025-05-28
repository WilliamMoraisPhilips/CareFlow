console.log('scripts loaded successfully');
let chartPizza;
let chartLinha;
console.log("ocupacao.js is being executed!");

console.log("window.mostrarGrafico:", window.mostrarGrafico);


function mostrarGrafico(tipo) {
    console.log("Init function called for:", tipo);

    const waitForElements = setInterval(() => {
        const divPizza = document.getElementById("graficoPizza");
        const divLinha = document.getElementById("graficoLinha");
        const canvasPizza = document.getElementById("chartLeitosPizza");
        const canvasLinha = document.getElementById("chartLeitosLinha");

        if (divPizza && divLinha && canvasPizza && canvasLinha) {
            clearInterval(waitForElements); // Stop checking once found

            // Ensure all graphs are hidden before showing the selected one
            divPizza.style.display = "none";
            divLinha.style.display = "none";

            // Destroy existing charts before switching
            if (window.chartPizza) {
                window.chartPizza.destroy();
                window.chartPizza = null;
            }
            if (window.chartLinha) {
                window.chartLinha.destroy();
                window.chartLinha = null;
            }

            // Select and initialize the correct chart
            if (tipo === "pizza") {
                divPizza.style.display = "block";
                const ctxPizza = canvasPizza.getContext("2d");

                window.chartPizza = new Chart(ctxPizza, {
                    type: "doughnut",
                    data: {
                        labels: ["Ocupados", "Livres"],
                        datasets: [{
                            data: [3, 2],
                            backgroundColor: ["#e74c3c", "#2ecc71"],
                            hoverOffset: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: "bottom" }
                        }
                    }
                });

            } else if (tipo === "linha") {
                divLinha.style.display = "block";
                const ctxLinha = canvasLinha.getContext("2d");

                window.chartLinha = new Chart(ctxLinha, {
                    type: "line",
                    data: {
                        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
                        datasets: [{
                            label: "Leitos Ocupados",
                            data: [2, 3, 3, 4, 3, 2, 3],
                            borderColor: "#3498db",
                            fill: false,
                            tension: 0.4
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
                        },
                        plugins: {
                            legend: { position: "bottom" }
                        }
                    }
                });
            }

            console.log("Chart initialized successfully for:", tipo);
        } else {
            console.warn("Chart elements not found. Waiting...");
        }
    }, 300); // Check every 300ms until elements appear
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