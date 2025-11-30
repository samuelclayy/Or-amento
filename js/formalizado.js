(function () {
  function formatMoney(v) {
    if (!v && v !== 0) return '';
    var n = parseFloat(v);
    if (isNaN(n)) return '';
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function atualizarDataAtual() {
    var hoje = new Date();
    var str = hoje.toLocaleDateString('pt-BR');
    document.querySelectorAll('[data-bind="data-atual"]').forEach(function (el) {
      el.textContent = str;
    });
  }

  function bindTexto(inputId, bindName) {
    var input = document.getElementById(inputId);
    if (!input) return;
    function atualizar() {
      var valor = input.value || '';
      document.querySelectorAll('[data-bind="' + bindName + '"]').forEach(function (el) {
        el.textContent = valor;
      });
    }
    input.addEventListener('input', atualizar);
    atualizar();
  }

  function construirLinhaItem(index) {
    var div = document.createElement('div');
    div.className = 'form-grid';
    div.dataset.index = index;
    div.innerHTML = [
      '<div class="form-group">',
      '  <label>Produto</label>',
      '  <input type="text" data-field="produto" />',
      '</div>',
      '<div class="form-group">',
      '  <label>Código</label>',
      '  <input type="text" data-field="codigo" />',
      '</div>',
      '<div class="form-group">',
      '  <label>Quantidade</label>',
      '  <input type="number" min="0" step="1" data-field="quantidade" />',
      '</div>',
      '<div class="form-group">',
      '  <label>Preço unitário (R$)</label>',
      '  <input type="number" min="0" step="0.01" data-field="preco" />',
      '</div>'
    ].join('');
    return div;
  }

  function atualizarTabelaProdutos() {
    var tbody = document.querySelector('[data-bind="tabela-produtos"]');
    var formContainer = document.getElementById('formal-itens-form');
    var linhas = formContainer ? Array.from(formContainer.querySelectorAll('[data-index]')) : [];

    var itens = [];
    linhas.forEach(function (linha) {
      var produto = linha.querySelector('[data-field="produto"]').value || '';
      var codigo = linha.querySelector('[data-field="codigo"]').value || '';
      var qtd = parseFloat(linha.querySelector('[data-field="quantidade"]').value.replace(',', '.')) || 0;
      var preco = parseFloat(linha.querySelector('[data-field="preco"]').value.replace(',', '.')) || 0;
      if (!produto && !codigo && !qtd && !preco) return;
      var total = qtd * preco;
      itens.push({ produto: produto, codigo: codigo, qtd: qtd, preco: preco, total: total });
    });

    var subtotal = itens.reduce(function (acc, it) { return acc + it.total; }, 0);
    var frete = parseFloat(document.getElementById('formal-frete').value.replace(',', '.')) || 0;
    var totalGeral = subtotal + frete;

    if (tbody) {
      tbody.innerHTML = '';
      itens.forEach(function (it) {
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td>' + it.produto + '</td>' +
          '<td>' + it.codigo + '</td>' +
          '<td class="text-right">' + (it.qtd || '') + '</td>' +
          '<td class="text-right">' + formatMoney(it.preco) + '</td>' +
          '<td class="text-right">' + formatMoney(it.total) + '</td>';
        tbody.appendChild(tr);
      });
    }

    document.querySelectorAll('[data-bind="subtotal"]').forEach(function (el) {
      el.textContent = formatMoney(subtotal);
    });
    document.querySelectorAll('[data-bind="frete"]').forEach(function (el) {
      el.textContent = formatMoney(frete);
    });
    document.querySelectorAll('[data-bind="total-geral"]').forEach(function (el) {
      el.textContent = formatMoney(totalGeral);
    });
  }

  function initItens() {
    var container = document.getElementById('formal-itens-form');
    if (!container) return;
    if (!container.hasChildNodes()) {
      container.appendChild(construirLinhaItem(0));
    }
    container.addEventListener('input', function (e) {
      if (e.target.matches('input')) atualizarTabelaProdutos();
    });
    document.getElementById('formal-add-item').addEventListener('click', function () {
      var idx = container.querySelectorAll('[data-index]').length;
      container.appendChild(construirLinhaItem(idx));
    });
    document.getElementById('formal-remover-item').addEventListener('click', function () {
      var linhas = container.querySelectorAll('[data-index]');
      if (linhas.length > 1) {
        container.removeChild(linhas[linhas.length - 1]);
        atualizarTabelaProdutos();
      }
    });
    atualizarTabelaProdutos();
  }

  function initRetiradaPagamento() {
    var selRetirada = document.getElementById('formal-retirada');
    var enderecoGroup = document.getElementById('formal-endereco-group');
    var enderecoInput = document.getElementById('formal-endereco');
    var formaPagamento = document.getElementById('formal-forma-pagamento');
    var faturadoDiasGroup = document.getElementById('formal-faturado-dias-group');
    var faturadoDiasInput = document.getElementById('formal-faturado-dias');

    function atualizarRetirada() {
      var v = selRetirada.value;
      document.querySelectorAll('[data-bind="retirada"]').forEach(function (el) {
        el.textContent = v === 'sedex' ? 'Sedex' : 'Retirada em loja';
      });
      if (v === 'sedex') {
        enderecoGroup.style.display = '';
      } else {
        enderecoGroup.style.display = 'none';
      }
      atualizarEndereco();
    }

    function atualizarEndereco() {
      var endereco = enderecoInput.value || '';
      var hasEndereco = !!endereco && selRetirada.value === 'sedex';
      document.querySelectorAll('[data-bind-container="endereco"]').forEach(function (wrapper) {
        wrapper.style.display = hasEndereco ? '' : 'none';
      });
      document.querySelectorAll('[data-bind="endereco"]').forEach(function (el) {
        el.textContent = endereco;
      });
    }

    function atualizarPagamento() {
      var v = formaPagamento.value;
      var label = v === 'faturado' ? 'Faturado em ' + (faturadoDiasInput.value || '0') + ' dias' : 'À vista';
      document.querySelectorAll('[data-bind="pagamento"]').forEach(function (el) {
        el.textContent = label;
      });
      faturadoDiasGroup.style.display = v === 'faturado' ? '' : 'none';
    }

    selRetirada.addEventListener('change', atualizarRetirada);
    enderecoInput.addEventListener('input', atualizarEndereco);
    formaPagamento.addEventListener('change', atualizarPagamento);
    faturadoDiasInput.addEventListener('input', atualizarPagamento);

    atualizarRetirada();
    atualizarPagamento();
  }

  function initObservacoesExtra() {
    var input = document.getElementById('formal-observacoes-extra');
    if (!input) return;
    function atualizar() {
      document.querySelectorAll('[data-bind="observacoes-extra"]').forEach(function (el) {
        el.textContent = input.value || '';
      });
    }
    input.addEventListener('input', atualizar);
    atualizar();
  }

  function initFreteWatcher() {
    var freteInput = document.getElementById('formal-frete');
    if (!freteInput) return;
    freteInput.addEventListener('input', atualizarTabelaProdutos);
  }

  document.addEventListener('DOMContentLoaded', function () {
    atualizarDataAtual();
    bindTexto('formal-empresa', 'empresa');
    bindTexto('formal-cnpj', 'cnpj');
    initItens();
    initRetiradaPagamento();
    initObservacoesExtra();
    initFreteWatcher();
  });
})();
