import { IResponseModule } from "@iamkenos/fragile";

const fn: IResponseModule = () => {
  return {
    moduleOverrides: {
      proxy: { target: "http://google.com.sg" }
    },
    moduleResponse: {
      status: 200,
      body: "hello world!"
    }
  };
};

export default fn;
