import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  increment,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ---------- Restaurant ----------
export interface Restaurant {
  id?: string;
  name: string;
  email: string;
  logo?: string;
  subscriptionPlan: "free" | "pro" | "enterprise";
  createdAt?: Timestamp;
}

export async function createRestaurant(uid: string, data: Omit<Restaurant, "id">) {
  await setDoc(doc(db, "restaurants", uid), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function getRestaurant(uid: string): Promise<Restaurant | null> {
  const snap = await getDoc(doc(db, "restaurants", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Restaurant;
}

export async function updateRestaurant(uid: string, data: Partial<Restaurant>) {
  await updateDoc(doc(db, "restaurants", uid), data);
}

// ---------- Menu Items ----------
export interface MenuItem {
  id?: string;
  dishName: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  arModelUrl?: string;
  arMarkerUrl?: string;
  arViews: number;
  ingredients?: string;
  createdAt?: Timestamp;
}

export async function addMenuItem(restaurantId: string, item: Omit<MenuItem, "id">) {
  const ref = collection(db, "restaurants", restaurantId, "menus");
  const docRef = await addDoc(ref, {
    ...item,
    arViews: 0,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateMenuItem(
  restaurantId: string,
  menuId: string,
  data: Partial<MenuItem>
) {
  await updateDoc(doc(db, "restaurants", restaurantId, "menus", menuId), data);
}

export async function deleteMenuItem(restaurantId: string, menuId: string) {
  await deleteDoc(doc(db, "restaurants", restaurantId, "menus", menuId));
}

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const ref = collection(db, "restaurants", restaurantId, "menus");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem));
}

export async function getMenuItem(
  restaurantId: string,
  menuId: string
): Promise<MenuItem | null> {
  const snap = await getDoc(doc(db, "restaurants", restaurantId, "menus", menuId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as MenuItem;
}

export async function incrementArViews(restaurantId: string, menuId: string) {
  await updateDoc(doc(db, "restaurants", restaurantId, "menus", menuId), {
    arViews: increment(1),
  });
}
