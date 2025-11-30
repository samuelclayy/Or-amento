function gerarPDF(containerId, fileName) {
  var container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  var botao = document.querySelector('[data-pdf-button="' + containerId + '"]');
  if (botao) {
    botao.disabled = true;
    botao.textContent = 'Gerando PDF...';
  }

  var originalScrollY = window.scrollY;
  window.scrollTo(0, 0);

  html2canvas(container, { scale: 2, useCORS: true }).then(function (canvas) {
    var imgData = canvas.toDataURL('image/png');
    var pdf = new jspdf.jsPDF('p', 'mm', 'a4');

    var pageWidth = pdf.internal.pageSize.getWidth();
    var pageHeight = pdf.internal.pageSize.getHeight();

    var imgWidth = pageWidth;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;

    var position = 0;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      var totalPages = Math.ceil(imgHeight / pageHeight);
      for (var i = 0; i < totalPages; i++) {
        var srcY = (canvas.height / totalPages) * i;
        var srcHeight = canvas.height / totalPages;
        var pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcHeight;
        var ctx = pageCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcHeight, 0, 0, canvas.width, srcHeight);
        var pageImgData = pageCanvas.toDataURL('image/png');
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, pageHeight, undefined, 'FAST');
      }
    }

    pdf.save(fileName || 'documento.pdf');
    window.scrollTo(0, originalScrollY);
    if (botao) {
      botao.disabled = false;
      botao.textContent = 'Gerar PDF';
    }
  });
}
