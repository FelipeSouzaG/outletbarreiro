import { addItemCart, removeItemCart, getCart, clearCartUser } from "../js/service.js";
import { addressDataStatus } from './addressController.js';

let cartDataUser;
export const cartUserData = async () => {
  const dataCart = await getCart();
  const cart = dataCart.data;
  cartDataUser = cart;
  const cartUser = document.getElementById('cartUser');
  if (cart.items && cart.items.length > 0) {
    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartUser.textContent = totalQuantity;
  } else {
    cartUser.textContent = "0";
  }
}

const addOneToCart = async (productId) => {
  try {
    const dataAddCart = await addItemCart(productId);
    const updatedCart = dataAddCart.data;
    if (dataAddCart.res.ok) {      
      updateCartModal(updatedCart);
    } else {
      const errorData = updatedCart;
      if (errorData.message.includes("Estoque insuficiente")) {
        showModalAlert("Estoque insuficiente", errorData.message, closeModal);
      } else {
        console.error('Erro ao adicionar item ao carrinho:', errorData);
        showModalAlert("Erro no carrinho", errorData.message, closeModal);
      }
    }
  } catch (error) {
    showModalAlert("Erro de conexão", error.message, closeModal);
  }
  await cartUserData();
};

const removeOneFromCart = async (productId, itemName, currentQuantity) => {
  if (currentQuantity === 1) {
    showConfirmRemoveModal(productId, itemName);
    return;
  }else{
    removeOneFromCartConfirmed(productId)
  }
};

const removeOneFromCartConfirmed = async (productId) => {
  try {
    const dataRemoveCart = await removeItemCart(productId);
    const data = dataRemoveCart.data;

    if (dataRemoveCart.res.ok) {
      const cart = data.cart
      updateCartModal(cart);
    } else {
      const errorData = data.data
      console.error('Erro ao remover item do carrinho:', errorData);
    }
  } catch (error) {
    console.error('Erro de conexão ao remover item do carrinho:', error);
  }
  await cartUserData();
}; 

const showConfirmRemoveModal = (productId, itemName) => {
  const confirmRemoveModal = document.getElementById("modal");
  const confirmRemoveTitle = document.getElementById("modalTitle");
  const confirmRemoveMessage = document.getElementById("modalMessage");
  const confirmRemoveBtn = document.getElementById("modalBtnOk");
  const cancelRemoveBtn = document.getElementById("modalBtnCancel");

  confirmRemoveTitle.textContent = "Remover Item do Carrinho?";
  confirmRemoveMessage.textContent = itemName;

  confirmRemoveBtn.onclick = () => {
    confirmRemoveModal.style.display = "none";
    removeOneFromCartConfirmed(productId);
  };

  cancelRemoveBtn.onclick = () => {
    confirmRemoveModal.style.display = "none";
    return;
  };

  cancelRemoveBtn.style.display = "block";
  confirmRemoveModal.style.display = "block";
};

const cartUser = document.getElementById('cart');
cartUser.addEventListener('click', () => {
  const cart = cartDataUser;
  if(!cart.items){
    showModalAlert('Carrinho vazio!!', 'Adicione itens ao carrinho para comprar.', closeModal);
    return;
  }
  updateCartModal(cartDataUser);
});

const updateCartModal = (cart) => {
  const modal = document.getElementById("modal-user");
  const title = document.getElementById("modal-user-title");
  const content = document.getElementById("modal-user-main");
  const btnClose = document.getElementById("close");
  const footer = document.getElementById("modal-user-footer");

  title.textContent = '';
  content.innerHTML = '';
  footer.innerHTML = '';
  title.textContent = 'Revisão do carrinho';
  content.innerHTML = `
    <table id="cartTableReview" class="review-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <div class="review-total">    
        <span id="cartTotal">Total: R$ 0,00</span>
      </div>
  `;
  footer.innerHTML = `
    <button id="clearCart" class="cancel">Limpar</button> 
    <button id="nextCheckout" class="ok">Comprar</button>
  `;

  btnClose.onclick = function() {
    modal.style.display = "none";
  };
  
  modal.style.display = "block";     

  const addressCheck = document.getElementById('nextCheckout');
  addressCheck.addEventListener('click', async () => {
    await addressDataStatus();
  });

  const clearCart = document.getElementById('clearCart');
  clearCart.addEventListener('click', async () => {
    showModalConfirm('Confirma Remover!!', 'Remover todos os itens do carrinho?', cleardataCartUser)
  });

  const cartTableBody = document.querySelector("#cartTableReview tbody");
  cartTableBody.innerHTML = "";
  let total = 0;

  if (!cart || cart.items.length === 0) {
    modal.style.display = "none";
    showModalAlert("Carrinho vazio!", "Todos os itens foram excluídos do carrinho.", closeModal);
    return;
  }

  cart.items.forEach(item => {
    const row = document.createElement("tr");
    row.setAttribute("data-product-id", item.product._id);

    const nameCell = document.createElement("td");
    nameCell.textContent = item.product.name;
    row.appendChild(nameCell);

    const quantityCell = document.createElement("td");
    quantityCell.innerHTML = `
      <button class="btn-stock-review" data-action="remove">-</button>
      <span class="number-stock-review">${item.quantity}</span>
      <button class="btn-stock-review" data-action="add">+</button>
    `;
    row.appendChild(quantityCell);

    cartTableBody.appendChild(row);

    total += item.product.price * item.quantity;
  });

  document.getElementById("cartTotal").textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

  document.querySelectorAll(".btn-stock-review[data-action='remove']").forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.closest('tr').getAttribute('data-product-id');
      const itemName = button.closest('tr').querySelector('td').textContent;
      const currentQuantity = parseInt(button.nextElementSibling.textContent, 10);
      await removeOneFromCart(productId, itemName, currentQuantity);
    });
  });

  document.querySelectorAll(".btn-stock-review[data-action='add']").forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.closest('tr').getAttribute('data-product-id');
      await addOneToCart(productId);
    });
  });

  async function cleardataCartUser(){
    try {
      const dataClearCart = await clearCartUser();
    if(dataClearCart.res.ok){
        showModalAlert("Carrinho Vazio!", dataClearCart.data.message, closeModal);
        modal.style.display = "none";
      }else {
        showModalAlert("Não Removido!", dataClearCart.data.message, closeModal);
      }
    } catch (error) {
      showModalAlert("Erro de conexão", error.message, closeModal);
    }
    await cartUserData();
  }
}

export const addToCart = async (productId) => {
  try {
    const dataAddCart = await addItemCart(productId);
    const cart = dataAddCart.data;
    if (dataAddCart.res.ok) {
      const addedItem = cart.items.find(item => item.product._id === productId);
      const productName = addedItem.product.name;
      let cartSummary = `Foi adicionado 1 "${productName}" ao seu carrinho.`;
      showModalAlert("Adicionado ao Carrinho", cartSummary, closeModal);
    } else {
      showModalAlert("Não adicionado ao carrinho!", cart.message, closeModal);
    }
  } catch (error) {
    showModalAlert("Erro de conexão", error.message, closeModal);
  }
  await cartUserData();
};

export const removeFromCart = async (productId, productName) => {
  try {
    const dataRemoveCart = await removeItemCart(productId);
    const data = dataRemoveCart.data;
    if(data.message === 'Carrinho vazio.'){
      showModalAlert("Não removido!", data.message, closeModal);
      return;
    }else if(data.message === `Não há ${productName} no carrinho.`){
      showModalAlert("Não removido!", data.message, closeModal);
      return;
    }else{
      showModalAlert("Item removido!", data.message, closeModal);
    }  
  } catch (error) {
    console.error('Erro de conexão ao remover item do carrinho:', error);
    showModalAlert("Erro de conexão", error.message, closeModal);
  }
  await cartUserData();
};

export const addToCartPurchase = async (productId) => {
  try {
    const dataAddCart = await addItemCart(productId);
    const dataCart = dataAddCart.data;
    if (dataCart.items) {
      const cart = await getCart();
      if (cart.res.ok) {
        updateCartModal(cart.data);
      } else {
        showModalAlert("Falha no carrinho!", "Não está buscando carrinho do usuario", closeModal);
      }
    }else {
      showModalAlert("Erro no carrinho!", dataCart.message, closeModal);
    }
  } catch (error) {
    showModalAlert("Erro de conexão", `Falha ao inserir item no carrinho ${error.message}`, closeModal);
  }
  await cartUserData();
};

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
