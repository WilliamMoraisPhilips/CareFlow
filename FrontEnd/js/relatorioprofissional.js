// relatorioprofissional.js

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    alert('ID do relatório não informado na URL.');
    return;
  }

  fetch(`http://localhost:8080/api/relatorio/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(data => populateForm(data))
    .catch(err => console.error('Erro ao buscar relatório:', err));
});

function populateForm(data) {
  // Mapa JS: keys = id do input no HTML, values = propriedade do JSON
  const mapping = {
    nome:                 'nome',
    cpf:                  'cpf',
    crm:                  'crm',                 // COREN
    telefone:             'telefone',
    dataNascimento:       'dataNascimento',
    setor:                'setor',
    cargo:                'cargo',
    nivelAcesso:          'nivelAcesso',
    formacao:             'formacao',
    logradouro:           'logradouro',
    complemento:          'complemento',
    numeroCasa:           'numeroCasa',
    numeroCep:            'numeroCep',
    bairro:               'bairro',
    municipio:            'municipio',
    siglaUf:              'siglaUf',
    empresaContratante:   'empresaContratante',
    tipoJornada:          'tipoJornada',
    tipoContrato:         'tipoContrato',
    dataAdmissao:         'dataAdmissao',
    inicio:               'inicio',
    termino:              'termino',
    cargaHorariaSemanal:  'cargaHorariaSemanal',
    valorMensal:          'valorMensal'
  };

  Object.entries(mapping).forEach(([inputId, prop]) => {
    const el = document.getElementById(inputId);
    if (!el) return;
    const val = data[prop];
    if (!val) {
      el.value = '';
      return;
    }
    if (el.type === 'date') {
      // Formata Date-string ou timestamp para YYYY-MM-DD
      el.value = new Date(val).toISOString().slice(0, 10);
    } else {
      el.value = val;
    }
  });

  // especiais: idade e especialização
  if (data.dataNascimento) {
    const nas = new Date(data.dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nas.getFullYear();
    const m = hoje.getMonth() - nas.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nas.getDate())) idade--;
    const idadeEl = document.getElementById('idade');
    if (idadeEl) idadeEl.value = idade;
  }

  // múltipla especialização
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

}

function salvarEdicao() {
    const confirmacao = confirm("Você deseja salvar as alterações?");
    if (confirmacao == true) {
        let inputs = document.querySelectorAll("input");
        inputs.forEach(input => input.disabled = true);
        document.getElementById("salvarButton").style.display = "none";
        document.getElementById("editTools").style.display = "none";
        alert("Dados atualizados com sucesso");
    } else {
        alert("Continue suas edições dos dados");
    }
}

function adicionarEspecializacao() {
    const nova = document.getElementById("novaEspecializacao").value.trim();
    if (nova !== "") {
        const select = document.getElementById("especializacao");
        const novaOpcao = document.createElement("option");
        novaOpcao.value = nova;
        novaOpcao.text = nova;
        select.appendChild(novaOpcao);
        document.getElementById("novaEspecializacao").value = "";
    } else {
        alert("Digite uma especialização.");
    }
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
