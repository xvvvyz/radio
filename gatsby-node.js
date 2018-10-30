const set = require('lodash/set');

exports.onCreateWebpackConfig = ({ actions, loaders, stage }) => {
  const config = {};

  if (stage === 'build-html') {
    set(config, 'module.rules', [{
      test: [
        /whatwg-fetch/,
      ],
      use: loaders.null(),
    }]);
  }

  return actions.setWebpackConfig(config);
};
