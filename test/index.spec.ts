import * as fragile from "@src/index";

describe("fragile", () => {
  it("should expose it's api", () => {
    expect(fragile).toMatchSnapshot();
  });
});
