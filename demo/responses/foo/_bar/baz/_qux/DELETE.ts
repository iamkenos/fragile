import { IResponseModule } from "@iamkenos/fragile";

const fn: IResponseModule = ({ res }) => {
  return {
    moduleResponse: {
      status: 202,
      body: res.moduleFallback.wildcards
    }
  };
};

export default fn;
