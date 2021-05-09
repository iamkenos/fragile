// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`cli/resources should expose a local config template file 1`] = `
"import { IConfig } from \\"@iamkenos/fragile\\";

const config: Partial<IConfig> = <%- JSON.stringify(answers) %>;

export default config;
"
`;

exports[`cli/resources should expose a response module template file 1`] = `
"import { IMockModule } from \\"@iamkenos/fragile\\";

const fn: IMockModule = () => {
  return {
    response: {
      status: <%= response.status %>,
      headers: <%- JSON.stringify(response.headers) %>,
      body: <%- response.body %>
    }
  };
};

export default fn;
"
`;

exports[`cli/resources should expose a ts config template file 1`] = `
"{
  \\"compilerOptions\\": {
    \\"baseUrl\\": \\"./\\",
    \\"module\\": \\"commonjs\\",
    \\"types\\": [\\"node\\"]
  }
}
"
`;
