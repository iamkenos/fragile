import { IResponseModule } from "@iamkenos/fragile";

const fn: IResponseModule = ({ fallback }) => {
  return {
    response: {
      status: 202,
      body: fallback.urlPattern
    }
  };
};

export default fn;
