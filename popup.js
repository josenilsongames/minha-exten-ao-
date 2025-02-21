document.getElementById('calcular').addEventListener('click', async function () {
    const seuPoder = parseFloat(document.getElementById('seu_poder').value);
    const poderTotal = parseFloat(document.getElementById('poder_total').value);
    const recompensa = parseFloat(document.getElementById('recompensa').value);
    const cryptoSelecionada = document.getElementById('crypto').value;

    // Obter a unidade de poder de mineração selecionada
    const unidadePoder = document.getElementById('unidade_poder').value;
    const unidadePoderRede = document.getElementById('unidade_poder_rede').value;

    if (isNaN(seuPoder) || isNaN(poderTotal) || isNaN(recompensa) || poderTotal <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Função para converter unidades de poder para H/s
    const conversaoParaHashes = (poder, unidade) => {
        switch (unidade) {
            case 'ghs': return poder * 1e9;   // GH/s → H/s
            case 'ths': return poder * 1e12;  // TH/s → H/s
            case 'phs': return poder * 1e15;  // PH/s → H/s
            case 'ehs': return poder * 1e18;  // EH/s → H/s
            case 'zhs': return poder * 1e21;  // ZH/s → H/s
            default: return poder; // Se já estiver em H/s, não faz conversão
        }
    };

    // Converter o poder de mineração para H/s
    const seuPoderConvertido = conversaoParaHashes(seuPoder, unidadePoder);
    const poderTotalConvertido = conversaoParaHashes(poderTotal, unidadePoderRede);

    // Calcular a recompensa por bloco considerando o poder de mineração
    const proporcaoPoder = seuPoderConvertido / poderTotalConvertido;
    const recompensaPorBloco = proporcaoPoder * recompensa;

    const cryptoIds = {
        lmt: "lmt", // LMT
        btc: "bitcoin", // Bitcoin
        doge: "dogecoin", // Dogecoin
        ltc: "litecoin", // Litecoin
        pol: "polkadot" // Polkadot (POL)
    };

    // Definir o valor da taxa de câmbio, inicialmente considerando LMT (sem conversão)
    let taxaCambio = { lmt: 1 };

    if (cryptoSelecionada !== "lmt") {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds[cryptoSelecionada]}&vs_currencies=usd`);
            const data = await response.json();
            taxaCambio[cryptoSelecionada] = data[cryptoIds[cryptoSelecionada]].usd;
        } catch (error) {
            alert("Erro ao obter o valor da criptomoeda em tempo real.");
            return;
        }
    }

    // Calcular o valor em dólar com base na recompensa por bloco
    const valorEmDolar = recompensaPorBloco * taxaCambio[cryptoSelecionada];

    // Calcular as recompensas por hora, dia, semana e mês
    const recompensaPorHora = recompensaPorBloco * 6; // 6 blocos por hora (10 minutos por bloco)
    const recompensaPorDia = recompensaPorHora * 24; // 24 horas por dia
    const recompensaPorSemana = recompensaPorDia * 7; // 7 dias por semana
    const recompensaPorMes = recompensaPorDia * 30; // 30 dias por mês

    // Exibir os resultados
    document.getElementById('resultados').innerHTML = `
        <h3>Resultados:</h3>
        <p><span class="highlight">Recompensa por Bloco:</span> ${recompensaPorBloco.toFixed(8)} ${cryptoSelecionada.toUpperCase()} (${valorEmDolar.toFixed(2)} USD)</p>
        <p><span class="highlight">Recompensa por Hora:</span> ${recompensaPorHora.toFixed(8)} ${cryptoSelecionada.toUpperCase()} (${(recompensaPorHora * taxaCambio[cryptoSelecionada]).toFixed(2)} USD)</p>
        <p><span class="highlight">Recompensa por Dia:</span> ${recompensaPorDia.toFixed(8)} ${cryptoSelecionada.toUpperCase()} (${(recompensaPorDia * taxaCambio[cryptoSelecionada]).toFixed(2)} USD)</p>
        <p><span class="highlight">Recompensa por Semana:</span> ${recompensaPorSemana.toFixed(8)} ${cryptoSelecionada.toUpperCase()} (${(recompensaPorSemana * taxaCambio[cryptoSelecionada]).toFixed(2)} USD)</p>
        <p><span class="highlight">Recompensa por Mês:</span> ${recompensaPorMes.toFixed(8)} ${cryptoSelecionada.toUpperCase()} (${(recompensaPorMes * taxaCambio[cryptoSelecionada]).toFixed(2)} USD)</p>
    `;
});
// Função para salvar os valores no localStorage
function salvarValores() {
  localStorage.setItem('seu_poder', document.getElementById('seu_poder').value);
  localStorage.setItem('poder_total', document.getElementById('poder_total').value);
  localStorage.setItem('recompensa', document.getElementById('recompensa').value);
  localStorage.setItem('crypto', document.getElementById('crypto').value);
  localStorage.setItem('unidade_poder', document.getElementById('unidade_poder').value);
  localStorage.setItem('unidade_poder_rede', document.getElementById('unidade_poder_rede').value);
}

// Função para carregar os valores do localStorage e preencher os campos
function carregarValores() {
  if (localStorage.getItem('seu_poder')) {
    document.getElementById('seu_poder').value = localStorage.getItem('seu_poder');
  }
  if (localStorage.getItem('poder_total')) {
    document.getElementById('poder_total').value = localStorage.getItem('poder_total');
  }
  if (localStorage.getItem('recompensa')) {
    document.getElementById('recompensa').value = localStorage.getItem('recompensa');
  }
  if (localStorage.getItem('crypto')) {
    document.getElementById('crypto').value = localStorage.getItem('crypto');
  }
  if (localStorage.getItem('unidade_poder')) {
    document.getElementById('unidade_poder').value = localStorage.getItem('unidade_poder');
  }
  if (localStorage.getItem('unidade_poder_rede')) {
    document.getElementById('unidade_poder_rede').value = localStorage.getItem('unidade_poder_rede');
  }
}

// Ação do botão "Calcular"
document.getElementById('calcular').addEventListener('click', async function () {
  // Salva os valores inseridos sempre que o cálculo for feito
  salvarValores();

  const seuPoder = parseFloat(document.getElementById('seu_poder').value);
  const poderTotal = parseFloat(document.getElementById('poder_total').value);
  const recompensa = parseFloat(document.getElementById('recompensa').value);
  const cryptoSelecionada = document.getElementById('crypto').value;

  // O resto do código permanece inalterado
});

// Carregar os valores quando a página for carregada
window.onload = function() {
  carregarValores();
};