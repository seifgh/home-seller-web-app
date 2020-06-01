const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'public', 'index.html'),
    filename: './index.html',
    inject: 'body'
});

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
  filename: './static/css/home.styles.css',
  chunkFilename: '[id].css',
});

module.exports = {
  watch: true,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000
  },
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: './static/js/home.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
    	]
      },
      {
        test: /\.m?js$/,
      	exclude: /(node_modules|bower_components)/,
      	use: {
      	  loader: 'babel-loader',
      	  options: {
      	    presets: ['@babel/preset-env']
      	  }
      	}
      },

    ],
  },
  plugins:[
  	HtmlWebpackPluginConfig,
  	MiniCssExtractPluginConfig
  ]
};
