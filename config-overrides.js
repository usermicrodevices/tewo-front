const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  fixBabelImports,
  addLessLoader,
} = require('customize-cra');
const antThemeModifications = require('./src/themes/antTheme.js');

module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: antThemeModifications,
    },
  }),
);
