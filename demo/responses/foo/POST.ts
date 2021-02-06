import { IResponseModule } from "@iamkenos/fragile";
import xml2js from "xml2js";

const fn: IResponseModule = ({ req }) => {
  return {
    overrides: { delay: { min: 200, max: 400 } },
    response: {
      status: 202,
      body: req.body.data.type === "XML" ? new xml2js.Builder().buildObject(req.body) : req.body
    }
  };
};

export default fn;
