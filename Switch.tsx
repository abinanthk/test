import { SwitchProps } from "./Switch.types";
import {
  SwitchContext,
  useSwitch,
  useSwitchStoreInContext,
} from "./Switch.hooks";

export function Switch(props: SwitchProps) {
  const store = useSwitch(props.store);

  return (
    <SwitchContext.Provider value={store}>
      {props.children}
    </SwitchContext.Provider>
  );
}

Switch.On = (props: SwitchProps) => {
  const isOn = useSwitchStoreInContext<boolean>((state) => state.isOn);

  if (!isOn) {
    return null;
  }
  return <div {...props} />;
};

Switch.Off = (props: SwitchProps) => {
  const isOn = useSwitchStoreInContext<boolean>((state) => state.isOn);

  if (isOn) {
    return null;
  }
  return <div {...props} />;
};

Switch.Trigger = (props: SwitchProps) => {
  const toggle = useSwitchStoreInContext<() => void>((state) => state.toggle);

  return <div {...props} onClick={toggle} />;
};
