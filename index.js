const { getOptions } = require("loader-utils");
const readingTime = require("reading-time");
const textr = require("remark-textr");
const slug = require("remark-slug");
const mdx = require("@mdx-js/mdx");
const mdxTableOfContents = require("mdx-table-of-contents");
const mdxExportJSONByDefault = require("mdx-constant");
const grayMatter = require("gray-matter");
const typography = require("./typography");

module.exports = async function(source) {
  let result
  const { data, content: mdxContent } = grayMatter(source);
  const callback = this.async()
  const options = Object.assign(
    {
      remarkPlugins: [
        slug,
        [textr, { plugins: [typography] }]
      ],
      compilers: [
        mdxTableOfContents,
        mdxExportJSONByDefault("frontMatter", data)
      ]
    },
    getOptions(this),
    {filepath: this.resourcePath}
  );

  try {
    result = await mdx(mdxContent, options)
  } catch(err) {
    return callback(err)
  }

  const estimatedReadingTime = readingTime(source)

  let code = `
import React from "react"
import { mdx } from "@mdx-js/react"
export const readingTime = ${JSON.stringify(estimatedReadingTime)}
${result}
`

  return callback(null, code)
}
