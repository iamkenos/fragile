import { IMockExecd, TMockHook } from "@iamkenos/fragile";

const fn: TMockHook = ({ req, res }) => {
  const { mock }: IMockExecd = res as any;
  // a hook that will always execute and do something only if a cookie named `_do` is "true"
  if (req.cookies._do === "true") {
    mock.response.status = req.cookies._mystatus;
    mock.response.body = mock._config;
  }
};

export default fn;
