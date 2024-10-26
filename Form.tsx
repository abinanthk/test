import { createContext, useContext } from "react";
import { FormFieldProps, FormRootProps, FormSubscribeProps, FormValueProps, FormErrorProps } from "./types";
import { Form as FormV } from "../../../../vannila";
import { useVannilaForm } from "../useVannilaForm";
import { useSubscription } from "../../react-core";

const FormContext = createContext<FormV<any, any, any>>(null as any);

const useFormContext = () => {
  return useContext(FormContext);
};

export const FormRoot = (props: FormRootProps) => {
  return (
    <FormContext.Provider value={props.form}>
      {props.children}
    </FormContext.Provider>
  );
};

export const FormSubscribe = (props: FormSubscribeProps) => {
  const formCtx = useFormContext();
  const valueDeps = props.valueDeps || [];
  const errorDeps = props.errorDeps || [];

  useVannilaForm(formCtx, valueDeps, errorDeps);

  return props.children?.({ value: formCtx.value, error: formCtx.error });
};


export const FormValue = (props: FormValueProps) => {
  const formCtx = useFormContext();

  useSubscription(formCtx.valueStore, props.deps || []);

  return props.children?.({ value: formCtx.value, error: formCtx.error });
};

export const FormError = (props: FormErrorProps) => {
  const formCtx = useFormContext();

  useSubscription(formCtx.errorStore, props.deps || []);

  return props.children?.({ value: formCtx.value, error: formCtx.error });
};


export const FormField = (props: FormFieldProps) => {
  const formCtx = useFormContext();

  useVannilaForm(formCtx);

  return props.children?.({ value: formCtx.value, error: formCtx.error });
};

export const Form = {
  Root: FormRoot,
  Subscribe: FormSubscribe,
  Field: FormField,
  Value: FormValue,
  Error: FormError,
};
