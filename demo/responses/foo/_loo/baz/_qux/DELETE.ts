import { IResponseModule } from "@iamkenos/fragile";

const fn: IResponseModule = ({ res }) => {
  return {
    moduleResponse: {
      status: 202,
      body: res.moduleFallback.urlPattern
    }
  };
};

export default fn;
