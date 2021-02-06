import { IResponseModule } from "@iamkenos/fragile";

const fn: IResponseModule = () => {
  return {
    response: {
      status: 200,
      body: "hello world!"
    }
  };
};

export default fn;
