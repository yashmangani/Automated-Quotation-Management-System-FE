export const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const fetchProducts = async () => {
  const res = await fetch(`${API_URL}/api/products`);
  return await res.json();
};

export const fetchProductById = async (id: string) => {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  return await res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(`${API_URL}/api/products/delete/${id}`, { method: "DELETE" });
  return await res.json();
};

export const addProduct = async (data: any) => {
  const res = await fetch(`${API_URL}/api/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateProduct = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/api/products/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

let userString = localStorage.getItem("user");
let user = typeof userString === 'string' ? JSON.parse(userString) : null;

export const fetchItems = async () => {
  const res = await fetch(`${API_URL}/api/items?userId=${user?.id}`); 
  return await res.json();
};
