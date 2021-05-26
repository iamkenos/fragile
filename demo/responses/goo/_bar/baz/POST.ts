import { IMockModule, TFile } from "@iamkenos/fragile";

const fn: IMockModule = ({ req }) => {
  // multipart form data can be captured in req.files
  const files: TFile[] = req.files as any;
  return {
    response: {
      status: 201,
      body: {
        text: req.body,
        json: files.filter(i => i.mimetype === "application/json")
          .map(i => JSON.parse(Buffer.from(i.buffer).toString()))
      }
    }
  };
};

export default fn;
