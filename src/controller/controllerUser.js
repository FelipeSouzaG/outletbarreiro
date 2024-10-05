import { userSection, userRegister, userUpdate, allUser, userDeleteAdmin } from "../js/service.js";

document.addEventListener("DOMContentLoaded", async function () {
   
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration');
  let userData;

  if (!token) {
   logout();
  }
  
  const userStatus = async () => {

    if (token) {
      if (tokenExpiration && new Date() > new Date(tokenExpiration)) {
        showModalAlert("Sessão expirada!", "Por favor, faça login novamente.", logout);
      }
      
      userData = await userSection();
      
      if(!userData.isAdmin){
       logout();
      }

    }
  }

  await userStatus();

  const modalRegister = document.getElementById('register-user');
  modalRegister.addEventListener('click', () => {
    showModalRegister()
  });  

  function showModalRegister() {
    const modal = document.getElementById("modal-user");
    const title = document.getElementById("modal-user-title");
    const content = document.getElementById("modal-user-main");
    const btnClose = document.getElementById("close");
    const footer = document.getElementById("modal-user-footer");

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Registrar Admin';
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
      const isAdmin = true;

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
          showModalAlert("Usuário cadastrado!", `Administrador ${name} cadastrado com email: ${email}.`, closeModal);
          modal.style.display = "none";
         } else {
          showModalAlert("Não cadastrado!", data.data.message, closeModal);
        }
      } catch (error) {
        showModalAlert("Erro de conexão", error.message, closeModal);
      }
    });
  }

  const dataUser = document.getElementById('data-user');
  dataUser.addEventListener('click', () => {
    showModalUser()
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
    title.textContent = 'Dados do Usuário Admin';
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
      const isAdmin = true;

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

  const listUser = document.getElementById('list-user');
  listUser.addEventListener('click', () => {
    showModalListUser();
  });

  async function showModalListUser() {

   const users = await allUser();

    const modal = document.getElementById("modal-user");
    const title = document.getElementById("modal-user-title");
    const content = document.getElementById("modal-user-main");
    const btnClose = document.getElementById("close");
    const footer = document.getElementById("modal-user-footer");

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Usuarios do Site';
    content.innerHTML = `
      <div class="title-details">
        <label><input type="radio" name="user-filter" value="all" checked> Todos</label>
        <label><input type="radio" name="user-filter" value="admin"> Administradores</label>
        <label><input type="radio" name="user-filter" value="user"> Usuários</label>
      </div>
      <table class="details-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr data-user-id="${user._id}">
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>
                <div class="center">
                  <button class="delete-btn">&times;</button>
                  <button class="edit-btn">&#9998;</button>
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

    const filters = document.querySelectorAll('input[name="user-filter"]');
    filters.forEach(filter => {
      filter.addEventListener('change', () => {
        const filterValue = filter.value;

        document.querySelectorAll('.details-table tbody tr').forEach(row => {
          row.style.display = '';
        });

        if (filterValue === 'admin') {
          document.querySelectorAll('.details-table tbody tr').forEach(row => {
            const isAdmin = users.find(user => user._id === row.getAttribute('data-user-id')).isAdmin;
            if (!isAdmin) row.style.display = 'none';
          });
        } else if (filterValue === 'user') {
          document.querySelectorAll('.details-table tbody tr').forEach(row => {
            const isAdmin = users.find(user => user._id === row.getAttribute('data-user-id')).isAdmin;
            if (isAdmin) row.style.display = 'none';
          });
        }
      });
    });
    const deleteButtons = document.querySelectorAll('.delete-btn');
     deleteButtons.forEach(btn => {
       btn.addEventListener('click', async (e) => {
         const userId = e.target.closest('tr').getAttribute('data-user-id');
         showModalConfirm("Confirma Excluir?", "Deseja maesmo excluir esse usuário?", () => {
           deleteAccountUser(userId);
         });
       });
     });
     async function deleteAccountUser(userId) {
      try {
       const response = await userDeleteAdmin(userId);
       if (response.message === "Usuário removido com sucesso.") {
         modal.style.display = "none"
         showModalAlert("Usuário Excluído", "Usuário removido com sucesso!", closeModal);
         showModalListUser();
       } else {
         showModalAlert("Erro", response.message, closeModal);
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

  function reload() {
    window.location.reload();
  }

  function logout() {    
   localStorage.removeItem("token");
   localStorage.removeItem("tokenExpiration");
   window.location.href = "../../index.html"   
  }

});
