async function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const form = document.getElementById('form-cadastro');
    const formData = new FormData(form);

    const data = {
        nome: formData.get('nome'),
        telefone: formData.get('telefone'),
        cpf: formData.get('cpf'),
        crmCoren: formData.get('crmCoren') || null,
        dataNascimento: formData.get('dataNascimento'),

        logradouro: formData.get('logradouro'),
        numeroCasa: formData.get('numeroCasa'),
        cep: formData.get('cep'),
        complemento: formData.get('complemento'),
        bairroUF: formData.get('bairroUF'),
        bairroMunicipio: formData.get('bairroMunicipio'),
        bairroNome: formData.get('bairroNome'),

        setor: formData.get('setor'),
        contrato: formData.get('contrato'),
        cargo: formData.get('cargo'),
        nivelAcesso: formData.get('nivelAcesso'),
        formacao: formData.get('formacao'),

        especializacao: Array.from(form.querySelectorAll('select[name="especializacao[]"] option:checked')).map(opt => opt.value),

        inicio: formData.get('inicio'),
        termino: formData.get('termino'),
        empresa: formData.get('empresa'),
        status: formData.get('status'),
        cargaHoraria: formData.get('cargaHoraria'),
        salario: formData.get('salario'),
        jornada: formData.get('jornada')
    };

    try {
        const response = await fetch('/submit-form/profissionais', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Profissional cadastrado com sucesso!');
            form.reset();
        } else {
            const errorText = await response.text();
            console.error('Erro na API:', errorText);
            alert('Erro ao cadastrar profissional. Verifique os dados.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro inesperado. Tente novamente.');
    }
}

function populateBairroList() {
    const select = document.getElementById('bairroNome'); // Get the select element
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="" disabled selected>Selecione...</option>';

    // Fetch the data from the API
    fetch('http://localhost:8080/api/bairro')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch bairro list');
            }
            return response.json(); // Convert response to JSON
        })
        .then(bairrosData => {
            // Populate dropdown using fetched data
            bairrosData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.NOME; // Displayed name
                option.setAttribute('data-id', item.ID); // Store ID (hidden)
                option.textContent = item.NOME;
                select.appendChild(option);
            });

            console.log("Bairro list loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading bairro list:", error);
        });

    // Store the selected ID for form submission
    select.addEventListener('change', function () {
        const selectedOption = select.options[select.selectedIndex]; // Get selected option
        const selectedId = selectedOption.getAttribute('data-id'); // Retrieve hidden ID

        console.log("Selected Bairro ID:", selectedId); // Debug output

        // Store the ID in the select element for submission later
        select.setAttribute("data-selected-id", selectedId);
    });
}

function populateContratoList() {
    const select = document.getElementById('contrato'); // Get the select element
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="" disabled selected>Selecione...</option>';

    // Fetch the data from the API
    fetch('http://localhost:8080/api/contrato')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch contrato list');
            }
            return response.json(); // Convert response to JSON
        })
        .then(contratosData => {
            // Populate dropdown using fetched data
            contratosData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.NOME; // Displayed name
                option.setAttribute('data-id', item.ID); // Store ID (hidden)
                option.textContent = item.NOME;
                select.appendChild(option);
            });

            console.log("Contrato list loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading contrato list:", error);
        });

    // Store the selected ID for form submission
    select.addEventListener('change', function () {
        const selectedOption = select.options[select.selectedIndex]; // Get selected option
        const selectedId = selectedOption.getAttribute('data-id'); // Retrieve hidden ID

        console.log("Selected Contrato ID:", selectedId); // Debug output

        // Store the ID in the select element for submission later
        select.setAttribute("data-selected-id", selectedId);
    });
}

function populateCargoList() {
    const select = document.getElementById('cargo'); // Get the select element
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="" disabled selected>Selecione...</option>';

    // Fetch the data from the API
    fetch('http://localhost:8080/api/cargo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch cargo list');
            }
            return response.json(); // Convert response to JSON
        })
        .then(cargoData => {
            // Populate dropdown using fetched data
            cargoData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.DESCRICAO; // Displayed name
                option.setAttribute('data-id', item.ID); // Store ID (hidden)
                option.textContent = item.DESCRICAO;
                select.appendChild(option);
            });

            console.log("Cargo list loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading cargo list:", error);
        });

    // Store the selected ID for form submission
    select.addEventListener('change', function () {
        const selectedOption = select.options[select.selectedIndex]; // Get selected option
        const selectedId = selectedOption.getAttribute('data-id'); // Retrieve hidden ID

        console.log("Selected cargo ID:", selectedId); // Debug output

        // Store the ID in the select element for submission later
        select.setAttribute("data-selected-id", selectedId);
    });
}


function populateSetorList() {
    const select = document.getElementById('setor'); // Get the select element
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="" disabled selected>Selecione...</option>';

    // Fetch the data from the API
    fetch('http://localhost:8080/api/setor')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch setor list');
            }
            return response.json(); // Convert response to JSON
        })
        .then(setorData => {
            // Populate dropdown using fetched data
            setorData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.NOME; // Displayed name
                option.setAttribute('data-id', item.ID); // Store ID (hidden)
                option.textContent = item.NOME;
                select.appendChild(option);
            });

            console.log("Setor list loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading setor list:", error);
        });

    // Store the selected ID for form submission
    select.addEventListener('change', function () {
        const selectedOption = select.options[select.selectedIndex]; // Get selected option
        const selectedId = selectedOption.getAttribute('data-id'); // Retrieve hidden ID

        console.log("Selected setor ID:", selectedId); // Debug output

        // Store the ID in the select element for submission later
        select.setAttribute("data-selected-id", selectedId);
    });
}

///////

function populateJornadaList() {
    const select = document.getElementById('jornada'); // Get the select element
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="" disabled selected>Selecione...</option>';

    // Fetch the data from the API
    fetch('http://localhost:8080/api/jornada')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch jornada list');
            }
            return response.json(); // Convert response to JSON
        })
        .then(jornadaData => {
            // Populate dropdown using fetched data
            jornadaData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.NOME; // Displayed name
                option.setAttribute('data-id', item.ID); // Store ID (hidden)
                option.textContent = item.NOME;
                select.appendChild(option);
            });

            console.log("Jornada list loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading jornada list:", error);
        });

    // Store the selected ID for form submission
    select.addEventListener('change', function () {
        const selectedOption = select.options[select.selectedIndex]; // Get selected option
        const selectedId = selectedOption.getAttribute('data-id'); // Retrieve hidden ID

        console.log("Selected jornada ID:", selectedId); // Debug output

        // Store the ID in the select element for submission later
        select.setAttribute("data-selected-id", selectedId);
    });
}

function populateEspecializacaoList() {
    const select = document.getElementById('especializacao'); // Get the select element
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="" disabled selected>Selecione...</option>';

    // Fetch the data from the API
    fetch('http://localhost:8080/api/especializacao')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch especializacao list');
            }
            return response.json(); // Convert response to JSON
        })
        .then(especializacaoData => {
            // Populate dropdown using fetched data
            especializacaoData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.NOME; // Displayed name
                option.setAttribute('data-id', item.ID); // Store ID (hidden)
                option.textContent = item.NOME;
                select.appendChild(option);
            });

            console.log("Especializacao list loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading especializacao list:", error);
        });

    // Store the selected ID for form submission
    select.addEventListener('change', function () {
        const selectedOption = select.options[select.selectedIndex]; // Get selected option
        const selectedId = selectedOption.getAttribute('data-id'); // Retrieve hidden ID

        console.log("Selected especializacao ID:", selectedId); // Debug output

        // Store the ID in the select element for submission later
        select.setAttribute("data-selected-id", selectedId);
    });
}

function populateNivelDeAcessoList() {
    const select = document.getElementById('nivelAcesso'); // Get the select element
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="" disabled selected>Selecione...</option>';

    // Fetch the data from the API
    fetch('http://localhost:8080/api/niveldeacesso')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch niveldeacesso list');
            }
            return response.json(); // Convert response to JSON
        })
        .then(niveldeacessoData => {
            // Populate dropdown using fetched data
            niveldeacessoData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.DESCRICAO; // Displayed name
                option.setAttribute('data-id', item.ID); // Store ID (hidden)
                option.textContent = item.DESCRICAO;
                select.appendChild(option);
            });

            console.log("Nivel de acesso list loaded successfully.");
        })
        .catch(error => {
            console.error("Error loading nivel de acesso list:", error);
        });

    // Store the selected ID for form submission
    select.addEventListener('change', function () {
        const selectedOption = select.options[select.selectedIndex]; // Get selected option
        const selectedId = selectedOption.getAttribute('data-id'); // Retrieve hidden ID

        console.log("Selected nivel de acesso ID:", selectedId); // Debug output

        // Store the ID in the select element for submission later
        select.setAttribute("data-selected-id", selectedId);
    });
}


// Call function on page load
document.addEventListener('DOMContentLoaded', populateBairroList);
document.addEventListener('DOMContentLoaded', populateSetorList);
document.addEventListener('DOMContentLoaded', populateCargoList);
document.addEventListener('DOMContentLoaded', populateContratoList);
document.addEventListener('DOMContentLoaded', populateNivelDeAcessoList);
document.addEventListener('DOMContentLoaded', populateJornadaList);
document.addEventListener('DOMContentLoaded', populateEspecializacaoList);

