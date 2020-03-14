const path = require("path");
const visit = require("unist-util-visit");
const puppeteer = require("puppeteer");
// Imports remove to remove style tags from svgs
const remove = require('unist-util-remove')
const fromXml = require('xast-util-from-xml')
const toXml = require('xast-util-to-xml')

function renderSvg(container, definition, theme, id, mermaidOptions) {
  try {
    window.mermaid.initialize({
      ...mermaidOptions,
      theme
    });
    const svgId = id ? id : 'mermaid-' + Date.now().toString()
    let graph = window.mermaid.render(svgId, definition);
    return graph
  } catch (e) {
    return `${e}`;
  }
}

async function render(browser, definition, theme, viewport, removeStyleTags, svgId, mermaidOptions) {
  const page = await browser.newPage();
  page.setViewport(viewport);
  await page.goto(`file://${path.join(__dirname, "render.html")}`);
  await page.addScriptTag({
    path: require.resolve("mermaid/dist/mermaid.min.js")
  });
  let graph = await page.$eval(
    "#container",
    renderSvg,
    definition,
    theme,
    svgId,
    mermaidOptions
  );

  if (removeStyleTags) {
    const xmlAST = fromXml(graph)
    remove(xmlAST, node => node.name=='style')
    graph = toXml(xmlAST)
  }
  return graph
}

function mermaidNodes(markdownAST, language) {
  const result = [];
  visit(markdownAST, "code", node => {
    if ((node.lang || "").toLowerCase() === language) {
      result.push(node);
    }
  });
  return result;
}

function getOptions(options) {
  return {
    language: 'mermaid',
    theme :'default',
    viewport: {height: 200, width: 200},
    removeStyleTags: false,
    mermaidOptions: {},
    ...options
  }
}

module.exports = (options) => {
  options = getOptions(options)

  async function transformer(markdownAST) {
    // Check if there is a match before launching anything
    let nodes = mermaidNodes(markdownAST, options.language);
    if (nodes.length === 0) {
      // No nodes to process
      return;
    }
    // Launch virtual browser
    const browser = await puppeteer
      .launch({
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage"
        ]
      })
    await Promise.all(
          nodes.map(async node => {
            node.type = "html";
            node.value = await render(
              browser,
              node.value,
              options.theme,
              options.viewport,
              options.removeStyleTags,
              options.id,
              options.mermaidOptions
            );
          })
        )
    browser.close();
  }
  return transformer;
}
