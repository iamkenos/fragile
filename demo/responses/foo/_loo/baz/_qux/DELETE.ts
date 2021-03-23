import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = ({ res }) => {
  return {
    mockResponse: {
      status: 202,
      body: res._mockFallback.urlPattern
    }
  };
};

export default fn;
