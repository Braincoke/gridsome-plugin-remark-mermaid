# gridsome-remark-mermaid

Use [mermaid](https://mermaid-js.github.io) code blocks in your markdown file to generate diagrams with Gridsome and remark.

This plugin is heavily inspired by [gatsby-remark-mermaid](https://github.com/ChappIO/gatsby-remark-mermaid).
It uses **server-side rendering** to generate inline SVG code during the build process.

## Install

~~~bash
npm install gridsome-plugin-remark-mermaid
~~~

## Usage

Configure `gridsome.config.js` to use the plugin.
Make sure this plugin is imported before any other plugin that processes code blocks such as *@gridsome/remark-prismjs* or *gridsome-plugin-remark-shiki*.

~~~js
module.exports = {
  siteName: 'Gridsome Blog',
  siteDescription: 'A simple blog designed with Gridsome',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/posts/**/*.md',
        typeName: 'Post',
        route: '/blog/:slug'
      }
    }
  ],
  transformers: {
    remark: {
      plugins: [
        // Add remark-mermaid plugin
        'gridsome-plugin-remark-mermaid',
        '@gridsome/remark-prismjs'
      ]
    }
  },
}
~~~

Then use mermaid code blocks in your markdown to generate diagrams:

  ~~~mermaid
  graph LR
    A --> B
    B --> C
  ~~~

## Styling

The generated SVG is wrapped in `<div class="mermaid"></div>` to help you customize your styles.

When using the `removeStyleTags` attribute, you will need to import your Mermaid themes yourself. You can find an example project [here](https://github.com/Braincoke/starter-gridsome-mermaid).

## Options

| Name            | Default               | Description                                                                                                                                                     |
| --------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| language        | "mermaid"             | The code block language triggering a SVG generation. Change it to `"graph"` to create diagrams with `~~~graph`.                                                 |
| theme           | "default"             | This value can be set to `"dark"`, `"neutral"`, `"forest"` or `"default"`. Try them on the [mermaid editor](https://mermaid-js.github.io/mermaid-live-editor/). |
| viewport.width  | 200                   | The desired viewport width                                                                                                                                      |
| viewport.height | 200                   | The desired viewport height                                                                                                                                     |
| removeStyleTags | false                 | Remove all style tags from the generated SVG. If you use this option you will have to import the mermaid css at some point                                      |
| id              | `mermaid-<currentTime>` | Sets the identifier of the SVG. Defaults to a unique ID based on the time of generation                                                                         |
| mermaidOptions  | {}                    | Pass some custom [mermaid configuration options](https://mermaid-js.github.io/mermaid/#/mermaidAPI?id=configuration) to `mermaid.initialize()`                                                                                    |

The default options are:

~~~js
{
  language: "mermaid",
  theme: "default",
  viewport: {
    width: 200,
    height: 200
  },
  id: null,
  removeStyleTags: false,
  mermaidOptions: {}
}
~~~
