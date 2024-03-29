const fn = ({ req }) => {
  return {
    overrides: {
      rate: { limit: 4 }
    },
    response: {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: { ...req.body, ...req.cookies }
    }
  };
};

export default fn;
