import { IResponseModule } from "@iamkenos/fragile";

const fn: IResponseModule = () => {
  return {
    moduleResponse: {
      status: 200,
      body: {}
    }
  };
};

export default fn;
