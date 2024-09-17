document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('financial-form');
    const transactionList = document.getElementById('transaction-list');
    const rendaTotal = document.getElementById('renda-total');
    const despesasTotais = document.getElementById('despesas-totais');
    const dividasTotais = document.getElementById('dividas-totais');
    const saldo = document.getElementById('saldo');

    let totalRenda = 0;
    let totalDespesas = 0;
    let totalDividas = 0;

    // Função para atualizar a visão geral
    function updateOverview() {
        rendaTotal.textContent = `R$ ${totalRenda.toFixed(2)}`;
        despesasTotais.textContent = `R$ ${totalDespesas.toFixed(2)}`;
        dividasTotais.textContent = `R$ ${totalDividas.toFixed(2)}`;

        const currentSaldo = totalRenda - (totalDespesas + totalDividas);
        saldo.textContent = `R$ ${currentSaldo.toFixed(2)}`;
    }

    // Função para adicionar a transação na lista
    function addTransaction(description, value, category) {
        const li = document.createElement('li');
        li.textContent = `${description}: R$ ${value.toFixed(2)} (${category})`;
        transactionList.appendChild(li);
    }

    // Validação de valor negativo para receita
    function isValidInput(category, value) {
        if (category === 'renda' && value < 0) {
            alert("Receitas não podem ser negativas.");
            return false;
        }
        return true;
    }

    // Inicializar o Firestore
    const db = firebase.firestore();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const value = parseFloat(document.getElementById('value').value);
        const category = document.getElementById('category').value;

        if (!isValidInput(category, value)) {
            return; // Aborta a adição se o valor for inválido
        }

        // Salvar transação no Firestore
        db.collection("transactions").add({
            description: description,
            value: value,
            category: category,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            // Adicionar transação à lista localmente
            addTransaction(description, value, category);

            // Atualizar os totais com base na categoria
            if (category === 'renda') {
                totalRenda += value;
            } else if (category === 'despesa') {
                totalDespesas += value;
            } else if (category === 'divida') {
                totalDividas += value;
            }

            // Atualizar a visão geral
            updateOverview();

            // Limpar o formulário
            form.reset();
        }).catch((error) => {
            console.error("Erro ao salvar transação: ", error);
        });
    });
});
