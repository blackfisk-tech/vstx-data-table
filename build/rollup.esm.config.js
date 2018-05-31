import vue from "rollup-plugin-vue"
import buble from "rollup-plugin-buble"
import filesize from "rollup-plugin-filesize"
import json from "rollup-plugin-json"
import sass from 'rollup-plugin-sass'
import async from 'rollup-plugin-async'
import uglify from "rollup-plugin-uglify"

export default {
  input: "src/plugin.js",
  plugins: [
    sass(),
    async(),
    vue({ compileTemplate: true, css: false }),
    json(),
    buble({
      transforms: {
        generator: false
      },
      objectAssign: "Object.assign",
      jsx: "h"
    }),
    uglify(),
    filesize()
  ],
  output: [
    {
      file: `dist/vstx-data-table.min.esm.js`,
      format: "es"
    }
  ]
};
