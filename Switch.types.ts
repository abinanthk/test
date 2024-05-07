import { ComponentProps } from "react";
import { StoreApi } from "zustand";

export type SwitchProps = ComponentProps<"div"> & {
  store?: SwitchStoreApiTypes;
};

export type SwitchStoreTypes = {
  isOn: boolean;
  toggle: () => void;
};

export type SwitchStoreApiTypes = StoreApi<SwitchStoreTypes>;

export type SwitchStoreSelectorTypes<T> = (state: SwitchStoreTypes) => T;
