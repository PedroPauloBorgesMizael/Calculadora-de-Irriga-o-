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
      const dailyForecasts = data.data;

      // Limpar conteúdo anterior
      document.getElementById('temperatura_futura').innerHTML = '';

      // Processar e exibir a previsão do clima para os próximos dias
      dailyForecasts.forEach(day => {
        const date = new Date(day.datetime);  
        const tempDay = day.temp; 
        const tempMin = day.min_temp;  
        const tempMax = day.max_temp; 
        const description = day.weather.description;  
        const precip = day.precip || 0;  
        const iconCode = day.weather.icon;  
        const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

        // Exibir dados
        document.getElementById('temperatura_futura').innerHTML += `
          <p><strong>Data:</strong> ${date.toDateString()}</p>
          <p><strong>Temperatura:</strong> ${tempDay}°C, <strong>Mínima:</strong> ${tempMin}°C, <strong>Máxima:</strong> ${tempMax}°C</p>
          <p><strong>Descrição:</strong> ${description}</p>
          <p><strong>Precipitação:</strong> ${precip} mm</p>
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