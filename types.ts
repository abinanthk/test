import { ReactNode } from "react";

export type FormRootProps = {
  children: ReactNode;
  form: any;
};

export type FormSubscribeProps = {
  children: any;
  valueDeps?: string[];
  errorDeps?: string[];
};

export type FormFieldProps = {
  children: any;
  name: string;
};

export type FormValueProps = {
  children: any;
  deps?: string[];
};

export type FormErrorProps = {
  children: any;
  deps?: string[];
};
