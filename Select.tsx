import { ComponentProps, useEffect } from "react";
import { SelectProvider, useSelectContext } from "./Select.store";

type SelectProps = ComponentProps<"div">;

export function Select({ className, ...props }: SelectProps) {
  const Select_ = () => {
    const ctx = useSelectContext((state) => state.selected);
    console.log("Select", ctx);

    useEffect(() => {
      props.onChange?.(ctx);
    }, [ctx]);

    return <div className={"flex flex-col bg-slate-700"}>{props.children}</div>;
  };

  return (
    <SelectProvider>
      <Select_ />
    </SelectProvider>
  );
}

Select.Trigger = function (props: any) {
  const ctx = useSelectContext();

  if (!ctx) {
    return;
  }

  const { setVisible } = ctx;

  const handleTrigger = () => {
    console.log("handleTrigger");
    setVisible();
  };
  return (
    <span
      className="bg-red-700 text-white hover:cursor-pointer"
      onClick={handleTrigger}
    >
      {props.children}
    </span>
  );
};

Select.Options = function (props: { children: React.ReactNode }) {
  const ctx = useSelectContext();

  if (!ctx) {
    return;
  }

  const { visible } = ctx;

  return visible ? props.children : null;
};

Select.Option = function (props: { value: string; children: React.ReactNode }) {
  const ctx = useSelectContext();
  console.log("Option", ctx);

  if (!ctx) {
    return;
  }

  const { setOptions, setSelected, setVisible } = ctx;

  useEffect(() => {
    setOptions(props.value);
  }, []);

  const handleSelect = () => {
    console.log("handleSelect");
    setSelected(props.value);
    setVisible(false);
  };

  return (
    <span className="hover:cursor-pointer" onClick={handleSelect}>
      {props.children}
    </span>
  );
};
