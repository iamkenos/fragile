import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = () => {
  return {
    overrides: {
      proxy: {
        target: "https://reqres.in/api/register",
        changeOrigin: true
      }
    },
    response: {
      status: 400,
      body: "this will be ignored"
    }
  };
};

export default fn;
