import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

export const SelectContext = createContext<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  selected: string[];
  setSelected: (selected: string[]) => void;
} | null>(null);

export const SelectProvider = ({ children }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createStore((set) => ({
      visible: false,
      setVisible: () => {
        set((state) => ({ visible: !state.visible }));
      },
      options: [],
      setOptions: (options: string[]) => {
        set((state) => ({ options: [...state.options, options] }));
      },
      selected: [],
      setSelected: (selected: string[]) => {
        set((state) => ({ selected: [...state.selected, selected] }));
      },
    }));
  }
  return (
    <SelectContext.Provider value={storeRef.current}>
      {children}
    </SelectContext.Provider>
  );
};

export const useSelectContext = (selector?: any) => {
  const store = useContext(SelectContext);
  if (!store) {
    throw new Error("Missing StoreProvider");
  }
  return useStore(store, selector);
};
