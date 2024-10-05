import { userSection, userLogin, userRegister, userUpdate, userDelete } from "../js/service.js";
import { cartUserData } from './cartController.js';

document.addEventListener("DOMContentLoaded", async function () {
    
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration');
  let userData;
  
  const userStatus = async () => {

    if (token) {
      if (tokenExpiration && new Date() > new Date(tokenExpiration)) {
        showModalAlert("Sessão expirada!", "Por favor, faça login novamente.", logout);
      }
      
      userData = await userSection();
      
      if(userData.isAdmin){
        window.location.href = "./src/controller.html"
      }
      
      if(!userData.isAdmin){
        const cart = document.getElementById('cart');
        cart.classList.add("button-menu-cart");
        document.querySelector('.enter').classList.add("hidden");
        document.querySelector('.data-user').classList.remove('hidden');
        document.querySelector('.address-user').classList.remove('hidden'); 
        await cartUserData()       
      }

    }
  }

  await userStatus();

  document.getElementById('login').addEventListener('click', () => {
    showModalLogin()
  });
  
  function showModalLogin() {
    const modal = document.getElementById("modal-user");
    const title = document.getElementById("modal-user-title");
    const content = document.getElementById("modal-user-main");
    const btnClose = document.getElementById("close");
    const footer = document.getElementById("modal-user-footer");

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Entrar';
    content.innerHTML = `
      <form id="formLogin" class="form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input type="password" id="password" name="password" autocomplete="off" required>
        </div>
        <div class="btn">
          <button type="submit" id="submit" class="ok">Entrar</button>
        </div>
      </form>
    `;
    footer.innerHTML = `
      <a href="#" id="register">Registre-se</a>
    `;

    btnClose.onclick = function() {
      modal.style.display = "none";
    };
    
    modal.style.display = "block";     

    const form = document.getElementById('formLogin');
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      if(email === ''){
        showModalAlert('E-mail!!', 'Digite seu e-mail', closeModal);
        return
      }

      if(password === ''){
        showModalAlert('Senha!!', 'Digite a senha', closeModal);
        return
      }

      try {
        const userData = await userLogin(email, password);
        if(userData.token){
          localStorage.setItem("token", userData.token);
          const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000 * 2 - 1);
          localStorage.setItem("tokenExpiration", expirationTime.toISOString());
          const userInfo = await userSection(userData.token);
          if(userInfo.name){
            showModalAlert("Sessão iniciada", `Olá ${userInfo.name}!`, reload);
          } else {
            showModalAlert("Erro de Sessão!", "Falha ao obter dados do usuário.", closeModal);
          }
        } else {
          showModalAlert("Erro de login", userData.message, closeModal);
        }
      } catch (error) {
        showModalAlert("Erro de conexão", error.message, closeModal);
      }
    });

    const modalRegister = document.getElementById('register');
    modalRegister.addEventListener('click', () => {
      showModalRegister()
    });

  }

  function showModalRegister() {
    const modal = document.getElementById("modal-user");
    const title = document.getElementById("modal-user-title");
    const content = document.getElementById("modal-user-main");
    const btnClose = document.getElementById("close");
    const footer = document.getElementById("modal-user-footer");

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Registre-se';
    content.innerHTML = `
      <form id="formRegister" class="form">
        <div class="form-group">
          <label for="name">Nome:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input type="password" id="password" name="password" required>
        </div>
      </form>
    `;
    footer.innerHTML = `
      <div class="btn">
        <button id="submit" class="ok">Enviar</button>
      </div>
    `;

    btnClose.onclick = function() {
      modal.style.display = "none";
    };
 
    modal.style.display = "block";

    const send = document.getElementById('submit');
    send.addEventListener("click", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const isAdmin = false;

      if(name === ''){
        showModalAlert('Nome!!', 'Digite seu nome', closeModal);
        return
      }

      if(email === ''){
        showModalAlert('E-mail!!', 'Digite seu e-mail', closeModal);
        return
      }

      if(password === ''){
        showModalAlert('Senha!!', 'Digite a senha', closeModal);
        return
      }

      try {
        const data = await userRegister(name, email, password, isAdmin);
        if (data.res.ok) {
          showModalAlert("Usuário cadastrado!", "Faça login com seus dados.", showModalLogin);
        } else {
          showModalAlert("Não cadastrado!", data.data.message, closeModal);
        }
      } catch (error) {
        showModalAlert("Erro de conexão", error.message, closeModal);
      }
    });
  }

  document.getElementById('dataUser').addEventListener('click', () => {
    showModalUser();
  });

  function showModalUser() {
    const modal = document.getElementById("modal-user");
    const title = document.getElementById("modal-user-title");
    const content = document.getElementById("modal-user-main");
    const btnClose = document.getElementById("close");
    const footer = document.getElementById("modal-user-footer");

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Dados do Usuário';
    content.innerHTML = `
      <form id="formUser"  class="form">
        <div class="form-group">
          <label for="name">Nome:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input type="password" id="password" name="password" required>
        </div>
      </form>
    `;
    footer.innerHTML = `
      <div class="btn">
        <button id="submit" class="ok">Enviar</button>
      </div>
    `;

    btnClose.onclick = function() {
      modal.style.display = "none";
    };
   
    modal.style.display = "block";

    const name = document.getElementById("name");
    const email = document.getElementById("email");

    name.value = userData.name;
    email.value = userData.email;

    const send = document.getElementById('submit');
    send.addEventListener("click", async (event) => {
      event.preventDefault();
            
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const isAdmin = false;
      
      if(name === ''){
        showModalAlert('Nome!!', 'Digite seu nome', closeModal);
        return
      }

      if(email === ''){
        showModalAlert('E-mail!!', 'Digite seu e-mail', closeModal);
        return
      }

      if(password === ''){
        showModalAlert('Senha!!', 'Digite a senha', closeModal);
        return
      }

      try {
        const data = await userUpdate(name, email, password, isAdmin);
        if (data.res.ok) {
          showModalAlert("Dados alterados!", "Dados de usuário atualizados", reload);
        } else {
          showModalAlert("Não alterado!", "Houve um erro ao alterar os dados. Verifique o e-mail e senha e tente novamente.", closeModal);
        }
      } catch (error) {
        showModalAlert("Erro de conexão!!", error.message, closeModal);
      }
    });
  }

  document.getElementById('logout-section').addEventListener('click', () => {
    showModalLogoff();
  });

  function showModalLogoff() {
    const modal = document.getElementById("modal-user");
    const title = document.getElementById("modal-user-title");
    const content = document.getElementById("modal-user-main");
    const btnClose = document.getElementById("close");
    const footer = document.getElementById("modal-user-footer");

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Confirmar Logout!';
    content.innerHTML = `<p>Deseja mesmo sair?</p>`;
    footer.innerHTML = `
      <button id="exitAccount" class="ok">Sim</button>
      <button id="cancel" class="cancel">Não</button>
    `;
    
    btnClose.onclick = function() {
      modal.style.display = "none";
    };
   
    modal.style.display = "block";

    const cancel = document.getElementById('cancel');
    cancel.addEventListener('click', () => {
      modal.style.display = "none";
    });  

    const exit = document.getElementById('exitAccount');
    exit.addEventListener('click', () => {
      modal.style.display = "none";
      logout()
    });
  };

  document.getElementById('deleteAccountBtn').addEventListener('click', () => {
    deleteAccountBtn();
  });

  function deleteAccountBtn() {
    const modal = document.getElementById("modal-user");
    const title = document.getElementById("modal-user-title");
    const content = document.getElementById("modal-user-main");
    const btnClose = document.getElementById("close");
    const footer = document.getElementById("modal-user-footer");

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Confirmar Exclusão!';
    content.innerHTML = `<p>Deseja mesmo excluir sua conta?</p>`;
    footer.innerHTML = `
      <button id="deleteAccount" class="ok">Sim</button>
      <button id="cancel" class="cancel">Não</button>
    `;
    
    btnClose.onclick = function() {
      modal.style.display = "none";
    };
   
    modal.style.display = "block";

    const cancel = document.getElementById('cancel');
    cancel.addEventListener('click', () => {
      modal.style.display = "none";
    });  

    const deleteAccountUser = document.getElementById('deleteAccount');
    deleteAccountUser.addEventListener('click', async () => {      
      try {
        const data = await userDelete();
        if (data.message==="Usuário removido com sucesso.") {
          document.getElementById("modal-user").style.display = "none";
          showModalAlert("Conta Excluída!!", "Usuário removido. Volte quando quiser!", logout);
          
        } else {
          showModalAlert("Não Removido!", data.message, closeModal);
        }
      } catch (error) {
        showModalAlert("Erro de conexão", error.message, closeModal);
      }
    });
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
  
  function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }

  function reload() {
    window.location.reload();
  }

  function logout() {    
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    reload();   
  }

});
