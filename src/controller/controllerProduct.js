import {
  publicProducts,
  sendProductData,
  productDelete,
} from '../js/service.js';

document.addEventListener('DOMContentLoaded', async function () {
  const listProduct = document.getElementById('list-product');
  listProduct.addEventListener('click', () => {
    showModalListProduct();
  });

  async function showModalListProduct() {
    const response = await publicProducts();
    const products = response.data;

    let filteredProducts = products;

    const modal = document.getElementById('modal-user');
    const title = document.getElementById('modal-user-title');
    const content = document.getElementById('modal-user-main');
    const btnClose = document.getElementById('close');
    const footer = document.getElementById('modal-user-footer');

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Produtos do Site';
    content.innerHTML = `
    <div class="title-details">
      <label>Categoria: 
        <select id="filter-category">
          <option value="">Todas</option>
          ${[...new Set(products.map((product) => product.category))]
            .map(
              (category) => `
            <option value="${category}">${category}</option>
          `
            )
            .join('')}
        </select>
      </label>
      <label>Tipo: 
        <select id="filter-type" disabled>
          <option value="">Selecione uma categoria</option>
        </select>
      </label>
      <label>Marca: 
        <select id="filter-brand" disabled>
          <option value="">Selecione um tipo</option>
        </select>
      </label>
      <button id="clear-filters">Limpar Filtros</button>
    </div>
    <table class="details-table">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Preço</th>
          <th>Estoque</th>
          <th>Excluir</th>
        </tr>
      </thead>
      <tbody id="product-list">
        ${renderProductRows(filteredProducts)}
      </tbody>
    </table>
  `;

    footer.innerHTML = '';

    modal.style.display = 'block';

    const categoryFilter = document.getElementById('filter-category');
    const typeFilter = document.getElementById('filter-type');
    const brandFilter = document.getElementById('filter-brand');
    const clearFiltersButton = document.getElementById('clear-filters');
    const productList = document.getElementById('product-list');

    categoryFilter.addEventListener('change', () => {
      const selectedCategory = categoryFilter.value;
      filteredProducts = products.filter(
        (product) => !selectedCategory || product.category === selectedCategory
      );

      const filteredTypes = [
        ...new Set(filteredProducts.map((product) => product.type)),
      ];
      typeFilter.innerHTML =
        `<option value="">Selecione um tipo</option>` +
        filteredTypes
          .map(
            (type) => `
      <option value="${type}">${type}</option>
    `
          )
          .join('');
      typeFilter.disabled = !selectedCategory;

      brandFilter.innerHTML = '<option value="">Selecione um tipo</option>';
      brandFilter.disabled = true;

      productList.innerHTML = renderProductRows(filteredProducts);
    });

    typeFilter.addEventListener('change', () => {
      const selectedType = typeFilter.value;
      filteredProducts = products.filter(
        (product) =>
          (!categoryFilter.value ||
            product.category === categoryFilter.value) &&
          (!selectedType || product.type === selectedType)
      );

      const filteredBrands = [
        ...new Set(filteredProducts.map((product) => product.brand)),
      ];
      brandFilter.innerHTML =
        `<option value="">Selecione uma marca</option>` +
        filteredBrands
          .map(
            (brand) => `
      <option value="${brand}">${brand}</option>
    `
          )
          .join('');
      brandFilter.disabled = !selectedType;

      productList.innerHTML = renderProductRows(filteredProducts);
    });

    brandFilter.addEventListener('change', () => {
      const selectedBrand = brandFilter.value;
      filteredProducts = products.filter(
        (product) =>
          (!categoryFilter.value ||
            product.category === categoryFilter.value) &&
          (!typeFilter.value || product.type === typeFilter.value) &&
          (!selectedBrand || product.brand === selectedBrand)
      );

      productList.innerHTML = renderProductRows(filteredProducts);
    });

    clearFiltersButton.addEventListener('click', () => {
      categoryFilter.value = '';
      typeFilter.value = '';
      brandFilter.value = '';
      typeFilter.disabled = true;
      brandFilter.disabled = true;

      filteredProducts = products;
      productList.innerHTML = renderProductRows(filteredProducts);
    });

    btnClose.onclick = function () {
      modal.style.display = 'none';
    };

    function renderProductRows(products) {
      return products
        .map(
          (product) => `
     <tr data-product-id="${product._id}">
       <td>${product.name}</td>
       <td><div class="center">${product.price}</div></td>
       <td><div class="center">${product.stock}</div></td>
       <td><div class="center"><button class="delete-btn">&times;</button></div></td>
     </tr>
   `
        )
        .join('');
    }

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const productId = e.target
          .closest('tr')
          .getAttribute('data-product-id');
        showModalConfirm(
          'Confirma Excluir?',
          'Deseja mesmo excluir esse produto?',
          () => {
            deleteProduct(productId);
          }
        );
      });
    });
    async function deleteProduct(productId) {
      try {
        const response = await productDelete(productId);
        if (response.message === 'Produto excluído com sucesso.') {
          modal.style.display = 'none';
          showModalAlert(
            'Produto Excluído',
            'Produto removido com sucesso!',
            closeModal
          );
          showModalListProduct();
        } else {
          showModalAlert('Erro', response.message, closeModal);
        }
      } catch (error) {
        showModalAlert('Erro de conexão', error.message, closeModal);
      }
    }
  }

  const registerProduct = document.getElementById('register-product');
  registerProduct.addEventListener('click', () => {
    showModalRegisterProduct();
  });

  async function showModalRegisterProduct() {
    const modal = document.getElementById('modal-user');
    const title = document.getElementById('modal-user-title');
    const content = document.getElementById('modal-user-main');
    const btnClose = document.getElementById('close');
    const footer = document.getElementById('modal-user-footer');

    title.textContent = '';
    content.innerHTML = '';
    footer.innerHTML = '';
    title.textContent = 'Cadastrar Produto';
    content.innerHTML = `
     <form id="productForm" class="productForm">
       <h3>Novo Produto</h3>
       <div class="productForm-item">
         <label for="name">Nome:</label>
         <input type="text" id="name" name="name" required minlength="3" maxlength="100">
       </div>
       <div class="productForm-item">
         <label for="category">Categoria:</label>
         <select id="category" name="category" required>
           <option value="">Selecione a Categoria</option>
           <option value="Eletrônicos">Eletrônicos</option>
           <option value="Utilitários">Utilitários</option>
           <option value="Acessórios para celular">Acessórios para celular</option>
           <option value="Acessórios para carros">Acessórios para carros</option>
           <option value="Outros">Outros</option>
         </select>
       </div>
       <div class="productForm-item">
         <label for="price">Preço (R$):</label>
         <input type="text" id="price" name="price" required value="R$ 0,00">
       </div>        
       <div class="productForm-item">
         <label for="stock">Quantidade em Estoque:</label>
         <input type="number" id="stock" name="stock" required min="0">
       </div>
       <div class="productForm-item">
         <label for="typeProduct">Tipo de Produto:</label>
         <input type="text" id="typeProduct" name="typeProduct" required minlength="3" maxlength="100">
       </div>
       <div class="productForm-item">
         <label for="productBrand">Marca (Aplicação):</label>
         <input type="text" id="productBrand" name="productBrand" required minlength="3" maxlength="100">
       </div>
       <div class="productForm-item">
         <label for="modelProduct">Modelo (Aplicação):</label>
         <input type="text" id="modelProduct" name="modelProduct" required minlength="3" maxlength="100">
       </div>
       <div class="productForm-item">
         <label for="colorProduct">Cor do Produto:</label>
         <input type="text" id="colorProduct" name="colorProduct" required minlength="3" maxlength="100">
       </div>
       <div id="description" class="hidden">
         <label for="productDescription">Descrição do Produto (Aplicação):</label>
         <span id="productDescription"></span>
       </div>

       <h3>Detalhes do Produto</h3>
       <div id="detailsContainer" class="productForm-item">          
         <div class="detail">
           <input type="text" name="property[]" placeholder="Propriedade">
           <textarea name="value[]" placeholder="Valor"></textarea>
         </div>
       </div>
       <button type="button" id="addDetailButton">Adicionar Detalhe</button>

       <h3>Imagens do Produto</h3>
       <div class="productForm-item-form">
         <div id="imageContainer" class="productForm-img">
           <div class="img" id="img">
             <label id="uploadImg">
               <img src="#" alt="Imagem Média" class="imgPreview">
               <input type="file" class="imageInput" accept="image/*">
             </label>
             <button class="deleteBtn">Excluir Imagem</button>
           </div>
         </div>
         <button type="button" id="addImg" class="addBtn">Adicionar Imagem</button>
       </div>
     </form>
   `;

    footer.innerHTML = `
    <button id="sendProduct" class="ok">Cadastrar</button>
   `;

    const nameProduct = document.getElementById('name');
    const category = document.getElementById('category');
    const price = document.getElementById('price');
    const stock = document.getElementById('stock');
    const typeProduct = document.getElementById('typeProduct');
    const productBrand = document.getElementById('productBrand');
    const modelProduct = document.getElementById('modelProduct');
    const colorProduct = document.getElementById('colorProduct');
    const textDescription = document.getElementById('productDescription');

    function updateDescription() {
      const type = typeProduct.value;
      const brand = productBrand.value;
      const model = modelProduct.value;
      const color = colorProduct.value;
      textDescription.textContent = `${type} ${brand} ${model} ${color}`;

      if (!type && !brand && !model && !color) {
        document.getElementById('description').classList.remove('description');
        document.getElementById('description').classList.add('hidden');
      } else {
        document.getElementById('description').classList.add('description');
        document.getElementById('description').classList.remove('hidden');
      }
    }

    typeProduct.addEventListener('input', updateDescription);
    productBrand.addEventListener('input', updateDescription);
    modelProduct.addEventListener('input', updateDescription);
    colorProduct.addEventListener('input', updateDescription);

    price.addEventListener('input', () => {
      let priceValue = price.value.replace(/[^0-9]/g, '');
      priceValue = (parseInt(priceValue) / 100).toFixed(2);
      price.value = `R$ ${priceValue.replace('.', ',')}`;
    });

    document
      .getElementById('addDetailButton')
      .addEventListener('click', addDetail);

    function addDetail() {
      const detailContainer = document.createElement('div');
      detailContainer.classList.add('detail');
      detailContainer.innerHTML = `
        <button type="button" class="delete-btn">Excluir Detalhe</button>
        <input type="text" name="property[]" placeholder="Propriedade">
        <textarea name="value[]" placeholder="Valor"></textarea>
      `;

      detailContainer
        .querySelector('.delete-btn')
        .addEventListener('click', () => {
          detailContainer.remove();
        });
      document.getElementById('detailsContainer').appendChild(detailContainer);
    }

    let uploadedImages = [];
    const maxImages = 10; // Limite máximo de imagens
    const imageContainer = document.getElementById('imageContainer');
    const addImageButton = document.getElementById('addImg');
    const productName = document
      .querySelector('input[name="name"]')
      .value.replace(/\s+/g, '')
      .toLowerCase();

    function setupImageSection(section) {
      const fileInput = section.querySelector('.imageInput');
      const imgPreview = section.querySelector('.imgPreview');
      const deleteBtn = section.querySelector('.deleteBtn');

      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            imgPreview.src = e.target.result;
            imgPreview.style.display = 'block';
            deleteBtn.style.display = 'block';
          };
          reader.readAsDataURL(file);

          const imageIndex = Array.from(imageContainer.children).indexOf(
            section
          );
          if (imageIndex > -1) {
            const newFileName = `${productName}_${String(
              imageIndex + 1
            ).padStart(2, '0')}.${file.name.split('.').pop()}`;
            const renamedFile = new File([file], newFileName, {
              type: file.type,
            });
            uploadedImages[imageIndex] = renamedFile;
          } else {
            const newFileName = `${productName}_${String(
              uploadedImages.length + 1
            ).padStart(2, '0')}.${file.name.split('.').pop()}`;
            const renamedFile = new File([file], newFileName, {
              type: file.type,
            });
            uploadedImages.push(renamedFile);
          }
        }
      });

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        const imageIndex = Array.from(imageContainer.children).indexOf(section);
        if (imageIndex > -1) {
          uploadedImages.splice(imageIndex, 1);
        }

        section.remove();
        updateImageSection();
      });
    }

    function addNewImageSection() {
      if (uploadedImages.length >= maxImages) {
        showModalAlert(
          'Limite de Imagens!',
          'Limite de imagens para cadastro alcançado de 10 imagens',
          () => {}
        );
        return;
      }

      const newImageSection = document.createElement('div');
      newImageSection.classList.add('img');
      newImageSection.innerHTML = `
        <label id="uploadImg">
            <img src="#" alt="Imagem Média" class="imgPreview" style="display:none;">
            <input type="file" class="imageInput" accept="image/*">
        </label>
        <button class="deleteBtn" style="display:none;">Excluir Imagem</button>
      `;

      setupImageSection(newImageSection);
      imageContainer.appendChild(newImageSection);
      updateImageSection();
    }

    function updateImageSection() {
      Array.from(imageContainer.children).forEach((section, index) => {
        const fileInput = section.querySelector('.imageInput');
        const file = fileInput.files[0];
        if (file) {
          const newFileName = `${productName}_${String(index + 1).padStart(
            2,
            '0'
          )}.${file.name.split('.').pop()}`;
          const renamedFile = new File([file], newFileName, {
            type: file.type,
          });
          uploadedImages[index] = renamedFile;
        }
      });

      if (uploadedImages.length >= maxImages) {
        addImageButton.disabled = true;
      } else {
        addImageButton.disabled = false;
      }
    }

    addImageButton.addEventListener('click', addNewImageSection);

    document.querySelectorAll('.img').forEach((section) => {
      setupImageSection(section);
    });

    modal.style.display = 'block';

    btnClose.onclick = function () {
      modal.style.display = 'none';
    };

    const sendProduct = document.getElementById('sendProduct');
    sendProduct.addEventListener('click', () => {
      showModalConfirm(
        'Confirma Cadastro?',
        'Produto está pronto e revisado para cadastro?',
        handleFormSubmit
      );
    });

    async function handleFormSubmit() {
      const details = [];
      const properties = document.querySelectorAll('input[name="property[]"]');
      const values = document.querySelectorAll('textarea[name="value[]"]');

      properties.forEach((property, index) => {
        const value = values[index];
        if (property.value && value.value) {
          details.push(property.value, value.value);
        }
      });

      const priceFormatted = parseFloat(
        price.value.replace('R$ ', '').replace('.', '').replace(',', '.')
      );

      const product = {
        name: nameProduct.value,
        category: category.value,
        price: priceFormatted,
        stock: parseInt(stock.value),
        type: typeProduct.value,
        brand: productBrand.value,
        model: modelProduct.value,
        color: colorProduct.value,
        details: details,
      };

      try {
        const productData = await sendProductData(product, uploadedImages);
        if (productData.res.ok) {
          showModalAlert(
            'Produto Cadastrado!',
            `Produto cadastrado com sucesso!`,
            closeModal
          );
        } else {
          showModalAlert(
            'Não Cadastrado!!',
            productData.data.message,
            closeModal
          );
        }
      } catch (error) {
        showModalAlert('Erro de conexão', error.message, closeModal);
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
});
