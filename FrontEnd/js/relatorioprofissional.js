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
  // Especialização
  const selectEspec = document.getElementById('especializacao');
  if (selectEspec && Array.isArray(data.especializacao)) {
    selectEspec.innerHTML = ''; // Clear old options

    data.especializacao.forEach(espec => {
      const option = document.createElement('option');
      option.value = espec.id; // Use numeric ID as value
      option.setAttribute("data-id", espec.id); // Assign correct data-id
      option.textContent = espec.nome; // Display readable name
      option.selected = true; // Mark pre-selected

      console.log(`Adding preselected option: ${option.textContent} - data-id: ${option.getAttribute('data-id')}`); // Debug log

      selectEspec.appendChild(option);
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

  // Build the JSON object using both text/number from inputs and data-id from selects.
  const jsonData = {};

  // Basic fields from plain input fields.
  const urlParams = new URLSearchParams(window.location.search);
  jsonData.id = Number(urlParams.get("id")); // Extracts ?id=70 from the URL

  jsonData.nome = document.getElementById("nome").value;
  jsonData.cpf = document.getElementById("cpf").value;
  jsonData.crm = document.getElementById("crm").value || null;
  jsonData.dataNascimento = document.getElementById("dataNascimento").value; // YYYY-MM-DD
  jsonData.telefone = document.getElementById("telefone").value;



  // Normalized select fields where we read the data-id attribute of the selected option.
  // For "setor"
  const setorSel = document.getElementById("setor");
  if (setorSel && setorSel.selectedIndex > 0) {
    const selectedSetor = setorSel.options[setorSel.selectedIndex];
    jsonData.idSetor = Number(selectedSetor.getAttribute("data-id"));
  }


  // For "nivelAcesso"
  const nivelAcessoSel = document.getElementById("nivelAcesso");
  if (nivelAcessoSel && nivelAcessoSel.selectedIndex > 0) {
    const selectedNivel = nivelAcessoSel.options[nivelAcessoSel.selectedIndex];
    jsonData.idNivelAcesso = Number(selectedNivel.getAttribute("data-id"));
  }
  const cargoSel = document.getElementById("cargo");
  if (cargoSel && cargoSel.selectedIndex > 0) {
    const selectedCargo = cargoSel.options[cargoSel.selectedIndex];
    jsonData.idCargo = Number(selectedCargo.getAttribute("data-id"));
  }

  // Endereco block: text values from inputs plus normalized select for "bairro"
  const bairroSel = document.getElementById("bairro");
  let idBairro = null;

  if (bairroSel && bairroSel.selectedIndex > 0) {
    const selectedBairro = bairroSel.options[bairroSel.selectedIndex];
    idBairro = Number(selectedBairro.getAttribute("data-id"));
  }

  // Define endereco while preserving idBairro
  jsonData.endereco = {
    logradouro: document.getElementById("logradouro").value,
    numeroCasa: document.getElementById("numeroCasa").value,
    complemento: document.getElementById("complemento").value,
    idBairro: idBairro, // Ensure idBairro persists correctly
    cep: document.getElementById("numeroCep").value
  };


  // Contrato block
  jsonData.contrato = {
    empresaContratante: document.getElementById("empresaContratante").value,
    inicio: document.getElementById("inicio").value,
    termino: document.getElementById("termino").value || null,
    cargaHorariaSemanal: Number(document.getElementById("cargaHorariaSemanal").value),
    valorMensal: Number(document.getElementById("valorMensal").value),
    idTipoContrato: null,  // Placeholder for idTipoContrato
    idTipoJornada: null,    // Placeholder for idTipoJornada
    status: 1 // Fixed status value
  };

  const tipoContratoSel = document.getElementById("tipoContrato");
  if (tipoContratoSel && tipoContratoSel.selectedIndex > 0) {
    const selectedTipoContrato = tipoContratoSel.options[tipoContratoSel.selectedIndex];
    jsonData.contrato.idTipoContrato = Number(selectedTipoContrato.getAttribute("data-id"));
  }

  const tipoJornadaSel = document.getElementById("tipoJornada");
  if (tipoJornadaSel && tipoJornadaSel.selectedIndex > 0) {
    const selectedTipoJornada = tipoJornadaSel.options[tipoJornadaSel.selectedIndex];
    jsonData.contrato.idTipoJornada = Number(selectedTipoJornada.getAttribute("data-id"));
  }


  // For "formacao"
  const formacaoSel = document.getElementById("formacao");
  if (formacaoSel && formacaoSel.selectedIndex > 0) {
    const selectedFormacao = formacaoSel.options[formacaoSel.selectedIndex];
    jsonData.idFormacao = Number(selectedFormacao.getAttribute("data-id"));
  }





  // Especializacao: assuming this is a multi-select list.
  // We push the data-id of each selected option into an array.
  const especSelect = document.getElementById("especializacao");
  const especArray = [];
  if (especSelect) {
    for (let option of especSelect.options) {
      if (option.selected && option.getAttribute("data-id")) {
        especArray.push(option.getAttribute("data-id"));
      }
    }
  }
  jsonData.especializacao = especArray;

  // (Optional) For fields "municipio" and "siglaUf", if they are also selects with a data-id
  // Feel free to add them here if needed. In your sample JSON, they appear at the top level,
  // but you can include them similarly.
  const municipioSel = document.getElementById("municipio");
  if (municipioSel && municipioSel.selectedIndex > 0) {
    const selectedMunicipio = municipioSel.options[municipioSel.selectedIndex];
    jsonData.municipio = selectedMunicipio.value; // or getAttribute if you stored an id
  }
  const ufSel = document.getElementById("siglaUf");
  if (ufSel && ufSel.selectedIndex > 0) {
    const selectedUf = ufSel.options[ufSel.selectedIndex];
    jsonData.siglaUf = selectedUf.value;
  }

  // Optionally disable the inputs (per your original code) after saving
  let inputs = document.querySelectorAll("input");
  inputs.forEach(input => input.disabled = true);
  ['setor', 'cargo', 'nivelAcesso', 'formacao', 'tipoJornada', 'tipoContrato', 'bairro', 'municipio', 'siglaUf'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  });
  // document.getElementById("especializacao").disabled = true;
  document.getElementById("salvarButton").style.display = "none";
  document.getElementById("editTools").style.display = "none";

  // Log the JSON to verify its structure
  console.log(JSON.stringify(jsonData, null, 2));

  console.dir(jsonData);



  // Send the JSON via a PUT request. Adjust the URL as needed.
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
  const select = document.getElementById('novaEspecializacao'); // Get the select element
  if (!select) return;

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
        option.value = item.ID; // Ensure selection works
        option.setAttribute('data-id', item.ID); // Assign data-id correctly
        option.textContent = item.NOME;

        console.log(`Adding option: ${option.textContent} - data-id: ${option.getAttribute('data-id')}`); // Debug log

        select.appendChild(option);
      });


      console.log("Especializacao list loaded successfully.");
      console.log("Especializacao Options:", Array.from(select.options).map(opt => opt.getAttribute("data-id")));

    })
    .catch(error => {
      console.error("Error loading especializacao list:", error);
    });

  // Store the selected ID for form submission
  select.addEventListener('change', function () {

    const selectedIds = Array.from(select.selectedOptions) // Get selected options
      .map(option => option.getAttribute('data-id')) // Extract data-id attributes
      .filter(id => id !== null); // Remove null values

    console.log("Selected especializacao IDs:", selectedIds); // Debug output

    jsonData.especializacao = selectedIds; // Store all selected IDs
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
  console.log("Selected options:", Array.from(document.getElementById("especializacao").selectedOptions).map(opt => opt.getAttribute("data-id")));

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