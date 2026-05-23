import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from "firebase/firestore";

const FOODS = [
  {
    name: "Isombe with Rice",
    price: 4500,
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&fit=crop",
    description: "Cassava leaves finely ground and cooked with peanut sauce and spices."
  },
  {
    name: "Grilled Tilapia",
    price: 8000,
    category: "Grilled",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&fit=crop",
    description: "Freshly caught fish from Lake Kivu, grilled with local Rwandan herbs."
  },
  {
    name: "Akabenz Special",
    price: 5000,
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&fit=crop",
    description: "Signature sweet and sour pork dish, a local favorite in Kirehe."
  }
];

const RESTAURANTS = [
  {
    name: "The Kigali Heights",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517248135467-4c7ed9d421bb?q=80&w=800&auto=format&fit=crop",
    address: "KG 7 Ave, Kigali"
  },
  {
    name: "Nyama Choma Central",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    address: "Kirehe Main Street"
  }
];

export async function seedDatabase() {
  try {
    // Only seed if empty
    const foodsSnap = await getDocs(query(collection(db, "foods"), limit(1)));
    if (foodsSnap.empty) {
      for (const food of FOODS) {
        await addDoc(collection(db, "foods"), {
          ...food,
          createdAt: serverTimestamp()
        });
      }
    }

    const restaurantsSnap = await getDocs(query(collection(db, "restaurants"), limit(1)));
    if (restaurantsSnap.empty) {
      for (const res of RESTAURANTS) {
        await addDoc(collection(db, "restaurants"), {
          ...res,
          createdAt: serverTimestamp()
        });
      }
    }

    return true;
  } catch (err) {
    console.error("Seeding failed:", err);
    return false;
  }
}
