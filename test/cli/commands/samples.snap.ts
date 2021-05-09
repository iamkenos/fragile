// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`cli/commands/samples should allow creating sample files from the demo files: tsconfig already existing 1`] = `
Array [
  Array [
    "You seem to have already created a tsconfig.json file.
Consider adding the following:",
  ],
  Array [
    "{
  \\"compilerOptions\\": {
    \\"baseUrl\\": \\"./\\",
    \\"module\\": \\"commonjs\\",
    \\"types\\": [\\"node\\"]
  }
}
",
  ],
  Array [
    "Sample files created successfully!
To start serving sample responses, execute:
$ npx fragile ./samples/fragile.conf.ts",
  ],
]
`;

exports[`cli/commands/samples should allow creating sample files from the demo files: tsconfig not yet existing 1`] = `
Array [
  Array [
    "Sample files created successfully!
To start serving sample responses, execute:
$ npx fragile ./samples/fragile.conf.ts",
  ],
]
`;
