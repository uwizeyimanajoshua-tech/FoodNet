import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FOODS_DATA, FoodItem } from "../data/foods";
import { toast } from "react-hot-toast";
import { handleFirestoreError, OperationType } from "../lib/errorHandler";

interface FoodsContextType {
  foods: FoodItem[];
  loading: boolean;
  addFoodItem: (food: Omit<FoodItem, "id">) => Promise<string>;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => Promise<void>;
  deleteFoodItem: (id: string) => Promise<void>;
  refreshFoods: () => Promise<void>;
}

const FoodsContext = createContext<FoodsContextType | undefined>(undefined);

export function FoodsProvider({ children }: { children: React.ReactNode }) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshFoods = async () => {
    setLoading(true);
    try {
      const foodsSnap = await getDocs(collection(db, "foods"));
      if (foodsSnap.empty) {
        // Automatically seed with default FOODS_DATA
        console.log("No foods in Firestore. Seeding database with default Kirehe culinary choices...");
        for (const item of FOODS_DATA) {
          // Use item.id as doc ID to preserve details route linkages
          await setDoc(doc(db, "foods", item.id), item);
        }
        setFoods(FOODS_DATA);
      } else {
        const list: FoodItem[] = [];
        foodsSnap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as FoodItem);
        });
        setFoods(list);
      }
    } catch (err) {
      console.error("Failed to load foods from Firestore, falling back to static data:", err);
      setFoods(FOODS_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFoods();
  }, []);

  const addFoodItem = async (food: Omit<FoodItem, "id">): Promise<string> => {
    const id = food.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
    const newFood: FoodItem = {
      ...food,
      id,
    };

    try {
      await setDoc(doc(db, "foods", id), newFood);
      setFoods((prev) => [...prev, newFood]);
      toast.success(`${food.name} added successfully to the catalog!`);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `foods/${id}`, "Failed to add food to database.");
      throw err;
    }
  };

  const updateFoodItem = async (id: string, updates: Partial<FoodItem>) => {
    try {
      const docRef = doc(db, "foods", id);
      await updateDoc(docRef, updates);
      setFoods((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      toast.success("Food item updated successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `foods/${id}`, "Failed to update food details.");
      throw err;
    }
  };

  const deleteFoodItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "foods", id));
      setFoods((prev) => prev.filter((item) => item.id !== id));
      toast.success("Food item deleted from database.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `foods/${id}`, "Failed to delete food item.");
      throw err;
    }
  };

  return (
    <FoodsContext.Provider
      value={{
        foods,
        loading,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        refreshFoods,
      }}
    >
      {children}
    </FoodsContext.Provider>
  );
}

export function useFoods() {
  const context = useContext(FoodsContext);
  if (context === undefined) {
    throw new Error("useFoods must be used within a FoodsProvider");
  }
  return context;
}
