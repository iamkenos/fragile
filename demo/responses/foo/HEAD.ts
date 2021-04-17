import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = () => {
  return {
    response: {
      status: 200,
      headers: {
        lea: "seydoux"
      },
      body: {
        says: "I'm Fragile, But Not That Fragile."
      }
    }
  };
};

export default fn;
