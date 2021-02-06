import { IResponseModule } from "@iamkenos/fragile";

const fn: IResponseModule = ({ fallback }) => {
  return {
    response: {
      status: 202,
      body: fallback.wildcards
    }
  };
};

export default fn;
