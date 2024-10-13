const apiKeyTemperaturaFutura = "713b63ee480140bf9b16a9a9b71c83ed";

// Função para obter a previsão do clima
function obterClima() {
  const cidade = document.getElementById('cidadeInput').value;
  const urlTemperaturaFutura = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cidade}&key=${apiKeyTemperaturaFutura}&days=16&lang=pt`;

  fetch(urlTemperaturaFutura)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao obter dados da API');
    }
    return response.json();
  })
  .then(data => {
    const dadosDaPrevisao = data.data;
    document.getElementById('temperatura_futura').innerHTML = '';

    dadosDaPrevisao.forEach(day => {
      const data = new Date(day.datetime);  
      const temperaturaMedia = day.temp; 
      const tempMin = day.min_temp;  
      const tempMax = day.max_temp; 
      const descricao = day.weather.description;  
      const precipitacao = day.precip || 0;  
      const pressao = day.pres;
      const velocidadeDoVento = day.wind_spd;
      const umidade = day.rh;
      const iconCode = day.weather.icon;  
      const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

      const pressaokPa = pressao / 10;

      const etoValor = calcularETo(temperaturaMedia, descricao, pressaokPa, umidade, velocidadeDoVento);

      const dataFormatada = data.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

      document.getElementById('temperatura_futura').innerHTML += `
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Temperatura:</strong> ${temperaturaMedia}°C, <strong>Mínima:</strong> ${tempMin}°C, <strong>Máxima:</strong> ${tempMax}°C</p>
        <p><strong>Descrição:</strong> ${descricao}</p>
        <p><strong>Precipitação:</strong> ${precipitacao} mm</p>
        <p><strong>Pressão Atmosférica:</strong> ${pressaokPa} kPa</p>
        <p><strong>Velocidade do Vento:</strong> ${velocidadeDoVento.toFixed(2)} m/s</p>
        <p><strong>ETo:</strong> ${etoValor.toFixed(2)} mm/dia</p>
        <p><strong>Umidade Relativa:</strong> ${umidade}%</p>
        <img src="${iconUrl}" alt="Ícone de clima" />
        <hr />
      `;
    });
  })
  .catch(error => {
    console.error(error); // Exibe o erro no console para ajudar na depuração
    document.getElementById('temperatura_futura').innerHTML = `<p>Erro ao obter dados meteorológicos</p>`;
  });
}


function calcularETo(T, descricao, pressaokPa, umidade, velocidadeDoVento) {
  let Rn;   

  // Define o valor do saldo de radiação diária
  if(descricao == "Nuvens quebradas") {
    Rn = 12.5;
  } else if (descricao == "Nuvens dispersas") {
    Rn = 17.5;
  } else if (descricao == "Chuva moderada") {
    Rn = 7.5;
  } else if (descricao == "Chuva forte") {
    Rn = 3.5;
  } else if (descricao == "Chuva fraca") {
    Rn = 10;
  } else if (descricao == "Nublado") {
    Rn = 7.5;
  } else if (descricao == "Poucas nuvens") {
    Rn = 17.5;
  } else if (descricao == "Aguaceiro fraco") {
    Rn = 8;
  } else if (descricao == "Tempestade com chuva forte") {
    Rn = 2;
  } else if (descricao == "Céu limpo") {
    Rn = 25;
  }

  const G = 0.15 * Rn; 

  // Cálculo de es e ea
  const es = 0.6108 * Math.exp((17.27 * T) / (T + 237.3)); // Pressão de vapor de saturação (kPa)
  const ea = (umidade / 100) * es; // Pressão de vapor atual (kPa)

  // Cálculo de Δ e γ
  const delta = (4098 * es) / Math.pow(T + 237.3, 2); // Inclinação da curva de saturação de pressão de vapor (kPa/°C)
  const gamma = (0.665 * pressaokPa) / 1000; // Constante psicrométrica (kPa/°C)

  // Cálculo do ETo
  return (0.408 * delta * (Rn - G) + gamma * (900 / (T + 273)) * velocidadeDoVento * (es - ea)) / (delta + gamma * (1 + 0.34 * velocidadeDoVento));
}