import { IMockModule } from "@iamkenos/fragile";
import xml2js from "xml2js";

const fn: IMockModule = ({ req }) => {
  return {
    mockOverrides: { delay: { min: 200, max: 400 } },
    mockResponse: {
      status: 202,
      body: req.body.data.type === "XML" ? new xml2js.Builder().buildObject(req.body) : req.body
    }
  };
};

export default fn;
