const apiKeyTemperaturaFutura = "713b63ee480140bf9b16a9a9b71c83ed";
let cidadeAtual = ''; // Variável global para armazenar a cidade selecionada

function dadosMeteorologicos() {
    const cidade = document.getElementById('cidadeInput').value;
    cidadeAtual = cidade; // Atualiza a variável global com o valor atual da cidade

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
            let botoesHTML = '';

            // Adiciona botões para cada dia
            dadosDaPrevisao.forEach((day, index) => {
                const data = new Date(day.datetime);
                const dataFormatada = data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
                const iconCode = day.weather.icon;
                const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

                botoesHTML += `
                    <button class="btn__clima" onclick="mostrarDetalhes(${index})">
                        <p>${dataFormatada}</p>
                        <img class="icone__clima" src="${iconUrl}" alt="Ícone de Clima">
                        <hr>
                    </button>
                `;
            });

            document.getElementById('barraDias').innerHTML = botoesHTML;

            // Armazena dados para uso posterior
            window.dadosDaPrevisao = dadosDaPrevisao;
        })
        .catch(error => {
            console.error(error);
            document.getElementById('barraDias').innerHTML = `<p>Erro ao obter dados meteorológicos</p>`;
        });
}

function mostrarDetalhes(index) {
    const diaSelecionado = window.dadosDaPrevisao[index];

    if (diaSelecionado) {
        const data = new Date(diaSelecionado.datetime);
        const dataFormatada = data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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

        // Usa a variável global cidadeAtual para mostrar a cidade selecionada
        document.getElementById('dadosTempo').innerHTML = `
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
                        <div class="barra__divisao">
                            <hr>
                        </div>
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

            </div>

        </section>
    </div>
    `;
    }
}
