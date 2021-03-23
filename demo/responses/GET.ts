import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = () => {
  return {
    mockOverrides: { proxy: { target: "http://google.com.sg" } },
    mockResponse: {
      status: 222,
      body: "hello world!"
    }
  };
};

export default fn;
