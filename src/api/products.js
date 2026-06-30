import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const productsRef = collection(db, "products");

// Read: fetch all products from Firestore
export const getProducts = async () => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

// Create: add a new product. We generate our own id so we control the doc path.
export const addProduct = async (product) => {
  const id = String(Date.now()); // simple unique id based on timestamp
  await setDoc(doc(db, "products", id), product);
  return { id, ...product };
};

// Update: edit an existing product by id
export const updateProduct = async (id, updates) => {
  await updateDoc(doc(db, "products", id), updates);
};

// Delete: remove a product by id
export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, "products", id));
};
