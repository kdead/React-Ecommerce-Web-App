const BASE_URL = "https://fakestoreapi.com";

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export const getProductsByCategory = async (category) => {
  // encodeURIComponent handles categories with spaces/apostrophes (e.g. "men's clothing")
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
};
