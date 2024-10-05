import { allOrders, updateOrderAdmin } from "../js/service.js";

document.addEventListener("DOMContentLoaded", async function () {
  
  const listOrder = document.getElementById('list-order');
  listOrder.addEventListener('click', () => { 
   showModalListOrder();
  });

  async function showModalListOrder() {

   const response = await allOrders();
   const orders = response.data;

    const modal = document.getElementById("modal-user");
    const title = document.getElementById("modal-user-title");
    const content = document.getElementById("modal-user-main");
    const btnClose = document.getElementById("close");
    const footer = document.getElementById("modal-user-footer");

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Controle de Pedidos';
    content.innerHTML = `
      <div class="title-details">
        <label><input type="radio" name="order-filter" value="all" checked> Todos </label>
        <label><input type="radio" name="order-filter" value="delivery"> Entrega </label>
      </div>
      <table class="details-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr data-order-id="${order._id}">
              <td>${order.orderNumber}</td>
              <td>${order.status}</td>
              <td>
                <div class="center">
                  <button class="update-btn">&#9998</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    footer.innerHTML = '';

    btnClose.onclick = function () {
      modal.style.display = "none";
    };
    
    modal.style.display = "block";

    const filters = document.querySelectorAll('input[name="order-filter"]');
    filters.forEach(filter => {
      filter.addEventListener('change', () => {
        const filterValue = filter.value;

        document.querySelectorAll('.details-table tbody tr').forEach(row => {
          row.style.display = '';
        });

        if (filterValue === 'delivery') {
          document.querySelectorAll('.details-table tbody tr').forEach(row => {
            const delivery = orders.find(order => order._id === row.getAttribute('data-order-id')).delivery;
            if (!delivery) row.style.display = 'none';
          });
        } 
      });
    });
    const updateButtons = document.querySelectorAll('.update-btn');
     updateButtons.forEach(btn => {
       btn.addEventListener('click', async (e) => {
         const orderId = e.target.closest('tr').getAttribute('data-order-id');
         showModalConfirm("Confirma Alterar?", "Alterar Status do pedido para Pedido em Entrega?", () => {
           updateOrder(orderId);
         });
       });
     });
     async function updateOrder(orderId) {
      try {
       const response = await updateOrderAdmin(orderId);
       if (response.data.message === "Status alterado.") {
         modal.style.display = "none"
         showModalAlert("Pedido Alterado!", "Status do pedido alterado para Pedido em Entrega", closeModal);
         showModalListOrder();
       } else {
         showModalAlert("Erro", response.data.message, closeModal);
       }
      } catch (error) {
       showModalAlert("Erro de conexão", error.message, closeModal);
      }
     }
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

  function showModalConfirm(title, message, onConfirm) {
    const modal = document.getElementById("modal");
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalMessage").textContent = message;
    const okButton = document.getElementById("modalBtnOk");
    const cancelButton = document.getElementById("modalBtnCancel");

    okButton.onclick = function() {
      onConfirm();
      closeModal();
    };

    cancelButton.style.display = "inline-block";
    cancelButton.onclick = closeModal;
    modal.style.display = "block";
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }

});
