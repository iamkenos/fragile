import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = () => {
  return {
    response: {
      status: 200,
      headers: { "Cache-Control": "no-cache" },
      body: {}
    }
  };
};

export default fn;
