(function () {
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

  function initSelectProduto() {
    var select = document.getElementById('manut-produto');
    if (!select) return;
    function atualizar() {
      var texto = '';
      switch (select.value) {
        case 'cilindro': texto = 'Cilindro'; break;
        case 'bomba': texto = 'Bomba'; break;
        case 'valvula': texto = 'Válvula'; break;
        case 'unidade': texto = 'Unidade hidráulica'; break;
        default: texto = ''; break;
      }
      document.querySelectorAll('[data-bind="produto"]').forEach(function (el) {
        el.textContent = texto;
      });
    }
    select.addEventListener('change', atualizar);
    atualizar();
  }

  function bindArea(inputId, bindName) {
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

  document.addEventListener('DOMContentLoaded', function () {
    atualizarDataAtual();
    bindTexto('manut-nome', 'nome');
    bindTexto('manut-telefone', 'telefone');
    bindTexto('manut-codigo', 'codigo');
    initSelectProduto();
    bindArea('manut-problema', 'problema');
    bindArea('manut-observacoes', 'observacoes');
  });
})();
