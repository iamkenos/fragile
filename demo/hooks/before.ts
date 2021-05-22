import { TMockHook } from "@iamkenos/fragile";

const fn: TMockHook = ({ req }) => {
  // a hook that will always execute and do something only if a cookie named `_do` is "true"
  if (req.cookies._do === "true") req.cookies = { ...req.cookies, _mystatus: 202 };
};

export default fn;
