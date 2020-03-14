// Import remark to parse markdown
const remark = require("remark");
// Import our plugin
const plugin = require("..");
const fs = require("fs");
const path = require("path");

test("flow graph default", async () => {
  const inputString = [
    "~~~mermaid",
    "graph LR",
    "  A --> B",
    "  B --> C",
    "~~~"
  ].join("\n");
  const expectedString = fs
    .readFileSync(path.resolve(__dirname, "fixtures/flow.html"), "utf8")
    .trim()
    .replace(/\s/g, "");

  const processor = remark().use(plugin, {
    // Static ID to be able to use our fixtures
    id: "magnolia"
  });
  return processor.process(inputString).then(result => {
    const graph = result.contents
      .toString()
      .replace(/\s/g, "");
    expect(graph).toEqual(expectedString);
  });
});


test("flow graph dark", async () => {
  const inputString = [
    "~~~mermaid",
    "graph LR",
    "  A --> B",
    "  B --> C",
    "~~~"
  ].join("\n");
  const expectedString = fs
    .readFileSync(path.resolve(__dirname, "fixtures/flow.dark.html"), "utf8")
    .replace(/\s/g, "")

  const processor = remark().use(plugin, {
    // Static ID to be able to use our fixtures
    id: "magnolia",
    theme: 'dark'
  });
  return processor.process(inputString).then(result => {
    const graph = result.contents
      .toString()
      .replace(/\s/g, "")
    expect(graph).toEqual(expectedString);
  });
});


test("flow graph language", async () => {
  const inputString = [
    "~~~sirene",
    "graph LR",
    "  A --> B",
    "  B --> C",
    "~~~"
  ].join("\n");
  const expectedString = fs
    .readFileSync(path.resolve(__dirname, "fixtures/flow.html"), "utf8")
    .replace(/\s/g, "")

  const processor = remark().use(plugin, {
    // Static ID to be able to use our fixtures
    id: "magnolia",
    language: 'sirene'
  });
  const result = await processor.process(inputString)
  const graph = result.contents
      .toString()
      .replace(/\s/g, "")
  expect(graph).toEqual(expectedString);
});


test("flow graph no style", async () => {
  const inputString = [
    "~~~mermaid",
    "graph LR",
    "  A --> B",
    "  B --> C",
    "~~~"
  ].join("\n");
  const expectedString = fs
    .readFileSync(path.resolve(__dirname, "fixtures/flow.nostyletag.html"), "utf8")
    .replace(/\s/g, "")

  const processor = remark().use(plugin, {
    removeStyleTags: true,
    id: "magnolia"
  });
  const result = await processor.process(inputString)
  const graph = result.contents
    .toString()
    .replace(/\s/g, "")
  expect(graph).toEqual(expectedString);

});
