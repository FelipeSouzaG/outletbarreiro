const apiUrl = 'http://localhost:3000';

export const userAddress = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/addresses/useraddress`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao buscar dados de usúario', error);
  }
};

export const createAddress = async (
  postalCode,
  street,
  number,
  complement,
  district,
  city,
  state
) => {
  const addressData = {
    postalCode: postalCode,
    street: street,
    number: number,
    complement: complement,
    district: district,
    city: city,
    state: state,
  };
  try {
    const response = await fetch(`${apiUrl}/api/addresses/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(addressData),
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao buscar cadastrar endereço de entrega', error);
  }
};

export const editAddress = async (
  addressId,
  postalCode,
  street,
  number,
  complement,
  district,
  city,
  state
) => {
  const addressData = {
    postalCode: postalCode,
    street: street,
    number: number,
    complement: complement,
    district: district,
    city: city,
    state: state,
  };
  try {
    const response = await fetch(
      `${apiUrl}/api/addresses/update/${addressId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(addressData),
      }
    );
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao buscar dados de usúario', error);
  }
};

export const deleteAddress = async (userAddress) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/addresses/delete/${userAddress}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao buscar dados de usúario', error);
  }
};

export const addItemCart = async (productId) => {
  try {
    const response = await fetch(`${apiUrl}/api/carts/additem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao adicionar ao carrinho!', error);
  }
};

export const removeItemCart = async (productId) => {
  try {
    const response = await fetch(`${apiUrl}/api/carts/deleteitem`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ productId }),
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao remover do carrinho!', error);
  }
};

export const getCart = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/carts/datacart`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao remover do carrinho!', error);
  }
};

export const clearCartUser = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/carts/cartclear`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao remover do carrinho!', error);
  }
};

export const allOrders = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/orders/allorders`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao remover do carrinho!', error);
  }
};

export const updateOrderAdmin = async (orderId) => {
  try {
    const status = { status: 'pedido em entrega' };
    const response = await fetch(
      `${apiUrl}/api/orders/update/${orderId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(status),
      }
    );
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao atualizar o status do pedido!', error);
  }
};

export const userSection = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/users/data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  } catch (error) {
    throw new Error('Erro ao buscar dados de usúario', error);
  }
};

export const userLogin = async (email, password) => {
  const data = {
    email: email,
    password: password,
  };
  try {
    const response = await fetch(`${apiUrl}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    throw new Error('Erro ao buscar endereço de entrega', error);
  }
};

export const userRegister = async (name, email, password, isAdmin) => {
  const data = {
    name: name,
    email: email,
    password: password,
    isAdmin: isAdmin,
  };
  try {
    const response = await fetch(`${apiUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao tentar registrar usuário', error);
  }
};

export const userUpdate = async (name, email, password, isAdmin) => {
  const data = {
    name: name,
    email: email,
    password: password,
    isAdmin: isAdmin,
  };
  try {
    const response = await fetch(`${apiUrl}/api/users/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao tentar registrar usuário', error);
  }
};

export const userDelete = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/users/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  } catch (error) {
    throw new Error('Erro ao buscar dados de usúario', error);
  }
};

export const allUser = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/users/alluser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  } catch (error) {
    throw new Error('Erro ao buscar dados de usúario', error);
  }
};

export const userDeleteAdmin = async (userId) => {
  try {
    const response = await fetch(`${apiUrl}/api/users/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  } catch (error) {
    throw new Error('Erro ao deletar o usuário', error);
  }
};

export const createOrderUser = async (userId) => {
  const data = { userId: userId };
  try {
    const response = await fetch(`${apiUrl}/api/orders/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao tentar registrar usuário', error);
  }
};

export const publicProducts = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/public/products`);
    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error('Erro ao tentar registrar usuário', error);
  }
};

export const sendProductData = async (product, uploadedImages) => {
  const formData = new FormData();

  // Adiciona campos do produto
  formData.append('name', product.name);
  formData.append('category', product.category);
  formData.append('price', product.price);
  formData.append('stock', product.stock);
  formData.append('type', product.type);
  formData.append('brand', product.brand);
  formData.append('model', product.model);
  formData.append('color', product.color);

  // Adiciona os pares de detalhes no formato correto
  product.details.forEach((detail) => {
    formData.append('details[]', JSON.stringify(detail)); // Envia cada detalhe como uma string JSON
  });

  // Adiciona imagens carregadas
  uploadedImages.forEach((image) => {
    formData.append('images', image); // Usa a chave 'images' para o multer
  });

  try {
    const response = await fetch(`${apiUrl}/api/products/register`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const responseData = await response.json();
    return { res: response, data: responseData };
  } catch (error) {
    throw new Error(`Erro ao tentar registrar produto: ${error.message}`);
  }
};

export const productDelete = async (productId) => {
  try {
    const response = await fetch(`${apiUrl}/api/products/delete/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  } catch (error) {
    throw new Error('Erro ao buscar produto', error);
  }
};
