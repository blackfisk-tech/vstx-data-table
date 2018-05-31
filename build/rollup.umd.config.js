import vue from "rollup-plugin-vue"
import buble from "rollup-plugin-buble"
import filesize from "rollup-plugin-filesize"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import uglify from "rollup-plugin-uglify"
import replace from "rollup-plugin-replace"
import json from "rollup-plugin-json"
import sass from 'rollup-plugin-sass'
import async from 'rollup-plugin-async'

export default {
  input: "src/plugin.js",
  plugins: [
    sass(),
    async(),
    vue({ compileTemplate: true, css: false }),
    json(),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    buble({
      transforms: {
        dangerousForOf: true,
        generator: false
      },
      objectAssign: "Object.assign",
      jsx: "h"
    }),
    commonjs({
      namedExports: {
        'lodash': ['sortBy', 'filter', 'forEach', 'throttle', 'indexOf', 'differenceWith', 'isEqual', 'merge', 'cloneDeep', 'isDate', 'isNumber', 'round', 'isNil', 'get', 'isString', 'delay', 'findIndex', 'orderBy', 'find', 'debounce', 'remove']
      }
    }),
    replace({
      "process.env": JSON.stringify({
        NODE_ENV: "production"
      })
    }),
    uglify(),
    filesize()
  ],
  output: [
    {
      name: "VstxDataTable",
      exports: "named",
      file: `dist/vstx-data-table.min.js`,
      format: "umd"
    }
  ]
};
