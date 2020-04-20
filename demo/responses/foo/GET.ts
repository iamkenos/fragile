import { IResponseModule } from "../../../build";

const fn: IResponseModule = () => {
  return {
    response: {
      status: 200,
      body: {}
    }
  };
};

export default fn;
