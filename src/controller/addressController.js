import {
  userAddress,
  createAddress,
  editAddress,
  deleteAddress,
} from '../js/service.js';
import { createOrder } from './orderController.js';

let dataAddress;
let mode;
let type;

const userAddressData = async () => {
  try {
    const addresses = await userAddress();

    if (addresses.data.length > 0) {
      dataAddress = addresses.data[0];
    } else {
      dataAddress = null;
    }
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    dataAddress = null;
  }
};

async function resetModal() {
  const postalCode = document.getElementById('postalCode');
  document.getElementById('formAddress').reset();
  document.getElementById('street').textContent = '';
  document.getElementById('district').textContent = '';
  document.getElementById('city').textContent = '';
  document.getElementById('state').textContent = '';
  document.getElementById('tarifa').textContent = '';
  postalCode.style.backgroundColor = '';
  postalCode.style.color = '';
  await addressStatus();
}

document.getElementById('dataAddress').addEventListener('click', async () => {
  type = 'address';
  await resetModal();
  await addressStatus();
});

async function addressStatus() {
  await userAddressData();
  if (dataAddress && dataAddress._id) {
    mode = 'edit';
  } else {
    mode = 'create';
  }
  await showModalAddress(dataAddress, mode, type);
}

async function showModalAddress(data, mode, type) {
  const modal = document.getElementById('modal-address');
  const subTitle = document.getElementById('subTitle');
  const bodyForm = document.getElementById('form-address-data');
  const tarifa = document.getElementById('formAddressTarifa');
  const btnClose = document.getElementById('closeAddress');
  const btnAction = document.getElementById('actionBtn');
  const footerBtn = document.getElementById('formBtn');

  bodyForm.classList.remove('form-address-data');
  tarifa.classList.remove('form-group-two');
  if (mode === 'edit') {
    if (type === 'shop') {
      footerBtn.innerHTML = `
          <span id="addressFooterCode" class="hidden"></span>
          <button type="button" id="backCheckCart" class="cancel">Anterior</button>
          <button type="button" id="nextCheckOrder" class="ok">Próximo</button>
        `;
    }
    if (type === 'address') {
      footerBtn.innerHTML = `
          <span id="addressFooterCode">Endereço de entrega válido</span>
        `;
    }
    btnAction.innerHTML = `
        <button type="button" id="deleteBtn" class="cancel">Excluir Endereço</button>
        <button type="button" id="editBtn" class="hidden">Salvar</button>
      `;
    populate(data);
    subTitle.textContent = 'Digite outro CEP para alterar o Endereço';
    tarifa.classList.add('form-group-two');
    bodyForm.classList.add('form-address-data');
  }

  if (mode === 'create') {
    bodyForm.classList.add('hidden');
    tarifa.classList.add('hidden');
    subTitle.classList.add('hidden');
    btnAction.innerHTML = `
        <button type="button" id="createBtn" class="hidden">Cadastrar</button>
      `;
    footerBtn.innerHTML = `
        <span id="addressFooterCode">Digite o CEP do Endereço.</span>
      `;
  }

  btnClose.onclick = function () {
    modal.style.display = 'none';
  };

  modal.style.display = 'block';

  const postalCode = document.getElementById('postalCode');
  const street = document.getElementById('street');
  const number = document.getElementById('number');
  const complement = document.getElementById('complement');
  const district = document.getElementById('district');
  const city = document.getElementById('city');
  const state = document.getElementById('state');

  if (document.getElementById('backCheckCart')) {
    document
      .getElementById('backCheckCart')
      .addEventListener('click', async () => {
        modal.style.display = 'none';
      });
  }

  //inserir mais dados antes de checkout
  if (document.getElementById('nextCheckOrder')) {
    document
      .getElementById('nextCheckOrder')
      .addEventListener('click', async () => {
        showModalConfirm('Confirma Pedido!!', 'Finalizar pedido?', async () => {
          await createOrder();
        });
      });
  }

  if (document.getElementById('deleteBtn')) {
    document.getElementById('deleteBtn').addEventListener('click', async () => {
      showModalConfirm(
        'Confirma Excluir!!',
        'Deseja excluir endereço?',
        async () => {
          document.getElementById('modal-address').style.display = 'none';
          try {
            const data = await deleteAddress(dataAddress._id);
            if (data.res.ok) {
              showModalAlert(
                'Endereço excluído!',
                data.data.message,
                resetModal
              );
            } else {
              showModalAlert('Não excluído!', data.data.message, addressStatus);
            }
          } catch (error) {
            showModalAlert('Erro de conexão', error.message, closeModal);
          }
        }
      );
    });
  }

  if (document.getElementById('editBtn')) {
    document.getElementById('editBtn').addEventListener('click', async () => {
      if (postalCode.value === '') {
        showModalAlert(
          'CEP Obrigatório',
          'Digite o CEP do endereço de entrega',
          resetModal
        );
        return;
      }
      if (
        street.textContent === '' ||
        district.textContent === '' ||
        city.textContent === '' ||
        state.textContent === ''
      ) {
        showModalAlert(
          'Endereço Obrigatório',
          'Digite um CEP válido para carregar o endereço de entrega',
          closeModal
        );
        return;
      }
      if (number.value === '') {
        showModalAlert(
          'Número Obrigatório',
          'Digite o número do endereço de entrega',
          closeModal
        );
        return;
      }

      try {
        const data = await editAddress(
          dataAddress._id,
          postalCode.value,
          street.textContent,
          number.value,
          complement.value,
          district.textContent,
          city.textContent,
          state.textContent
        );
        if (data.res.ok) {
          showModalAlert('Endereço alterado!', data.data.message, resetModal);
        } else {
          showModalAlert('Não alterado!', data.data.message, addressStatus);
        }
      } catch (error) {
        showModalAlert('Erro de conexão', error.message, closeModal);
      }
    });
  }

  if (document.getElementById('createBtn')) {
    document.getElementById('createBtn').addEventListener('click', async () => {
      if (postalCode.value === '') {
        showModalAlert(
          'CEP Obrigatório!!',
          'Digite o CEP do endereço de entrega',
          closeModal
        );
        return;
      }
      if (
        street.textContent === '' ||
        district.textContent === '' ||
        city.textContent === '' ||
        state.textContent === ''
      ) {
        showModalAlert(
          'Endereço Obrigatório!!',
          'Digite um CEP válido para carregar o endereço de entrega',
          closeModal
        );
        return;
      }
      if (number.value === '' || number.value < 1) {
        showModalAlert(
          'Número Inválido!!',
          'Digite um número válido para o endereço.',
          closeModal
        );
        return;
      }
      try {
        const data = await createAddress(
          postalCode.value,
          street.textContent,
          number.value,
          complement.value,
          district.textContent,
          city.textContent,
          state.textContent
        );
        console.log(data);
        if (data.res.ok) {
          document.getElementById('modal-address').style.display = 'none';
          showModalAlert('Endereço cadastrado!', data.data.message, resetModal);
        } else {
          showModalAlert('Não cadastrado!', data.data.message, closeModal);
        }
      } catch (error) {
        showModalAlert('Erro de conexão', error.message, closeModal);
      }
    });
  }

  function populate(data) {
    document.getElementById('street').textContent = data.street;
    document.getElementById('number').value = data.number;
    document.getElementById('complement').value = data.complement || '';
    document.getElementById('district').textContent = data.district;
    document.getElementById('city').textContent = data.city;
    document.getElementById('state').textContent = data.state;
    document.getElementById('postalCode').value = data.postalCode;
    //document.getElementById("tarifa").textContent = "Entrega grátis para esse endereço!";
    // Formatando a tarifa
    const formattedTarifa = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(data.tarifa);

    document.getElementById('tarifa').textContent = formattedTarifa || '';
  }

  const postalCodeInput = document.getElementById('postalCode');
  const numberInput = document.getElementById('number');

  postalCodeInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  numberInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  postalCodeInput.addEventListener('input', formatPostalCode);
  postalCodeInput.addEventListener('input', checkPostalCodeLength);
  numberInput.addEventListener('input', formatNumber);

  function formatPostalCode(event) {
    const input = event.target;
    input.value = input.value.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  function formatNumber(event) {
    const input = event.target;
    input.value = input.value.replace(/^0+/, '');
  }

  async function checkPostalCodeLength(event) {
    const input = event.target;
    const addressDataDiv = document.getElementById('form-address-data');
    const addressFooterCode = document.getElementById('addressFooterCode');
    const subTitle = document.getElementById('subTitle');
    const numberField = document.getElementById('number');
    const complementField = document.getElementById('complement');
    const addressTarifa = document.getElementById('formAddressTarifa');
    const deleteBtn = document.getElementById('deleteBtn');
    const editBtn = document.getElementById('editBtn');
    const createBtn = document.getElementById('createBtn');
    const backCheckCart = document.getElementById('backCheckCart');
    const nextCheckOrder = document.getElementById('nextCheckOrder');
    addressDataDiv.classList.remove('form-address-data');
    subTitle.classList.add('hidden');
    addressDataDiv.classList.add('hidden');
    const length = input.value.length;
    if (addressTarifa) {
      addressTarifa.classList.remove('form-group-two');
      addressTarifa.classList.add('hidden');
    }
    if (backCheckCart) {
      backCheckCart.classList.remove('cancel');
      backCheckCart.classList.add('hidden');
    }
    if (backCheckCart) {
      nextCheckOrder.classList.remove('ok');
      nextCheckOrder.classList.add('hidden');
    }
    if (deleteBtn) {
      deleteBtn.classList.remove('cancel');
      deleteBtn.classList.add('hidden');
    }
    if (addressFooterCode) {
      addressFooterCode.classList.remove('hidden');
      addressFooterCode.textContent = 'Digite o CEP do endereço';
    }

    if (length === 9) {
      const isValid = await reqPostalCode(input.value);
      if (isValid) {
        input.style.backgroundColor = 'green';
        input.style.color = 'white';
        addressDataDiv.classList.remove('hidden');
        addressDataDiv.classList.add('form-address-data');
        if (addressFooterCode) {
          addressFooterCode.classList.remove('hidden');
          addressFooterCode.textContent = 'Digite o número do Endereço';
        }
        complementField.value = '';
        numberField.value = '';
        numberField.disabled = false;
        numberField.focus();
        numberField.addEventListener('keyup', () => {
          if (numberField.value !== '' && numberField.value > 0) {
            if (mode === 'edit') {
              if (editBtn) {
                editBtn.classList.remove('hidden');
                editBtn.classList.add('ok');
              }
              if (addressFooterCode) {
                addressFooterCode.classList.remove('hidden');
                addressFooterCode.textContent = 'Endereço válido para alterar';
              }
            }
            if (mode === 'create') {
              if (createBtn) {
                createBtn.classList.remove('hidden');
                createBtn.classList.add('ok');
              }
              if (addressFooterCode) {
                addressFooterCode.classList.remove('hidden');
                addressFooterCode.textContent =
                  'Endereço válido para cadastrar';
              }
            }
          } else {
            if (mode === 'edit') {
              if (editBtn) {
                editBtn.classList.remove('ok');
                editBtn.classList.add('hidden');
              }
              if (addressFooterCode) {
                addressFooterCode.classList.remove('hidden');
                addressFooterCode.textContent = 'Digite o número do Endereço';
              }
            }
            if (mode === 'create') {
              if (createBtn) {
                createBtn.classList.remove('ok');
                createBtn.classList.add('hidden');
              }
              if (addressFooterCode) {
                addressFooterCode.classList.remove('hidden');
                addressFooterCode.textContent = 'Digite o número do Endereço';
              }
            }
          }
        });
      } else {
        input.style.backgroundColor = 'red';
        input.style.color = 'white';
        if (addressFooterCode) {
          addressFooterCode.classList.remove('hidden');
          addressFooterCode.textContent = 'CEP inválido!';
        }
      }
    } else {
      input.style.backgroundColor = '';
      input.style.color = '';
      if (addressFooterCode) {
        addressFooterCode.classList.remove('hidden');
        addressFooterCode.textContent = 'Digite o CEP do endereço';
      }
    }
  }

  async function reqPostalCode(code) {
    try {
      const postalCodeQuery = await fetch(
        `https://viacep.com.br/ws/${code}/json/`
      );
      const postalCodeData = await postalCodeQuery.json();
      if (postalCodeData.erro) {
        return false;
      }
      document.getElementById('street').textContent = postalCodeData.logradouro;
      document.getElementById('district').textContent = postalCodeData.bairro;
      document.getElementById('city').textContent = postalCodeData.localidade;
      document.getElementById('state').textContent = postalCodeData.uf;
      return true;
    } catch (error) {
      showModalAlert('CEP inexistente!!', error, closeModal);
      return false;
    }
  }
}

function showModalAlert(title, message, onConfirm) {
  const modal = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  const okButton = document.getElementById('modalBtnOk');
  const cancelButton = document.getElementById('modalBtnCancel');
  okButton.onclick = function () {
    closeModal();
    onConfirm();
  };
  cancelButton.style.display = 'none';
  okButton.style.display = 'block';
  modal.style.display = 'block';
}

function showModalConfirm(title, message, onConfirm) {
  const modal = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  const okButton = document.getElementById('modalBtnOk');
  const cancelButton = document.getElementById('modalBtnCancel');
  okButton.onclick = function () {
    onConfirm();
    closeModal();
  };
  cancelButton.style.display = 'inline-block';
  cancelButton.onclick = closeModal;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

export async function addressDataStatus() {
  type = 'shop';
  await addressStatus();
}
