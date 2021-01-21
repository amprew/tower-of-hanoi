import nunjucks from 'nunjucks';
import { resolve, isAbsolute } from 'path';
import fs from 'fs';

const PLUGIN_NAME = 'nunjucks-plugin';

const actualPath = (path) => {
  return isAbsolute(path) ? path : resolve(path);
};

export default function NunjucksPlugin({
  input,
  output,
  vars = {}
}) {
  return {
    name: PLUGIN_NAME,
    async buildStart() {
      this.addWatchFile(actualPath(input));
    },
    async generateBundle(e) {
      const { file: bundlePath } = e;

      const actualPathIn = actualPath(input);
      const templateContent = fs.readFileSync(actualPathIn, 'utf-8');
      const rendered = nunjucks.renderString(templateContent, { ...vars, bundlePath });

      const actualPathOut = actualPath(output)
      fs.writeFileSync(actualPathOut, rendered);
    }
  }
}
