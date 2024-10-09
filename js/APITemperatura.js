const apiKeyTemperaturaFutura = "713b63ee480140bf9b16a9a9b71c83ed";

// Função para obter a previsão do clima
function obterClima() {
    const cidade = document.getElementById('cidadeInput').value;

    // URL da API
    const urlTemperaturaFutura = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cidade}&key=${apiKeyTemperaturaFutura}&days=16&lang=pt`;

    fetch(urlTemperaturaFutura)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao obter dados da API');
      }
      return response.json();
    })
    .then(data => {
      // Processar e exibir os dados da previsão
      const dadosDaPrevisao = data.data;

      // Limpar conteúdo anterior
      document.getElementById('temperatura_futura').innerHTML = '';

      // Processar e exibir a previsão do clima para os próximos dias
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

        //Transforma de mb para kPa
        const pressaokPa = pressao / 10;

        // Exibir dados
        document.getElementById('temperatura_futura').innerHTML += `
          <p><strong>Data:</strong> ${data.toDateString()}</p>
          <p><strong>Temperatura:</strong> ${temperaturaMedia}°C, <strong>Mínima:</strong> ${tempMin}°C, <strong>Máxima:</strong> ${tempMax}°C</p>
          <p><strong>Descrição:</strong> ${descricao}</p>
          <p><strong>Precipitação:</strong> ${precipitacao} mm</p>
          <p><strong>Pressão Atmosférica:</strong> ${pressaokPa} kPa</p>
          <p><strong>Velocidade do Vento:</strong> ${velocidadeDoVento.toFixed(2)} m/s</p>
          <p><strong>ETo:</strong> ${ETo.toFixed(2)} mm/dia</p>
          <p><strong>Umidade Relativa:</strong> ${umidade}%</p>
          <img src="${iconUrl}" alt="Ícone de clima" />
          <hr />
        `;
      });
    })
    .catch(error => {
      console.error('Erro:', error);
      document.getElementById('temperatura_futura').innerHTML = `<p>Erro ao obter dados meteorológicos</p>`;
    });
}


function ETo() {
  let Rn = 15;   
  const T = temperaturaMedia; 

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
    Rn = 17.5
  } else if (descricao == "Aguaceiro fraco") {
    Rn = match.random 
  }

  const G = 0.15 * Rn; 

  // Cálculo de es e ea
  const es = 0.6108 * Math.exp((17.27 * T) / (T + 237.3)); // Pressão de vapor de saturação (kPa)
  const ea = (umidade / 100) * es; // Pressão de vapor atual (kPa)

  // Cálculo de Δ e γ
  const delta = (4098 * es) / Math.pow(T + 237.3, 2); // Inclinação da curva de saturação de pressão de vapor (kPa/°C)
  const gamma = (0.665 * pressaokPa) / 1000; // Constante psicrométrica (kPa/°C)

  // Cálculo do ETo
  const ETo = (0.408 * delta * (Rn - G) + gamma * (900 / (T + 273)) * velocidadeDoVento * (es - ea)) / (delta + gamma * (1 + 0.34 * velocidadeDoVento));

  return ETo;
}