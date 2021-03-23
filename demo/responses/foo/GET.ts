import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = () => {
  return {
    mockResponse: {
      status: 200,
      body: {}
    }
  };
};

export default fn;
