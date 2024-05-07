import { createContext, useContext, useEffect, useRef } from "react";
import {
  SwitchStoreTypes,
  SwitchStoreApiTypes,
  SwitchStoreSelectorTypes,
} from "./Switch.types";
import { createStore, useStore } from "zustand";

export const SwitchContext = createContext<SwitchStoreApiTypes | null>(null);

export const useSwitchStoreInContext = <T>(
  selector: SwitchStoreSelectorTypes<T>
) => {
  const store = useContext(SwitchContext);
  if (!store) {
    throw new Error("Missing Switch.Provider");
  }

  return useStore(store, selector);
};

export const useSwitch = (store?: any) => {
  const storeRef = useRef<SwitchStoreApiTypes>(store);

  if (!storeRef.current) {
    console.log("store created");
    storeRef.current = createStore<SwitchStoreTypes>((set) => ({
      isOn: false,
      toggle: () => {
        set((state) => ({ isOn: !state.isOn }));
      },
    }));
  } else {
    console.log("store already created");
  }
  useEffect(() => {
    // return () => storeRef.current?.destroy();
  }, []);
  return storeRef.current;
};

export const useSwitchStore = <T>(
  store: SwitchStoreApiTypes,
  selector: SwitchStoreSelectorTypes<T>
) => {
  return useStore(store, selector);
};
