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

  function initValoresProduto() {
    var valorInput = document.getElementById('rev-valor-unitario');
    var qtdInput = document.getElementById('rev-quantidade');

    function atualizarTotais() {
      var valor = parseFloat((valorInput.value || '').replace(',', '.')) || 0;
      var qtd = parseFloat((qtdInput.value || '').replace(',', '.')) || 0;
      var total = valor * qtd;
      document.querySelectorAll('[data-bind="valor-unitario"]').forEach(function (el) {
        el.textContent = formatMoney(valor);
      });
      document.querySelectorAll('[data-bind="quantidade"]').forEach(function (el) {
        el.textContent = qtd || '';
      });
      document.querySelectorAll('[data-bind="total"]').forEach(function (el) {
        el.textContent = formatMoney(total);
      });
    }

    valorInput.addEventListener('input', atualizarTotais);
    qtdInput.addEventListener('input', atualizarTotais);
    atualizarTotais();
  }

  function initSedex() {
    var sel = document.getElementById('rev-sedex');
    var group = document.getElementById('rev-sedex-valor-group');
    var inputValor = document.getElementById('rev-sedex-valor');

    function atualizar() {
      var isSim = sel.value === 'sim';
      document.querySelectorAll('[data-bind="sedex"]').forEach(function (el) {
        el.textContent = isSim ? 'Sim' : 'Não';
      });
      group.style.display = isSim ? '' : 'none';
      atualizarValor();
    }

    function atualizarValor() {
      var isSim = sel.value === 'sim';
      var valor = parseFloat((inputValor.value || '').replace(',', '.')) || 0;
      document.querySelectorAll('[data-bind-container="sedex-valor"]').forEach(function (wrapper) {
        wrapper.style.display = isSim && valor > 0 ? '' : 'none';
      });
      document.querySelectorAll('[data-bind="sedex-valor"]').forEach(function (el) {
        el.textContent = formatMoney(valor);
      });
    }

    sel.addEventListener('change', atualizar);
    inputValor.addEventListener('input', atualizarValor);
    atualizar();
  }

  function gerarTextoWhatsappRevenda() {
    var produto = (document.getElementById('rev-produto').value || '').trim();
    var codigo = (document.getElementById('rev-codigo').value || '').trim();
    var valorUnit = document.querySelector('[data-bind="valor-unitario"]').textContent || '';
    var quantidade = document.querySelector('[data-bind="quantidade"]').textContent || '';
    var total = document.querySelector('[data-bind="total"]').textContent || '';
    var cnpj = (document.getElementById('rev-cnpj').value || '').trim();
    var estado = (document.getElementById('rev-estado').value || '').trim();
    var sedex = document.querySelector('[data-bind="sedex"]').textContent || '';
    var sedexValor = '';
    var sedexValorNode = document.querySelector('[data-bind="sedex-valor"]');
    if (sedexValorNode) {
      sedexValor = sedexValorNode.textContent || '';
    }

    var linhas = [];
    linhas.push('ORÇAMENTO REVENDA (WhatsApp)');
    linhas.push('');
    linhas.push('Produto: ' + (produto || '-'));
    linhas.push('Código: ' + (codigo || '-'));
    linhas.push('Quantidade: ' + (quantidade || '-'));
    linhas.push('Valor unitário: ' + (valorUnit ? 'R$ ' + valorUnit : '-'));
    linhas.push('Total: ' + (total ? 'R$ ' + total : '-'));
    linhas.push('CNPJ: ' + (cnpj || '-'));
    linhas.push('Estado: ' + (estado || '-'));
    linhas.push('Sedex: ' + (sedex || '-'));
    if (sedex && sedex.toLowerCase() === 'sim' && sedexValor) {
      linhas.push('Valor Sedex: R$ ' + sedexValor);
    }

    var texto = linhas.join('\n');
    var out = document.getElementById('rev-wpp-resultado');
    if (out) {
      out.value = texto;
    }

    var btnCopiar = document.getElementById('rev-wpp-copiar');
    if (btnCopiar) {
      btnCopiar.disabled = !texto.trim();
    }
  }

  function copiarTextoWhatsappRevenda() {
    var out = document.getElementById('rev-wpp-resultado');
    if (!out || !out.value.trim()) return;

    function feedback() {
      var btn = document.getElementById('rev-wpp-copiar');
      if (!btn) return;
      var original = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(function () {
        btn.textContent = original;
      }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out.value).then(feedback).catch(function () {
        out.removeAttribute('readonly');
        out.select();
        try { document.execCommand('copy'); } catch (e) {}
        out.setAttribute('readonly', 'readonly');
        window.getSelection().removeAllRanges();
        feedback();
      });
    } else {
      out.removeAttribute('readonly');
      out.select();
      try { document.execCommand('copy'); } catch (e) {}
      out.setAttribute('readonly', 'readonly');
      window.getSelection().removeAllRanges();
      feedback();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    atualizarDataAtual();
    bindTexto('rev-produto', 'produto');
    bindTexto('rev-codigo', 'codigo');
    bindTexto('rev-cnpj', 'cnpj');
    bindTexto('rev-estado', 'estado');
    initValoresProduto();
    initSedex();

    var btnGerar = document.getElementById('rev-wpp-gerar');
    var btnCopiar = document.getElementById('rev-wpp-copiar');
    if (btnGerar) btnGerar.addEventListener('click', gerarTextoWhatsappRevenda);
    if (btnCopiar) btnCopiar.addEventListener('click', copiarTextoWhatsappRevenda);
  });
})();
