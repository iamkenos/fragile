import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = ({ res }) => {
  const { mock } = res;
  return {
    response: {
      status: 202,
      // let's see what's in here
      body: mock.fallback
    }
  };
};

export default fn;
