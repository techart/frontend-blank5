const userSettings = require('./user.settings');
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const utils = require('./webpack/utils');
const webpack = require('webpack');

const
	jsTestRE = /\.js$/,
	cssTestRE = /\.(scss|sass|css)$/,
	cssModuleTestRE = /\.module\.s?css$/
;

var env = process.env.NODE_ENV || 'dev';
var production = env === 'prod';
var hot = env === 'hot';

var date = new Date();


let filenameTemplate = function(template) {
	if (production) {
		return date.getFullYear()
			+ '/' + (date.getMonth() + 1).toString().padStart(2, '0')
			+ '-' + date.getDate().toString().padStart(2, '0')
			+ '/' + date.getHours().toString().padStart(2, '0')
			+ '-' + date.getMinutes().toString().padStart(2, '0')
			+ '-' + date.getSeconds().toString().padStart(2, '0')
			+ '-' + date.getMilliseconds().toString().padStart(3, '0')
			+ '/' + template;
	}
	return template;
};

let stats = {
	hash: false,
	version: false,
	timings: false,
	assets: false,
	chunks: false,
	modules: false,
	children: false,
	source: false,
	errors: true,
	errorDetails: true,
	warnings: true,
	colors: true,
};
Object.assign(stats, userSettings.stats);


/**
Addons *******************************************************************************************************************
**/

// Флаги рабьоты с доп.пакетами
let
	withAOS = false,
	withBEM = false,
	withGSAP = false,
	withJquery = false,
	withMobX = false,
	withReact = false,
	withSwiper = false,
	withStorybook = false,
	withTS = false,
	withVue = false
;

// Определяем наличие AOS в проекте
try {
	let aos = require('aos');
	withAOS = !!aos;
} catch {}

// Определяем наличие tao-bem в проекте
try {
	let bem = fs.existsSync('./node_modules/@webtechart/tao-bem/lib/bem.js');
	withBEM = !!bem;
} catch {}

// Определяем наличие GSAP в проекте
try {
	let gsap = require('gsap');
	withGSAP = !!gsap;
} catch {}

// Определяем наличие jQuery в проекте
try {
	let jquery = require('jquery');
	withJquery = !!jquery;
} catch {}

// Определяем наличие MobX в проекте
try {
	let mobx = require('mobx');
	withMobX = !!mobx;
} catch {}

// Определяем наличие React в проекте
try {
	let reactdom = require('react-dom');
	withReact = !!reactdom;
} catch {}

// Определяем наличие swiper в проекте
try {
	let swiper = require('swiper');
	withSwiper = !!swiper;
} catch {}

// Определяем наличие Storybook в проекте
try {
	let storybook = require('@storybook/core');
	withStorybook = !!storybook;
} catch {}

// Определяем наличие Typescript в проекте
try {
	let ts = require('typescript');
	withTS = !!ts;
} catch {}

// Определяем наличие Vue в проекте
try {
	let vue = require('vue');
	withVue = !!vue;
} catch {}


/**
Plugins ******************************************************************************************************************
**/

var provideVariables = {};
if (withBEM) {
	provideVariables['BEM'] = ['@webtechart/tao-bem', 'default'];
}
if (withJquery) {
	provideVariables['$'] = 'jquery';
	provideVariables['jQuery'] = 'jquery';
}
if (withVue) {
	provideVariables['Vue'] = ['vue', 'default'];
}
if (userSettings.providePlugin) {
	provideVariables = Object.assign(provideVariables, userSettings.providePlugin);
}

var plugins = [
	new styleLintPlugin({
		customSyntax: userSettings.mainStyleType,
		emitError: true,
		emitWarning: true,
		quiet: false,
	}),
	
	new MiniCssExtractPlugin({
		filename: userSettings.MiniCssExtractTemplate ? userSettings.MiniCssExtractTemplate : filenameTemplate('css/[name].css'),
	}),
	
	new AssetsPlugin({
		filename: path.join('assets', env + '.json'),
		path: __dirname,
		prettyPrint: true,
	}),
	
	new webpack.ProvidePlugin(provideVariables),
	new ESLintPlugin({})
];
if (withVue) {
	const { VueLoaderPlugin } = require('vue-loader');
	plugins.push(new VueLoaderPlugin());
}

/**
Loaders ******************************************************************************************************************
**/

let cssLoader = {
	loader: 'css-loader',
	options: {
		sourceMap: !production,
		url: (url, resourcePath) => {
			if (url.startsWith('/')) {
				return false;
			}
			if (url.startsWith('../')) {
				return false;
			}
			return true;
		},
		modules: false
	}
};
let cssProcessing = [
	MiniCssExtractPlugin.loader,
	cssLoader,
	'postcss-loader',
	'sass-loader'
];

let urlLoader = {
	loader: 'url-loader',
	options: {
		limit: userSettings.base64MaxFileSize,
		name: '[path][name].[ext]',
	}
};

let imageWebpackLoader = {
	loader: 'image-webpack-loader',
	options: userSettings.images
};

/**
Exports ******************************************************************************************************************
**/

let _exports = {
	stats: stats,
	mode: production? 'production' : 'development',
	entry: userSettings.entry,
	devtool: production ? false : 'source-map',
	target: 'web',
	output: {
		path: utils.buildPath(env),
		filename: filenameTemplate('js/[name].js'),
		publicPath: utils.publicPath(env),
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]',
		libraryExport: 'default',
	},
	resolve: {
		extensions: ['.js', '.scss', '.css', '.sass'],
		alias: {
			font: 'font',
		},
		byDependency: {
			style: {
				mainFiles: ["custom"],
			},
		},
		modules: [
			path.join(__dirname, 'src'),
			path.join(__dirname, 'src/style'),
			path.join(__dirname, 'node_modules'),
			'.',
			'img',
		],
		plugins: [
			new DirectoryNamedWebpackPlugin({
				honorPackage: false,
			}),
		],
	},
	resolveLoader: {
		modules: [path.join(__dirname, 'node_modules')],
	},
	module: {
		rules: [
			{
				test: jsTestRE,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: cssTestRE,
				use : (userSettings.cssProcessing && (0 < userSettings.cssProcessing.length)) ? userSettings.cssProcessing : cssProcessing,
			},
			{
				test: /\.(png|gif|jpe?g|svg|cur)$/i,
				include: [path.resolve(__dirname, 'img'), path.resolve(__dirname, 'node_modules')],
				use: [urlLoader, imageWebpackLoader],
			},
			{
				test: /\.woff2?(\?\S*)?$/i,
				use: [urlLoader],
			},
		]
	},
	plugins: plugins
}


// + Работа с tao-bem
if (withBEM) {
	_exports.resolve.alias['tao-bem'] = '@webtechart/tao-bem';
}

// + Работа с jQuery
if (withJquery) {
	_exports.module.rules.push({
		test: require.resolve('jquery'),
		loader: 'expose-loader',
		options: {
			exposes: {
				globalName: '$',
				override: true,
			}
		}
	});
	_exports.module.rules.push({
		test: require.resolve('jquery'),
		loader: 'expose-loader',
		options: {
			exposes: {
				globalName: 'jQuery',
				override: true,
			}
		}
	});
}
if (userSettings.exposeGlobal) {
	userSettings.exposeGlobal.forEach(function (item) {
		_exports.module.rules.push({
			test: require.resolve(item.module),
			loader: 'expose-loader',
			options: {
				exposes: {
					globalName: item.name,
					override: true,
				}
			}
		});
	});
}

// + Работа с React
if (withReact) {
	_exports.resolve.extensions.push('.jsx');
	let
		block = null,
		jsBlock = null,
		cssBlock = null
	;
	for (block of _exports.module.rules) {
		if (jsTestRE === block.test) {
			jsBlock = block;
		}
		if (cssTestRE === block.test) {
			cssBlock = block;
		}
		if (jsBlock && cssBlock) {
			break;
		}
	}
	if (jsBlock) {
		let index = _exports.module.rules.indexOf(jsBlock);
		_exports.module.rules.splice(index, 1, {
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react']
				}
			}
		});
	}
	if (cssBlock) {
		let
			index = _exports.module.rules.indexOf(cssBlock),
			moduleBlock = JSON.parse(JSON.stringify(cssBlock))
		;
		moduleBlock.test = cssModuleTestRE;
		moduleBlock.use[1].options.modules = {
			mode: 'local',
			localIdentName: '[folder]__[local]--[hash:base64:3]'
		};
		_exports.module.rules[index].exclude = cssModuleTestRE;
		_exports.module.rules.splice(index + 1, 0, moduleBlock);
	}
}

// + Работа с Typescript
if (withTS) {
	_exports.resolve.extensions.push('.ts');
	_exports.resolve.extensions.push('.tsx');
	_exports.module.rules.push({
		test: /\.tsx?$/,
		use: {
			loader: 'ts-loader',
		},
	});
}

// + Работа с Vue
if (withVue) {
	_exports.resolve.extensions.push('.vue');
	_exports.resolve.alias['vue$'] = 'vue/dist/vue.esm-bundler.js';
	_exports.module.rules.push({
		test: /\.vue$/,
		use: ['vue-loader'],
	});
}

if (userSettings.aliases) {
	_exports.resolve.alias = Object.assign(_exports.resolve.alias, userSettings.aliases);
}

if (userSettings.resolve) {
	if (userSettings.resolve.extensions) {
		userSettings.resolve.extensions.forEach((ext) => {
			if (-1 === _exports.resolve.extensions.indexOf(ext)) {
				_exports.resolve.extensions.push(ext);
			}
		});
	}
	if (userSettings.resolve.modules) {
		userSettings.resolve.modules.forEach((path) => {
			if (-1 === _exports.resolve.modules.indexOf(path)) {
				_exports.resolve.modules.push(path);
			}
		});
	}
}

if (userSettings.module && userSettings.module.rules) {
	userSettings.module.rules.forEach((rule) => {
		_exports.module.rules.push(rule);
	});
}

if (0 < Object.keys(userSettings.output).length) {
	_exports.output = userSettings.output;
}

/**
Hot ******************************************************************************************************************
**/

if (hot) {
	_exports.output.publicPath = utils.hotUrl() + utils.publicPath('dev');
	_exports.devServer = {
		publicPath: _exports.output.publicPath,
		hot: true,
		historyApiFallback: true,
		stats: userSettings.stats,
		port: userSettings.hotPort,
		host: utils.hotHost(),
		disableHostCheck: true,
		https: {
			key: fs.readFileSync('/opt/techart/projectclone/config/ssl/server.key'),
			cert: fs.readFileSync('/opt/techart/projectclone/config/ssl/hot.crt'),
			ca: fs.readFileSync('/opt/techart/projectclone/config/ssl/generate/rootCA.pem'),
		},
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Expose-Headers": "*"
		}
	};
}

module.exports = _exports;
