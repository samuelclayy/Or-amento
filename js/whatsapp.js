(function () {
  function formatMoney(value) {
    var n = parseFloat((value || '').toString().replace(',', '.'));
    if (isNaN(n)) return '';
    return n.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function gerarTextoWhatsapp() {
    var produto = document.getElementById('wpp-produto').value.trim();
    var valorRaw = document.getElementById('wpp-valor').value;
    var valor = formatMoney(valorRaw);
    var imediato = document.getElementById('wpp-imediato').value || '';
    var imposto = document.getElementById('wpp-imposto').value.trim();
    var obs = document.getElementById('wpp-observacoes').value.trim();

    var linhas = [];
    linhas.push('ORÇAMENTO (WhatsApp)');
    linhas.push('');
    linhas.push('Produto: ' + (produto || '-'));
    linhas.push('Valor: ' + (valor ? 'R$ ' + valor : '-'));
    linhas.push('Imediato: ' + (imediato || '-'));
    linhas.push('Frete: FOB');
    linhas.push('Imposto (revenda/lucro presumido): ' + (imposto || '-'));
    linhas.push('');
    linhas.push('*Observações opcionais:*');
    linhas.push(obs || '-');

    var textoFinal = linhas.join('\n');

    var resultado = document.getElementById('wpp-resultado');
    resultado.value = textoFinal;

    var botaoCopiar = document.getElementById('wpp-copiar');
    botaoCopiar.disabled = !textoFinal.trim();
  }

  function copiarTextoWhatsapp() {
    var resultado = document.getElementById('wpp-resultado');
    if (!resultado.value.trim()) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(resultado.value).then(function () {
        mostrarFeedbackCopia();
      }).catch(function () {
        fallbackSelecao(resultado);
      });
    } else {
      fallbackSelecao(resultado);
    }
  }

  function fallbackSelecao(textarea) {
    textarea.removeAttribute('readonly');
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      // se não copiar, o usuário ainda pode usar Ctrl+C
    }
    textarea.setAttribute('readonly', 'readonly');
    window.getSelection().removeAllRanges();
    mostrarFeedbackCopia();
  }

  function mostrarFeedbackCopia() {
    var botao = document.getElementById('wpp-copiar');
    var textoOriginal = botao.textContent;
    botao.textContent = 'Copiado!';
    setTimeout(function () {
      botao.textContent = textoOriginal;
    }, 1800);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btnGerar = document.getElementById('wpp-gerar');
    var btnCopiar = document.getElementById('wpp-copiar');

    if (btnGerar) {
      btnGerar.addEventListener('click', gerarTextoWhatsapp);
    }
    if (btnCopiar) {
      btnCopiar.addEventListener('click', copiarTextoWhatsapp);
    }
  });
})();
