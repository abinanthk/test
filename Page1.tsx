import React from "react";
import { Select } from "../components/Select/Select";

const Page1 = () => {
  const handleChange = (ctx) => {
    console.log("main______", ctx);
  };

  return (
    <div>
      <Select onChange={handleChange}>
        <Select.Trigger>Click</Select.Trigger>
        <Select.Options>
          <Select.Option value="1">one</Select.Option>
          <Select.Option value="2">two</Select.Option>
          <Select.Option value="3">three</Select.Option>
        </Select.Options>
      </Select>
    </div>
  );
};

export default Page1;
