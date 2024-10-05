import { userSection, createOrderUser } from '../js/service.js';

export const createOrder = async () => {
  
  const userData = await userSection();
  if(userData.name){
    const userId = userData._id
    try {
      const dataOrder = await createOrderUser(userId);
      if (!dataOrder.res.ok) {
        showModalAlert('Falha no Pedido!!', dataOrder.data.message, closeModal);
      }
      const order = dataOrder.data;

      if(dataOrder.res.ok){
        showOrderConfirmation(order);
        return;
      }
      
    } catch (error) {
      console.error('Erro ao criar o pedido:', error.message);
      alert(`Erro: ${error.message}`);
      showModalAlert('Falha de conexão', error.message, closeModal)
    }
  }else{
    showModalAlert('Falha de conexão', 'Falha ao buscar Usuario', closeModal)
  }
}
function showOrderConfirmation(order) {
  const modal = document.getElementById('modal-order');
  const modalTitle = document.getElementById('modal-order-title');
  const modalMain = document.getElementById('modal-order-main');
  const modalFooter = document.getElementById('orderBtn');
  modalMain.innerHTML = '';
  modalTitle.textContent = 'Pedido Finalizado!';

  const orderMessage = document.createElement('span');
  orderMessage.textContent = `${order.message}`;
  orderMessage.classList.add('orderTextFormat');

  const orderNumber = document.createElement('span');
  orderNumber.textContent = `Pedido: ${order.order.orderNumber}`;
  orderNumber.classList.add('orderTextFormat');

  const orderStatus = document.createElement('span');
  orderStatus.textContent = `Status: ${order.order.status}`;
  orderStatus.classList.add('orderTextFormat');

  const qrCodeImage = document.createElement('img');
  qrCodeImage.src = order.qrCode;
  qrCodeImage.alt = 'QR Code para pagamento via Pix';

  const messagePayment = document.createElement('span');
  messagePayment.textContent = 'Após confirmação de pagamento o pedido sairá para entrega';
  messagePayment.classList.add('orderTextFormat');
  modalMain.appendChild(orderMessage);
  modalMain.appendChild(orderNumber);
  modalMain.appendChild(orderStatus);
  modalMain.appendChild(qrCodeImage);
  modalMain.appendChild(messagePayment);

  modalFooter.innerHTML = `
    <button type="button" id="finishOrder" class="ok">Finalizar</button>
  `;
  modal.style.display = 'block';
  const closeButton = document.getElementById('closeOrder');
  closeButton.onclick = function() {
    modal.style.display = 'none';
  };

  const finish = document.getElementById('finishOrder');
  finish.onclick = function() {
    reload();
  };

}
  
function showModalAlert(title, message, onConfirm) {
  const modal = document.getElementById("modal");
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").textContent = message;
  const okButton = document.getElementById("modalBtnOk");
  const cancelButton = document.getElementById("modalBtnCancel");

  okButton.onclick = function() {
    closeModal();
    onConfirm();      
  };

  cancelButton.style.display = "none";
  okButton.style.display = "block";
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

function reload() {
  window.location.reload();
}
