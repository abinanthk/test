import {
  SelectProps,
  SelectSelectedProps,
  SelectUnSelectedProps,
  SelectToggleProps,
  SelectLabelProps,
  SelectOptionProps,
  SelectTriggerProps,
  SelectContentProps,
} from "./Select.types";
import {
  SelectContext,
  useSelect,
  useSelectOptionStoreInContext,
  SelectOptionContext,
  useSelectOption,
  useSelectStoreInContext,
} from "./Select.hooks";
import { useEffect, useRef, useState } from "react";

// Select provider for using multiple instance
export function Select({ defaultValue, onChange, ...props }: SelectProps) {
  const _store = useSelect({
    defaultValue,
    onChange: onChange,
  });
  return (
    <SelectContext.Provider value={_store}>
      <div {...props} />
    </SelectContext.Provider>
  );
}

Select.Option = ({
  defaultChecked,
  value,
  onChange,
  ...props
}: SelectOptionProps) => {
  const _store = useSelectOption({
    isSelected: defaultChecked,
    value,
    onChange: onChange,
  });

  return (
    <SelectOptionContext.Provider value={_store}>
      <div {...props} />
    </SelectOptionContext.Provider>
  );
};

Select.Selected = (props: SelectSelectedProps) => {
  const isSelected = useSelectOptionStoreInContext<boolean>(
    (state) => state.isSelected
  );

  return isSelected ? <div {...props} /> : null;
};

Select.UnSelected = (props: SelectUnSelectedProps) => {
  const isSelected = useSelectOptionStoreInContext<boolean>(
    (state) => state.isSelected
  );

  return isSelected ? null : <div {...props} />;
};

Select.Toggle = (props: SelectToggleProps) => {
  const toggle = useSelectOptionStoreInContext<() => void>(
    (state) => state.toggle
  );

  return (
    <div
      {...props}
      onClick={(e) => {
        toggle();
        props.onClick?.(e);
      }}
    />
  );
};

Select.Label = (props: SelectLabelProps) => {
  return <label {...props} />;
};

// /////////////////
Select.Trigger = (props: SelectTriggerProps) => {
  const toggle = useSelectStoreInContext((state) => state.toggle);
  const _ref = useSelectStoreInContext((state) => state._ref);

  return (
    <div
      {...props}
      ref={_ref}
      onClick={(e) => {
        toggle();
        props.onClick?.(e);
      }}
    />
  );
};

Select.Content = (props: SelectContentProps) => {
  const isOpen = useSelectStoreInContext((state) => state.isOpen);
  const _ref = useSelectStoreInContext((state) => state._ref);

  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!_ref) {
      return;
    }

    console.log("_ref", _ref.current.getBoundingClientRect());

    setPos({
      x: _ref.current.getBoundingClientRect().y + _ref.current.getBoundingClientRect().height,
      y: _ref.current.getBoundingClientRect().x,
    });
  }, []);

  return isOpen ? (
    <div {...props} style={{ position: "absolute", top: pos.x, left: pos.y }} />
  ) : null;
};
