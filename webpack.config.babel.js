import { resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = env => {
  const styleLoader = [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 1 } },
    'postcss-loader',
    'sass-loader',
  ];

  const plugins = [
    new HtmlWebpackPlugin({ template: 'index.html', hash: true }),
  ];

  const productionPlugins = [
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' }
    }),
  ];

  return {
    entry: './index.js',
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'build'),
      pathinfo: !env.prod,
    },
    context: resolve(__dirname, 'src'),
    devtool: env.prod ? 'source-map' : 'cheap-source-map',
    bail: env.prod,
    module: {
      rules: [
        { test: /\.jsx?$/, use: 'babel-loader', exclude: /^(?!.*src)/ },
        { test: /\.scss$/, use: styleLoader },
        { test: /\.svg$/, use: 'svg-sprite-loader' },
      ],
    },
    plugins: plugins.concat(env.prod ? productionPlugins : []),
  };
}
