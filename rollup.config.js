import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import NunjucksPlugin from './rollup-nunjucks';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const ENVIRONMENT = (() => {
  const { NODE_ENV } = process.env;

  return NODE_ENV === 'production' ? NODE_ENV : 'development'
})();

export default {
  input: 'src/index.tsx',
  output: {
    file: './public/dist/main.js',
    format: 'cjs'
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(ENVIRONMENT)
    }),
    babel({extensions}),
    nodeResolve({ extensions, browser: true }),
    commonjs(),
    terser({
      mangle: true,
      output: {
        beautify: false,
        comments: false
      },
      compress: true,
      warnings: false
    }),
    NunjucksPlugin({
      input: './src/index.html',
      output: './public/index.html',
      vars: {
        ENVIRONMENT
      }
    })
  ]
};
