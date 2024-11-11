function esconderAvancado() {
  var calculadoraNormal = document.getElementById("hiddenCalculadora");
  var calculadoraAvancada = document.getElementById("CalculadoraAvancada");
  var checkbox = document.getElementById("btnAvancado");
  var btnCalculadoraAvancada = document.getElementById(
    "btnCalculadoraAvancada"
  );
  var btnCalculadora = document.getElementById("btnCalculadora");

  if (checkbox.checked) {
    calculadoraNormal.style.display = "none";
    calculadoraAvancada.style.display = "block";
    btnCalculadoraAvancada.style.display = "block";
    btnCalculadora.style.display = "none";
  } else {
    calculadoraNormal.style.display = "block";
    calculadoraAvancada.style.display = "none";
    btnCalculadoraAvancada.style.display = "none";
    btnCalculadora.style.display = "block";
  }
}

// Validando campos

function validarFormularioCompleto() {

  // Função de auxilio
  function exibirAlerta(alertaClass, mensagem) {
    const alerta = document.querySelector(alertaClass);
    alerta.textContent = mensagem;
    alerta.style.display = "block"; 
  }

  // Função para validar campos de texto
  function validarCampoTexto(idInput, alertaClass, mensagemErro) {
    const input = document.getElementById(idInput);
    if (!input.value.trim()) {
      exibirAlerta(alertaClass, mensagemErro);
      return false;
    }
    return true;
  }

  // Função para validar campos de seleção
  function validarSelecao(idSelecionado, valorInvalido, alertaClass, mensagemErro) {
    const select = document.getElementById(idSelecionado);
    if (select.value === valorInvalido) {
      exibirAlerta(alertaClass, mensagemErro);
      return false;
    }
    return true;
  }

  // Função para validar campos numéricos
  function validarCampoNumero(idInput, alertaClass, mensagemErro, min = null, max = null) {
    const input = document.getElementById(idInput);
    const valor = input.value.trim();

    if (!valor) {
      exibirAlerta(alertaClass, mensagemErro);
      return false;
    }

    const numero = parseFloat(valor);
    if (isNaN(numero) || (min !== null && numero < min) || (max !== null && numero > max)) {
      exibirAlerta(alertaClass, mensagemErro);
      return false;
    }

    return true;
  }

  // Validações específicas de cada campo
  const culturaValida = validarSelecao(
    "kc", 
    "Selecione um tipo de cultura", 
    ".alerta__cultura", 
    "Insira um tipo de cultura válido."
  );

  const estadoValido = validarSelecao(
    "tempo", 
    "Selecione o Estado da cultura", 
    ".alerta__estagio", 
    "Insira um estágio de cultura válido."
  );

  const sistemaValido = validarSelecao(
    "sistema",
    "Selecione um Sistema de Irrigação.",
    ".alerta__sistema",
    "Insira um sistema de irrigação válido."
  );

  const frequenciaValida = validarCampoNumero(
    "xVezes",
    ".alerta__frequencia",
    "Informe um número entre 0 e 10.",
    0,
    10
  );

  const custoValido = validarCampoNumero(
    "precoAgua",
    ".alerta__custo",
    "Informe um valor entre 1 e 60.",
    1,
    60
  );

  const vazaoValido = validarCampoNumero(
    "vazaoSistema",
    ".alerta__vazao",
    "Informe um valor entre 1 e 400.",
    1,
    400
  );

  const areaValida = validarCampoNumero(
    "areaPlantio",
    ".alerta__area",
    "Informe uma área entre 1 e 200.",
    1,
    200
  );

  const cidadeValida = validarCampoTexto(
    "cidadeInput", 
    ".alerta__localidade", 
    "Insira o nome de uma cidade válida."
  );

  return culturaValida && estadoValido && sistemaValido && frequenciaValida && custoValido && areaValida && cidadeValida;
}

document.querySelectorAll("input, select").forEach((campo) => {
  campo.addEventListener("input", () => {
    const alerta = campo.nextElementSibling;
    if (alerta && alerta.classList.contains("alerta")) {
      alerta.style.display = "none";
    }
  });
});