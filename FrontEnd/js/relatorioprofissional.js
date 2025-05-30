// relatorioprofissional.js

// Utility to load options into a select
async function populateSelect(selectId, endpoint) {
  const select = document.getElementById(selectId);
  if (!select) return;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(res.statusText);
    const list = await res.json();
    select.innerHTML = '';
    // Optional: add placeholder
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione...';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    list.forEach(item => {
      // Ajuste conforme propriedades do retorno (ex: item.DESCRICAO ou item.nome)
      const value = item.DESCRICAO || item.descricao || Object.values(item)[1];
      const opt = document.createElement('option');
      opt.setAttribute('data-id', item.ID); // Store ID (hidden)
      opt.value = value;
      opt.textContent = value;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error(`Erro ao carregar ${selectId}:`, err);
  }
}

// Carrega todos os selects chamando as APIs corres­pondentes
async function loadAllSelects() {
  await Promise.all([
    populateSelect('setor', 'http://localhost:8080/api/profissional/setores'),
    populateSelect('cargo', 'http://localhost:8080/api/profissional/cargos'),
    populateSelect('nivelAcesso', 'http://localhost:8080/api/profissional/niveis-de-acesso'),
    populateSelect('formacao', 'http://localhost:8080/api/profissional/formacao'),
    populateSelect('tipoJornada', 'http://localhost:8080/api/profissional/jornadas'),
    populateSelect('tipoContrato', 'http://localhost:8080/api/profissional/contratos'),
    populateSelect('bairro', 'http://localhost:8080/api/profissional/bairros'),
    // Se existir API de municípios:
    populateSelect('municipio', 'http://localhost:8080/api/profissional/municipios'),
    populateSelect('siglaUf', 'http://localhost:8080/api/profissional/ufs')
  ]);
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    alert('ID do relatório não informado na URL.');
    return;
  }

  loadAllSelects()
    .then(() => fetch(`http://localhost:8080/api/relatorio/${id}`))
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(data => populateForm(data))
    .catch(err => console.error('Erro ao buscar dados:', err));
});

function populateForm(data) {
  const mapping = {
    nome: 'nome', cpf: 'cpf', crm: 'crm', telefone: 'telefone',
    dataNascimento: 'dataNascimento', cargaHorariaSemanal: 'cargaHorariaSemanal',
    valorMensal: 'valorMensal', empresaContratante: 'empresaContratante',
    dataAdmissao: 'dataAdmissao', inicio: 'inicio', termino: 'termino',
    logradouro: 'logradouro', complemento: 'complemento', numeroCasa: 'numeroCasa',
    numeroCep: 'numeroCep'
  };

  Object.entries(mapping).forEach(([inputId, prop]) => {
    const el = document.getElementById(inputId);
    if (!el) return;
    const val = data[prop] || '';
    if (el.type === 'date' && val) el.value = new Date(val).toISOString().slice(0, 10);
    else el.value = val;
  });

  // Selecionar valores nos selects carregados
  ['setor', 'cargo', 'nivelAcesso', 'formacao', 'tipoJornada', 'tipoContrato', 'bairro', 'municipio', 'siglaUf'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel && data[id]) sel.value = data[id];
  });

  // Idade
  if (data.dataNascimento) {
    const nas = new Date(data.dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nas.getFullYear();
    const m = hoje.getMonth() - nas.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nas.getDate())) idade--;
    document.getElementById('idade').value = idade;
  }

  // Especialização
  const selectEspec = document.getElementById('especializacao');
  if (selectEspec && Array.isArray(data.especializacao)) {
    selectEspec.innerHTML = '';
    data.especializacao.forEach(espec => {
      const opt = document.createElement('option');
      opt.value = espec;
      opt.textContent = espec;
      opt.selected = true;
      selectEspec.appendChild(opt);
    });
  }
}


function habilitaEdicao() {
  let inputs = document.querySelectorAll("input");
  inputs.forEach(input => input.disabled = false);
  document.getElementById("salvarButton").style.display = "block";
  document.getElementById("especializacao").disabled = false;
  document.getElementById("editTools").style.display = "block";

  ['setor', 'cargo', 'nivelAcesso', 'formacao', 'tipoJornada', 'tipoContrato', 'bairro', 'municipio', 'siglaUf']
    .forEach(id => document.getElementById(id).disabled = false);

}

function salvarEdicao() {
  const confirmacao = confirm("Você deseja salvar as alterações?");
  if (!confirmacao) {
    alert("Continue suas edições dos dados");
    return;
  }

  // Build JSON object
  const jsonData = {};

  // Extract query parameter ID
  const urlParams = new URLSearchParams(window.location.search);
  jsonData.id = Number(urlParams.get("id"));

  // Basic fields
  jsonData.nome = document.getElementById("nome").value;
  jsonData.cpf = document.getElementById("cpf").value;
  jsonData.crm = document.getElementById("crm").value || null;
  jsonData.dataNascimento = document.getElementById("dataNascimento").value;
  jsonData.telefone = document.getElementById("telefone").value;

  // Helper function for single selects
  const getSelectedDataId = (id) => {
    const select = document.getElementById(id);
    if (select && select.selectedIndex > 0) {
      return Number(select.options[select.selectedIndex].getAttribute("data-id"));
    }
    return null;
  };

  // Assign select values
  jsonData.idSetor = getSelectedDataId("setor");
  jsonData.idNivelAcesso = getSelectedDataId("nivelAcesso");
  jsonData.idCargo = getSelectedDataId("cargo");
  jsonData.idFormacao = getSelectedDataId("formacao");
  jsonData.contrato = {
    empresaContratante: document.getElementById("empresaContratante").value,
    inicio: document.getElementById("inicio").value,
    termino: document.getElementById("termino").value || null,
    cargaHorariaSemanal: Number(document.getElementById("cargaHorariaSemanal").value),
    valorMensal: Number(document.getElementById("valorMensal").value),
    idTipoContrato: getSelectedDataId("tipoContrato"),
    idTipoJornada: getSelectedDataId("tipoJornada"),
    status: 1
  };

  jsonData.endereco = {
    logradouro: document.getElementById("logradouro").value,
    numeroCasa: document.getElementById("numeroCasa").value,
    complemento: document.getElementById("complemento").value,
    idBairro: getSelectedDataId("bairro"),
    cep: document.getElementById("numeroCep").value
  };

  // **Updated especializacao selection**
  const getMultiSelectArray = (name) => {
    const select = document.getElementById(name);
    return Array.from(select.selectedOptions)
      .map(option => option.getAttribute("data-id"))
      .filter(id => id !== null && id.trim() !== "");
  };

  jsonData.especializacao = getMultiSelectArray("especializacao");

  console.log("Final JSON Data:", JSON.stringify(jsonData, null, 2));
  console.dir(jsonData);

  // Disable inputs after saving
  document.querySelectorAll("input").forEach(input => input.disabled = true);
  ['setor', 'cargo', 'nivelAcesso', 'formacao', 'tipoJornada', 'tipoContrato', 'bairro', 'municipio', 'siglaUf', 'especializacao'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  });

  document.getElementById("salvarButton").style.display = "none";
  document.getElementById("editTools").style.display = "none";

  // Send data via PUT request
  fetch(`http://localhost:8080/api/profissionais/${jsonData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jsonData)
  })
    .then(response => {
      if (response.ok) {
        alert("Dados atualizados com sucesso");
      } else {
        alert("Erro ao atualizar dados");
      }
    })
    .catch(error => {
      console.error("Erro na requisição:", error);
      alert("Erro na requisição");
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
        option.value = item.ID; // Displayed name
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

function adicionarEspecializacao() {
  const selectElement = document.getElementById("novaEspecializacao");
  const selectedOption = selectElement.options[selectElement.selectedIndex];

  if (selectedOption && selectedOption.value.trim() !== "") {
    const selectEspecializacao = document.getElementById("especializacao");

    // Create a new option
    const novaOpcao = document.createElement("option");
    novaOpcao.value = selectedOption.value;
    novaOpcao.text = selectedOption.text;
    novaOpcao.setAttribute("data-id", selectedOption.value); // Ensure data-id is set
    novaOpcao.selected = true; // Automatically select the new option

    selectEspecializacao.appendChild(novaOpcao);

    selectElement.selectedIndex = 0;
  } else {
    alert("Selecione uma especialização.");
  }

  atualizarEspecializacao(); // Call function to update JSON after adding new items
}

function atualizarEspecializacao() {
  const selectEspecializacao = document.getElementById("especializacao");
  const selectedIds = Array.from(selectEspecializacao.selectedOptions)
    .map(option => option.getAttribute("data-id"))
    .filter(id => id !== null && id !== "");

  console.log("Updated especializacao IDs:", selectedIds); // Debugging output
  jsonData.especializacao = selectedIds; // Store updated values in jsonData
}

function excluirEspecializacao() {
  const select = document.getElementById("especializacao");
  const optionsArray = Array.from(select.options);
  optionsArray.forEach(option => {
    if (option.selected && option.value !== "") {
      select.remove(option.index);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  populateEspecializacaoList();
  showTab('address');

  const dadosProfissionalButton = document.getElementById("dadosProfissional");

  setTimeout(function () {
    if (dadosProfissionalButton) {
      dadosProfissionalButton.classList.add("active"); // Add active class
    }
  }, 3000);
});