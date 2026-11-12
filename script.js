//oh sofia vou escreve assim pra vc ve os codigo qq eu mudei ok

//darkmode
function abrirBar() {
  document.getElementById("sideBAR1").style.width = "215px";
  document.getElementById("main").style.marginLeft = "215px";
}

function fecharBar() {
  document.getElementById("sideBAR1").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}



const btndark = document.getElementById("toggle-dark")


btndark.addEventListener('click', ()=>{
    document.body.classList.toggle("dark-mode")
})



const PRECO_UNITARIO = 79.99;
const FRETE = 5.00;
const formatar = (v) => v.toFixed(2).replace('.', ',');
const API_URL = 'https://localhost:5001/api';



function lerPedido() {
  return { quantidade: 2, endereco: '', pagamento: '', ...JSON.parse(localStorage.getItem('pedido')) };
}
function salvarPedido(pedido) {
  localStorage.setItem('pedido', JSON.stringify(pedido));
}



async function enviarPedido(pedido) {
  try {
    await fetch({$API_URL}/pedidos, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });
  } catch (erro) { console.log('API fora do ar', erro); }
}



async function carregarImagem() {
  const img = document.querySelector('img[data-produto-id]');
  if (!img) return;
  try {
    const resp = await fetch({$API_URL}/produtos/{$img,dataset,produtoId}/imagem);
    if (!resp.ok) return;
    img.src = URL.createObjectURL(await resp.blob());
  } catch (erro) { console.log('Usando imagem local'); }
}

//invent//
const spanQtd = document.getElementById('quantidade');
if (spanQtd) {
  let qtd = parseInt(localStorage.getItem('quantidade')) || 2;
  const spanPreco = document.getElementById('preco');
  const inputEnd = document.getElementById('endereco');
  inputEnd.value = localStorage.getItem('endereco') || '';

  function atualizar() {
    spanQtd.textContent = qtd;
    spanPreco.textContent = formatar(qtd * PRECO_UNITARIO);
    localStorage.setItem('quantidade', qtd);
  }
  atualizar();

  document.getElementById('btn-mais').addEventListener('click', () => {
    qtd++;
    atualizar();
  });
  document.getElementById('btn-menos').addEventListener('click', () => {
    if (qtd > 1) { qtd--; atualizar(); }
  });

  document.getElementById('btn-continuar').addEventListener('click', () => {
    const endereco = inputEnd.value.trim();
    if (!endereco) {
      alert('Digite seu endereço de entrega!');
      return;
    }
    localStorage.setItem('endereco', endereco);
    window.location.href = 'invent2.html';
  });
}

//invent2//

const selectPag = document.getElementById('forma-pagamento');
if (selectPag) {
  const qtd = parseInt(localStorage.getItem('quantidade')) || 1;
  const itens = qtd * PRECO_UNITARIO;
  document.getElementById('qtd-resumo').textContent = qtd;
  document.getElementById('valor-itens').textContent = formatar(itens);
  document.getElementById('valor-frete').textContent = formatar(FRETE);
  document.getElementById('valor-total').textContent = formatar(itens + FRETE);

 
  selectPag.value = localStorage.getItem('pagamento') || '';
  selectPag.disabled = selectPag.value !== '';

  selectPag.addEventListener('change', () => {
    localStorage.setItem('pagamento', selectPag.value);
    selectPag.disabled = selectPag.value !== '';
  });
  document.getElementById('btn-trocar').addEventListener('click', () => {
    selectPag.disabled = false;
  });


  const painel = document.getElementById('painel-pagamento');
  document.getElementById('btn-pagar').addEventListener('click', () => {
    const forma = selectPag.value;
    if (!forma) {
      alert('Selecione uma forma de pagamento!');
      return;
    }
    painel.style.display = 'block';

    if (forma === 'pix') {
      const chave = crypto.randomUUID();
      painel.innerHTML = `
        <h3>Pague com Pix</h3>
        <p>Copie a chave abaixo:</p>
        <input type="text" id="chave-pix" value="${chave}" readonly size="40">
        <button type="button" id="btn-copiar">COPIAR</button>
        <br><br>
        <button type="button" id="btn-confirmar">JÁ PAGUEI</button>`;
      document.getElementById('btn-copiar').addEventListener('click', () => {
        navigator.clipboard.writeText(chave);
        alert('Chave copiada!');
      });
    } else if (forma === 'credito' || forma === 'debito') {
      painel.innerHTML = `
        <h3>Cartão de ${forma === 'credito' ? 'crédito' : 'débito'}</h3>
        <input type="text" placeholder="Número do cartão" maxlength="19"><br>
        <input type="text" placeholder="Nome no cartão"><br>
        <input type="text" placeholder="Validade (MM/AA)" maxlength="5">
        <input type="text" placeholder="CVV" maxlength="3"><br><br>
        <button type="button" id="btn-confirmar">CONFIRMAR PAGAMENTO</button>`;
    } else {
      painel.innerHTML = `
        <p>Pagamento será feito na entrega / boleto enviado por e-mail.</p>
        <button type="button" id="btn-confirmar">CONFIRMAR PEDIDO</button>`;
    }

    document.getElementById('btn-confirmar').addEventListener('click', () => {
      window.location.href = 'invent3.html';
    });
  });
}


//invent3//
const tituloPrevisao = document.getElementById('previsao');
if (tituloPrevisao) {
 
  document.getElementById('btn-comprovante').addEventListener('click', () => {
    const p = lerPedido();
    const texto = `PEDIDO - Power Up!\nQuantidade: ${p.quantidade}\nEndereço: ${p.endereco}\nPagamento: ${p.pagamento}\n`;
    const blob = new Blob([texto], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'comprovante.txt';
    link.click();
  });

  const hora = (min) => {
    const d = new Date(Date.now() + min * 60000);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  tituloPrevisao.textContent = `${hora(30)} - ${hora(45)}`;

 
  const endereco = lerPedido().endereco || 'Belo Horizonte';
  document.getElementById('mapa').src =
    'https://www.google.com/maps?q=' + encodeURIComponent(endereco) + '&output=embed';

 
  document.getElementById('btn-sim').addEventListener('click', () => {
    localStorage.removeItem('pedido');
    window.location.href = 'index.html';
  });
  document.getElementById('btn-nao').addEventListener('click', () => {
    document.getElementById('msg-nao').style.display = 'block';
  });
}