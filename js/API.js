let dadosDaPrevisaoGlobal = [];

function obterPrevisaoClima() {
  const apiKeyTemperaturaFutura = "XXXXX";
  const cidade = document.getElementById("cidadeInput").value;

  const urlTemperaturaFutura = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cidade}&key=${apiKeyTemperaturaFutura}&days=16&lang=pt`;

  //Função para buscar informações.
  fetch(urlTemperaturaFutura)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao obter dados da API");
      }
      return response.json();
    })
    .then((data) => {
      const dadosDaPrevisao = data.data;
      dadosDaPrevisaoGlobal = dadosDaPrevisao;

      // Pega a lat e long
      const latitude = data.lat;
      const longitude = data.lon;

      const mediaETc = calcularMediaETc(dadosDaPrevisaoGlobal);
      console.log(`Média do ETc: ${mediaETc.toFixed(2)} mm/dia`);

      let botoesHTML = "";
  
      const eficienciaSistema = obterEficiencia();
    
      const ETcMedio = calcularMediaETc(dadosDaPrevisaoGlobal);
  
      const irrigacaoNecessaria = ETcMedio / eficienciaSistema;
  
      const quantidadeDePlanta = obterQuantidadeDePlantaPorHa();
      const ha = document.getElementById("areaPlantio").value;
      const quantidadeDeP = quantidadeDePlanta * ha;
  
      const irrigacaoRealEmM3 = (irrigacaoNecessaria * quantidadeDeP) / 1000;
  
      const irrigacaoRealEmL = irrigacaoRealEmM3 * 1000;
  
      const precoAgua = document.getElementById("precoAgua").value;
      const gasto = precoAgua * irrigacaoRealEmM3;
  
      //const tempoGasto = 0;
  
      document.getElementById("informacoesGastos").innerHTML = `
      <th>${irrigacaoRealEmM3.toFixed(2)} m³</th>
      <th>${irrigacaoRealEmL.toFixed(2)} L</th>
      <th>R$ ${gasto.toFixed(2)}</th>
      `
      //<th>${tempoGasto} min</th>
  
  
      /*const raiz = obterTamanhoRaiz();
  
      //Defini como padrão temporario. (Utilizar futuramente API SmartSolos)
      const CAD = 0.1;
  
      const intervalo = (CAD * raiz) * 1000 / irrigacaoNecessaria;*/

      // Gera botões de previsão para cada dia
      dadosDaPrevisao.forEach((day, index) => {
        const data = new Date(day.datetime);
        const dataFormatada = data.toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const iconCode = day.weather.icon;
        const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

        botoesHTML += `
                <button class="btn__clima" onclick="mostrarDetalhes(${index}, '${cidade}')">
                    <p>${dataFormatada}</p>
                    <img class="icone__clima" src="${iconUrl}" alt="Ícone de Clima">
                    <hr>
                </button>
            `;
      });

      document.getElementById("barraDias").innerHTML = botoesHTML;
    })
    .catch((error) => {
      console.error(error);
      document.getElementById(
        "barraDias"
      ).innerHTML = `<p class="alerta__meteorologia">Erro ao obter dados meteorológicos</p>`;
      document.getElementById(
        "alertaLocalidade"
      ).innerHTML = `<p>Insira uma localidade válida</p>`;
    });
}

function mostrarDetalhes(index, cidadeAtual) {
  const diaSelecionado = dadosDaPrevisaoGlobal[index];

  if (diaSelecionado) {
    const data = new Date(diaSelecionado.datetime);
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const descricao = diaSelecionado.weather.description;
    const temperaturaMedia = diaSelecionado.temp;
    const tempMin = diaSelecionado.min_temp;
    const tempMax = diaSelecionado.max_temp;
    const precipitacao = diaSelecionado.precip || 0;
    const pressao = diaSelecionado.pres / 10;
    const velocidadeDoVento = diaSelecionado.wind_spd;
    const umidade = diaSelecionado.rh;
    const iconCode = diaSelecionado.weather.icon;
    const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;



    document.getElementById("dadosTempo").innerHTML = `
            <div class="localidade__data">
                <div class="localidade">
                    <img class="icon__localidade" src="./img/icone localização.png" alt="Icone de Localidade">
                    <p class="localidade__texto">${cidadeAtual}</p>
                </div>
                <p>${dataFormatada}</p>
            </div>

            <div class="temperatura">
                <div class="clima__atual">
                    <img src="${iconUrl}" alt="Ícone de Clima" class="icone-G">
                    <p class="clima__texto">${descricao}</p>
                </div>
                <div class="alinhar__temperatura__atual">
                    <div class="temperatura__atual">
                        <h2 class="temperatura__atual__texto">${temperaturaMedia}</h2>
                        <p>°C</p>
                    </div>
                </div>
                <div class="temperatura__maxmin">
                    <p>${tempMax}°</p>
                    <div class="barra__divisao"><hr></div>
                    <p>${tempMin}°</p>
                </div>
            </div>

            <div class="informacoes__detalhadas">
                <div class="item__detalhado">
                    <img src="./img/icone precipitação.png" alt="Ícone de Precipitação" class="icone-G">
                    <p>${precipitacao.toFixed(2)} mm</p>
                </div>
                <div class="item__detalhado">
                    <img src="./img/icone vento.png" alt="Ícone de Vento" class="icone-G">
                    <p>${velocidadeDoVento} m/s</p>
                </div>
                <div class="item__detalhado">
                    <img src="./img/umidade.png" alt="Ícone de Umidade" class="icone-G">
                    <p>${umidade}%</p>
                </div>
            </div>
        `;
  }
}

function calcularMediaETc(dadosDaPrevisao) {
  let somaETc = 0;
  let totalDiasValidos = 0;

  dadosDaPrevisao.forEach((dia, index) => {
    const temperaturaMedia = dia.temp;
    const pressao = dia.pres / 10; 
    const umidade = dia.rh;
    const velocidadeDoVento = dia.wind_spd;
    const descricao = dia.weather.description;

    if (
      typeof temperaturaMedia === 'number' &&
      !isNaN(temperaturaMedia) &&
      typeof pressao === 'number' &&
      !isNaN(pressao) &&
      typeof umidade === 'number' &&
      !isNaN(umidade) &&
      typeof velocidadeDoVento === 'number' &&
      !isNaN(velocidadeDoVento)
    ) {
      const ETo = calcularETo(temperaturaMedia, descricao, pressao, umidade, velocidadeDoVento);
   
      if (typeof ETo === 'number' && !isNaN(ETo)) {
        const Kc = obterKc();
        const ETc = ETo * Kc;
    
        if (typeof ETc === 'number' && !isNaN(ETc)) {
          somaETc += ETc;
          totalDiasValidos++;
        }
      }
    }
  });

  const mediaETc = totalDiasValidos > 0 ? somaETc / totalDiasValidos : 0;

  return mediaETc;
}




function calcularETo(T, descricao, pressaokPa, umidade, velocidadeDoVento) {
  let Rn;

  // Define o valor do saldo de radiação diária baseado na descrição do clima
  switch (descricao) {
    case "Nuvens quebradas":
      Rn = 12.5;
      break;
    case "Nuvens dispersas":
      Rn = 17.5;
      break;
    case "Chuva moderada":
      Rn = 7.5;
      break;
    case "Chuva forte":
      Rn = 3.5;
      break;
    case "Chuva fraca":
      Rn = 10;
      break;
    case "Nublado":
      Rn = 7.5;
      break;
    case "Poucas nuvens":
      Rn = 17.5;
      break;
    case "Aguaceiro fraco":
      Rn = 8;
      break;
    case "Tempestade com chuva forte":
      Rn = 2;
      break;
    case "Céu limpo":
      Rn = 25;
      break;
    default:
      Rn = 15; // Valor médio
  }

  const G = 0.15 * Rn; // Fluxo de calor no solo (estimativa)
  const es = 0.6108 * Math.exp((17.27 * T) / (T + 237.3)); // Pressão de vapor de saturação
  const ea = (umidade / 100) * es; // Pressão de vapor real
  const delta = (4098 * es) / Math.pow(T + 237.3, 2); // Pendiente da curva de pressão de vapor
  const gamma = (0.665 * pressaokPa) / 1000; // Constante psicrométrica

  // Fórmula de Penman-Monteith para o cálculo do ETo
  const ETo =
    (0.408 * delta * (Rn - G) +
      gamma * (900 / (T + 273)) * velocidadeDoVento * (es - ea)) /
    (delta + gamma * (1 + 0.34 * velocidadeDoVento));

  return ETo;
}

// Função para obter o valor de Kc com base na cultura e estágio selecionados
function obterKc() {
  const culturaSelecionada = document.getElementById("kc").value;
  const estadoSelecionado = document.getElementById("tempo").value;

  //Peguei de um estudo da Embrapa
  const valoresKc = {
    Soja: {
      "Estágio Inicial": 0.5,
      "Estágio de Desenvolvimento": 1.15,
      "Estágio Final": 0.75,
    },
    Milho: {
      "Estágio Inicial": 1.05,
      "Estágio de Desenvolvimento": 1.2,
      "Estágio Final": 0.35,
    },
    Tomate: {
      "Estágio Inicial": 0.6,
      "Estágio de Desenvolvimento": 1.15,
      "Estágio Final": 0.8,
    },
    Trigo: {
      "Estágio Inicial": 1.05,
      "Estágio de Desenvolvimento": 1.15,
      "Estágio Final": 0.35,
    },
    Café: {
      "Estágio Inicial": 0.75,
      "Estágio de Desenvolvimento": 1.2,
      "Estágio Final": 1.0,
    },
  };

  let Kc = valoresKc[culturaSelecionada]?.[estadoSelecionado];

  return Kc;
}

function obterEficiencia() {
  const sistemaSelecionado = document.getElementById("sistema").value;

  const eficienciaSistemas = {
    "Pivô Central": 0.85,
    Gotejamento: 0.95,
    Aspersão: 0.8,
    Microaspersão: 0.9,
  };

  const eficiencia = eficienciaSistemas[sistemaSelecionado];

  return eficiencia;
}

function obterQuantidadeDePlantaPorHa() {

  const culturaSelecionada = document.getElementById("kc").value;

  const quantidadeDePlantasX = {
    Soja: 300000,
    Milho: 70000,
    Tomate: 15000,
    Trigo: 2500000,
    Café: 2000
  }

  const quantidadeDePlantas = quantidadeDePlantasX[culturaSelecionada];

  return quantidadeDePlantas;
}

/*function obterTamanhoRaiz() {
  const culturaSelecionada = document.getElementById("kc").value;
  const estadoSelecionado = document.getElementById("tempo").value;

  const Raiz = {
    Soja: {
      "Estágio Inicial": 0.15,
      "Estágio de Desenvolvimento": 0.4,
      "Estágio Final": 0.75,
    },
    Milho: {
      "Estágio Inicial": 0.2,
      "Estágio de Desenvolvimento": 0.4,
      "Estágio Final": 1.75,
    },
    Tomate: {
      "Estágio Inicial": 0.15,
      "Estágio de Desenvolvimento": 0.5,
      "Estágio Final": 0.95,
    },
    Trigo: {
      "Estágio Inicial": 0.15,
      "Estágio de Desenvolvimento": 0.5,
      "Estágio Final": 1.1,
    },
    Café: {
      "Estágio Inicial": 0.25,
      "Estágio de Desenvolvimento": 0.75,
      "Estágio Final": 2.5,
    },
  };

  const tamanhoRaiz = Raiz[culturaSelecionada]?.[estadoSelecionado];

  return tamanhoRaiz;
}

/*function obterTipoDeSolo(lat, long) {

  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${long}&depth=0-5cm`;

  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao obter dados de solo');
          }
          return response.json();
      })
      .then(data => {
          const propriedades = data.properties.layers;

          const argila = propriedades.find(layer => layer.name === "clay").depths[0].values.mean || 0;
          const silte = propriedades.find(layer => layer.name === "silt").depths[0].values.mean || 0;
          const areia = propriedades.find(layer => layer.name === "sand").depths[0].values.mean || 0;

          let argilaC = argila / 10;
          let areiaC = areia / 10;
          let silteC = silte / 10;
          
          const capacidadeCampo = (0.1 * argilaC + 0.5 * silteC + 0.025 * areiaC) * 10;
          const pontoMurchaPermanente = (0.05 * argilaC + 0.03 * silteC + 0.015 * areiaC) * 10;
          const CAD = (capacidadeCampo - pontoMurchaPermanente);

          return CAD;
      })
      .catch(error => {
          document.getElementById('resultadoSolo').textContent = `Erro ao obter dados de solo: ${error.message}`;
      });
}*/
