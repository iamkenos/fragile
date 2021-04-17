import { IMockModule } from "@iamkenos/fragile";

const fn: IMockModule = () => {
  return {
    overrides: {
      proxy: {
        target: "https://reqres.in/api/register",
        changeOrigin: true,
        // they have good documentation too
        // https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/modify-post.md
        onProxyReq(proxyReq, req) {
          let body = req.body;
          body = Object.keys(body)
            .map(key => {
              return encodeURIComponent(key) + "=" + encodeURIComponent(body[key]);
            })
            .join("&");
          proxyReq.setHeader("content-type", "application/x-www-form-urlencoded");
          proxyReq.setHeader("content-length", body.length);
          proxyReq.write(body);
          proxyReq.end();
        }
      }
    },
    response: {
      status: 400,
      body: "this will be ignored"
    }
  };
};

export default fn;
