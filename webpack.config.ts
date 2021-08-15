import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import {Configuration} from 'webpack-dev-server';

interface Config extends webpack.Configuration {
  devServer?: Configuration;
}

const config: Config = {
	mode: 'development',
	entry: './src/gui/root.ts',

	plugins: [
		new HtmlWebpackPlugin({template: './src/gui/index.ejs'}),
	],

	devtool: 'inline-source-map',
	devServer: {
		compress: true,
		port: 9000,
		https: true,
	},

	resolve: {
		extensions: ['.ts', '.js', '.json'],
		alias: {
			'#components': path.resolve(__dirname, './src/gui/components'),
			'#services': path.resolve(__dirname, './src/gui/services'),
			'#artifacts': path.resolve(__dirname, './artifacts'),
		},
	},

	watchOptions: {
		ignored: [
			'gui/types',
		],
	},

	module: {
		rules: [
			{test: /\.ts$/, loader: 'ts-loader'},
			{test: /\.svg$/, type: 'asset/source'},
		],
	},
};

export default config;
