fetch('data/barragem.csv')
  .then(res => res.text())
  .then(csv => {

    const linhas = csv.trim().split('\n');
    const dados = linhas.slice(1);

    let tabela = [];
    let risco = {};
    let dano = {};

    let emergencia = 0;
    let danoAlto = 0;
    let riscoAlto = 0;

    dados.forEach(linha => {
      const [
        id,
        nome,
        categirarisco,
        danopotencial,
        nivel,
        tipo,
        situacao,
        data,
        altura,
        volume
      ] = linha.split(',');

      tabela.push([
        id, nome, categirarisco, danopotencial,
        nivel, tipo, situacao, data, altura, volume
      ]);

      // Contadores
      const riscoTxt = categirarisco.trim().toLowerCase();
      const danoTxt  = danopotencial.trim().toLowerCase();
      const nivelTxt = nivel.trim().toLowerCase();

      if (!nivelTxt.includes('sem')) {
        emergencia++;
      }

      if (danoTxt.includes('alta')) {
        danoAlto++;
      }

      if (riscoTxt.includes('alta')) {
        riscoAlto++;
      }


      // Gráficos
      risco[categirarisco] = (risco[categirarisco] || 0) + 1;
      dano[danopotencial] = (dano[danopotencial] || 0) + 1;
    });

    // Cards
    document.getElementById('totalBarragens').innerText = tabela.length;
    document.getElementById('emergencia').innerText = emergencia;
    document.getElementById('danoAlto').innerText = danoAlto;
    document.getElementById('riscoAlto').innerText = riscoAlto;

    // DataTable
    $('#tabelaBarragens').DataTable({
      data: tabela,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/pt-BR.json"
      }
    });

    // Gráfico Risco
    new Chart(document.getElementById('graficoRisco'), {
      type: 'bar',
      data: {
        labels: Object.keys(risco),
        datasets: [{
          label: 'Barragens',
          data: Object.values(risco)
        }]
      }
    });

    // Gráfico Dano
    new Chart(document.getElementById('graficoDano'), {
      type: 'pie',
      data: {
        labels: Object.keys(dano),
        datasets: [{
          data: Object.values(dano)
        }]
      }
    });

  });
