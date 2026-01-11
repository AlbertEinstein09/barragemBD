document.addEventListener("DOMContentLoaded", function () {
    const botoes = document.querySelectorAll(".menu button");
    const paginas = document.querySelectorAll(".pagina");

    function mostrar(pagina) {
        paginas.forEach(p => p.style.display = "none");

        const alvo = document.getElementById(pagina);
        if (alvo) alvo.style.display = "block";
    }

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const pagina = botao.dataset.pagina;
            mostrar(pagina);
        });
    });

    // Página inicial
    mostrar("barragens");
});

function carregarConsulta(numero, titulo) {
    fetch(`consultas/consulta${numero}.csv`)
        .then(res => res.text())
        .then(csv => {
            const linhas = csv.trim().split("\n");
            const sep = linhas[0].includes(";") ? ";" : ",";
            const cabecalho = linhas[0].split(sep);
            const dados = linhas.slice(1).map(l => l.split(sep));

            const idTabela = "consulta" + numero;

            let html = `
              <div class="bloco">
                <h3>${titulo}</h3>
                <table id="${idTabela}" class="display">
                  <thead>
                    <tr>${cabecalho.map(c => `<th>${c}</th>`).join("")}</tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            `;

            document.getElementById("consultasContainer").innerHTML += html;

            setTimeout(() => {
                $("#" + idTabela).DataTable({ data: dados,
                  order: []
                 });
            }, 100);
        });
}

carregarConsulta(1, "Barragens em Emergência");
carregarConsulta(2, "Barragens de Terra acima de 20m");
carregarConsulta(3, "Barragem e Município");
carregarConsulta(4, "Barragem e Mina");
carregarConsulta(5, "Empreendedor e Emergência");
carregarConsulta(6, "Relatório Completo (Barragem, Mina, Empreendedor, UF)");
carregarConsulta(7, "Barragens Inativas e Localização");
carregarConsulta(8, "Dano Potencial Alto");
carregarConsulta(9, "Quantidade de Barragens por Empreendedor");
carregarConsulta(10, "Média de Altura por UF");
carregarConsulta(11, "Risco por UF");
carregarConsulta(12, "Top 5 Maiores Volumes");


/* ===================== BARRAGENS ===================== */
fetch("data/barragem.csv")
.then(res => res.text())
.then(csv => {
    const linhas = csv.trim().split("\n");
    const sep = linhas[0].includes(";") ? ";" : ",";
    const dados = linhas.slice(1);

    let tabela = [];
    let total = 0;
    let emergencia = 0;
    let danoAlto = 0;
    let riscoAlto = 0;

    let risco = {};
    let dano = {};

    dados.forEach(linha => {
        const c = linha.split(sep).map(v => v.trim());

        tabela.push(c);
        total++;

        // Índices conforme você informou
        const riscoCol = c[2];
        const danoCol = c[3];
        const emergenciaCol = c[4];

        if (emergenciaCol.includes("Nivel")) {
            emergencia++;
        }

        if (danoCol && danoCol.toLowerCase().includes("alta")) {
            danoAlto++;
        }

        if (riscoCol && riscoCol.toLowerCase().includes("alta")) {
            riscoAlto++;
        }

        risco[riscoCol] = (risco[riscoCol] || 0) + 1;
        dano[danoCol] = (dano[danoCol] || 0) + 1;
    });

    $("#tabelaBarragens").DataTable({ data: tabela });

    document.getElementById("totalBarragens").innerText = total;
    document.getElementById("emergencia").innerText = emergencia;
    document.getElementById("danoAlto").innerText = danoAlto;
    document.getElementById("riscoAlto").innerText = riscoAlto;

    new Chart(document.getElementById("graficoRisco"), {
        type: "bar",
        data: {
            labels: Object.keys(risco),
            datasets: [{ data: Object.values(risco) }]
        }
    });

    new Chart(document.getElementById("graficoDano"), {
        type: "pie",
        data: {
            labels: Object.keys(dano),
            datasets: [{ data: Object.values(dano) }]
        }
    });
});

/* ===================== EMPREENDEDORES ===================== */
fetch("data/empreendedor.csv")
.then(res => res.text())
.then(csv => {
    const linhas = csv.trim().split("\n");
    const sep = linhas[0].includes(";") ? ";" : ",";
    const dados = linhas.slice(1);

    let tabela = [];

    dados.forEach(l => tabela.push(l.split(sep)));

    $("#tabelaEmpreendedores").DataTable({ data: tabela });
    document.getElementById("totalEmpreendedores").innerText = tabela.length;
});

/* ===================== LOCALIZAÇÃO ===================== */
fetch("data/localizacao.csv")
.then(res => res.text())
.then(csv => {
    const linhas = csv.trim().split("\n");
    const sep = linhas[0].includes(";") ? ";" : ",";
    const dados = linhas.slice(1);

    let tabela = [];

    dados.forEach(l => tabela.push(l.split(sep)));

    $("#tabelaLocalizacao").DataTable({ data: tabela });
    document.getElementById("totalLocalizacao").innerText = tabela.length;
});

/* ===================== MINA ===================== */
fetch("data/mina.csv")
.then(res => res.text())
.then(csv => {
    const linhas = csv.trim().split("\n");
    const sep = linhas[0].includes(";") ? ";" : ",";
    const dados = linhas.slice(1);

    let tabela = [];

    dados.forEach(l => tabela.push(l.split(sep)));

    $("#tabelaMinas").DataTable({ data: tabela });
    document.getElementById("totalMina").innerText = tabela.length;
});
