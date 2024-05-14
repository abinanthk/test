import { createContext, useContext, useEffect, useRef } from "react";
import {
  SelectStoreTypes,
  SelectStoreApiTypes,
  SelectOptionStoreSelectorTypes,
  SelectOptionStoreTypes,
  SelectOptionStoreApiTypes,
  SelectHookTypes,
  SelectOptionHookTypes,
  SelectStoreSelectorTypes,
} from "./Select.types";
import { createStore, useStore } from "zustand";

// creates a Select store | internal & external use
export const useSelectOption = ({
  value,
  isSelected,
  onChange,
}: SelectOptionHookTypes) => {
  const storeRef = useRef<SelectOptionStoreApiTypes>();
  const _groupCtx = useSelectContext();

  if (!storeRef.current) {
    storeRef.current = createStore<SelectOptionStoreTypes>()((set, get) => ({
      value: value || "",
      isSelected: isSelected || false,
      select: () => {
        set(() => ({ isSelected: true }));
        onChange?.(get().isSelected);

        // group
        if (!_groupCtx) {
          return;
        }
        _groupCtx.setState({ value: get().value });
        _groupCtx.getState().refresh();
      },
      unselect: () => {
        set(() => ({ isSelected: false }));
        onChange?.(get().isSelected);

        // group
        if (!_groupCtx) {
          return;
        }
        _groupCtx.setState({ value: "" });
        _groupCtx.getState().refresh();
      },
      toggle: () => {
        set((state) => ({ isSelected: !state.isSelected }));
        onChange?.(get().isSelected);

        // group
        if (!_groupCtx) {
          return;
        }
        _groupCtx.setState({ value: get().isSelected ? get().value : "" });
        _groupCtx.getState().refresh();
      },
    }));
    _groupCtx?.getState().add(storeRef.current);
  }
  useEffect(() => {
    // return () => storeRef.current?.destroy();
  }, []);

  return storeRef.current;
};

// context to avoid prop drilling | internal use
export const SelectOptionContext =
  createContext<SelectOptionStoreApiTypes | null>(null);

// use the Select store in the context (controlled/uncontrolled) | internal use
export const useSelectOptionContext = () => {
  return useContext(SelectOptionContext);
};

// use the Select store in the context (controlled/uncontrolled) | internal use
export const useSelectOptionStoreInContext = <T>(
  selector: SelectOptionStoreSelectorTypes<T>
) => {
  const store = useContext(SelectOptionContext);
  if (!store) {
    throw new Error("Missing Select.Provider");
  }

  return useStore(store, selector);
};

export const useSelect = ({ defaultValue, onChange }: SelectHookTypes) => {
  const storeRef = useRef<SelectStoreApiTypes>();
  const _ref = useRef();

  if (!storeRef.current) {
    storeRef.current = createStore<SelectStoreTypes>()((set, get) => ({
      value: defaultValue || "",
      isOpen: false,
      selectStores: [],
      _ref,
      add: (selectStore) => {
        set((state) => ({
          selectStores: [...state.selectStores, selectStore],
        }));
        if (selectStore.getState().value === get().value) {
          selectStore.setState({ isSelected: true });
        }
      },
      refresh: () => {
        get().selectStores.map((selectStore) => {
          if (selectStore.getState().value !== get().value) {
            selectStore.setState({ isSelected: false });
          }
        });
        onChange?.(get().value);
      },
      select: (value: string) => {
        set(() => ({ value }));
      },
      unselect: () => {
        set(() => ({ value: "" }));
      },
      toggle: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }));
  }
  useEffect(() => {
    // return () => storeRef.current?.destroy();
  }, []);
  return storeRef.current;
};

// context to avoid prop drilling | internal use
export const SelectContext = createContext<SelectStoreApiTypes | null>(null);

// use the Select store in the context (controlled/uncontrolled) | internal use
export const useSelectContext = () => {
  return useContext(SelectContext);
};

export const useSelectStoreInContext = <T>(
  selector: SelectStoreSelectorTypes<T>
) => {
  const store = useContext(SelectContext);
  if (!store) {
    throw new Error("Missing Select.Provider");
  }

  return useStore(store, selector);
};
