import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = () => {
  return {
    response: {
      status: 200,
      body: "I'm Fragile, But Not That Fragile."
    }
  };
};

export default fn;
