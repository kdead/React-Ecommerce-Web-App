import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const ordersRef = collection(db, "orders");

// Create: save a completed order
export const createOrder = async (userId, items, totalPrice) => {
  await addDoc(ordersRef, {
    userId,
    items, // array of cart product objects, each with its `count`
    totalPrice,
    createdAt: serverTimestamp(),
  });
};

// Read: fetch all orders for one user, newest first
export const getUserOrders = async (userId) => {
  const q = query(
    ordersRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};
