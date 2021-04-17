import { IMockModule } from "@iamkenos/fragile";
import xml2js from "xml2js";

const fn: IMockModule = ({ req }) => {
  // since this is a typescript file, you can basically do anything
  // as long as you follow the types you're expected to return
  const { data } = req.body;
  const isJSON = req.is("application/json");
  const getDelay = () => isJSON ? { min: 200, max: 400 } : 1000;
  const getBody = () => isJSON
    ? data
    : data.anything["show-as"] === "XML"
      ? new xml2js.Builder().buildObject(data)
      : data;

  return {
    overrides: { delay: getDelay() },
    response: {
      status: 201,
      body: getBody()
    }
  };
};

export default fn;
