import { IResponseModule } from "@iamkenos/fragile";

const fn: IResponseModule = () => {
  return {
    response: {
      status: 200,
      body: {}
    }
  };
};

export default fn;
