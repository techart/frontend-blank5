const userSettings = require("./user.settings");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const styleLintPlugin = require("stylelint-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const utils = require("./webpack/utils");
const webpack = require("webpack");

const jsTestRE = /\.js$/,
	jsxTestRE = /\.jsx?$/,
	tsxTestRE = /\.tsx?$/,
	cssTestRE = /\.(scss|sass|css)$/,
	cssModuleTestRE = /\.module\.s?css$/,
	imgFullTestRE = /\.(cur|gif|jpe?g|png|svg)$/i,
	svgTestRE = /\.svg$/,
	fontTestRE = /\.woff2?(\?\S*)?$/i,
	vueTestRE = /\.vue$/;

var env = process.env.NODE_ENV || "dev";
var production = env === "prod";
var hot = env === "hot";

var date = new Date();

let ImageMinimizerWebpackPlugin = null;

let filenameTemplate = function (template) {
	if (production) {
		return (
			date.getFullYear() +
			"/" +
			(date.getMonth() + 1).toString().padStart(2, "0") +
			"-" +
			date.getDate().toString().padStart(2, "0") +
			"/" +
			date.getHours().toString().padStart(2, "0") +
			"-" +
			date.getMinutes().toString().padStart(2, "0") +
			"-" +
			date.getSeconds().toString().padStart(2, "0") +
			"-" +
			date.getMilliseconds().toString().padStart(3, "0") +
			"/" +
			template
		);
	} else if (userSettings.useTimestampInDevMode) {
		template = template.replace("[name].", `[name].${date.getTime()}.`);
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

// Флаги работы с доп.пакетами
let _withAOS = false,
	_withGSAP = false,
	withIMWP = false,
	_withMobX = false,
	withReact = false,
	_withSwiper = false,
	_withStorybook = false,
	withTS = false,
	withVue = false;

// Определяем наличие AOS в проекте
try {
	let aos = require("aos");
	_withAOS = !!aos;
} catch {
	// ...
}

// Определяем наличие GSAP в проекте
try {
	let gsap = require("gsap");
	_withGSAP = !!gsap;
} catch {
	// ...
}

// Определяем наличие Image-Minimizer-Webpack-Plugin в проекте
try {
	ImageMinimizerWebpackPlugin = require("image-minimizer-webpack-plugin");
	withIMWP = !!ImageMinimizerWebpackPlugin;
} catch {
	// ...
}

// Определяем наличие MobX в проекте
try {
	let mobx = require("mobx");
	_withMobX = !!mobx;
} catch {
	// ...
}

// Определяем наличие React в проекте
try {
	let reactdom = require("react-dom");
	withReact = !!reactdom;
} catch {
	// ...
}

// Определяем наличие swiper в проекте
try {
	let swiper = require("swiper");
	_withSwiper = !!swiper;
} catch {
	// ...
}

// Определяем наличие Storybook в проекте
try {
	let storybook = require("@storybook/core");
	_withStorybook = !!storybook;
} catch {
	// ...
}

// Определяем наличие Typescript в проекте
try {
	let ts = require("typescript");
	withTS = !!ts;
} catch {
	// ...
}

// Определяем наличие Vue в проекте
try {
	let vue = require("vue");
	withVue = !!vue;
} catch {
	// ...
}

/**
Plugins ******************************************************************************************************************
**/

var provideVariables = {};
if (withVue) {
	provideVariables["Vue"] = ["vue", "default"];
}
if (userSettings.providePlugin) {
	provideVariables = Object.assign(
		provideVariables,
		userSettings.providePlugin
	);
}

var plugins = [
	new styleLintPlugin({
		customSyntax: userSettings.mainStyleType,
		emitError: true,
		emitWarning: true,
		quiet: false,
	}),

	new MiniCssExtractPlugin({
		filename: userSettings.MiniCssExtractTemplate
			? userSettings.MiniCssExtractTemplate
			: filenameTemplate("css/[name].css"),
	}),

	new AssetsPlugin({
		filename: path.join("assets", env + ".json"),
		path: __dirname,
		prettyPrint: true,
	}),

	new webpack.ProvidePlugin(provideVariables),
	new ESLintPlugin({}),
	new CircularDependencyPlugin({
		exclude: /node_modules/,
		failOnError: false,
		cwd: process.cwd(),
	}),
];
if (withVue) {
	const { VueLoaderPlugin } = require("vue-loader");
	plugins.push(new VueLoaderPlugin());
}
if (production && userSettings.useBundleAnalyzer) {
	plugins.push(
		new BundleAnalyzerPlugin({
			analyzerMode: "static",
			reportFilename: path.join(__dirname, "bundle.html"),
			openAnalyzer: false,
		})
	);
}

/**
Loaders ******************************************************************************************************************
**/

let cssLoader = {
	loader: "css-loader",
	options: {
		sourceMap: !production,
		url: {
			filter: (url, _resourcePath) => {
				if (url.startsWith("/")) {
					return false;
				}
				if (url.startsWith("../")) {
					return false;
				}
				return true;
			},
		},
		modules: "icss",
	},
};
let cssProcessing = [
	MiniCssExtractPlugin.loader,
	cssLoader,
	"postcss-loader",
	"sass-loader",
];

// Подключаем лоудер prettier
if (userSettings.usePrettier && process.env.NODE_ENV === "dev") {
	cssProcessing.push({
		loader: path.resolve("./webpack/loaders/prettier.js"),
		options: {
			pathModules: /node_modules/g,
		},
	});
}

const jsLoaders = ["babel-loader"];

// Подключаем лоудер prettier
if (userSettings.usePrettier && process.env.NODE_ENV === "dev") {
	jsLoaders.push({
		loader: path.resolve("./webpack/loaders/prettier.js"),
		options: {
			pathModules: /node_modules/g,
		},
	});
}

let minimizerQueue = [
	// Работа с CSS: объединение и сортировка @media-запросов, "сжатие" чистого CSS
	new CssMinimizerPlugin({
		minify: [
			async (data, inputMap, _minimizerOptions) => {
				const postcss = require("postcss"),
					result = {
						code: Object.values(data)[0],
						map: inputMap,
						warnings: [],
						errors: [],
					};

				await postcss([
					require("postcss-sort-media-queries")({
						sort: "mobile-first",
					}),
				])
					.process(result.code, { from: Object.keys(data)[0] })
					.then((output) => {
						result.code = output.css;
					});

				return result;
			},
			CssMinimizerPlugin.cssnanoMinify,
		],
		minimizerOptions: [{}, {}],
	}),

	// Поддержка встроенного Terser плагина
	"...",
];

// Работа с изображениями
if (withIMWP) {
	let sharpOptions = {
			avif: { lossless: true },
			git: {},
			jpeg: { quality: 100 },
			png: {},
			webp: { lossless: true },
		},
		svgoOptions = {
			multipass: true,
			plugins: ["preset-default"],
		};

	if ("undefined" !== typeof userSettings.images["sharp"]) {
		sharpOptions = Object.assign(sharpOptions, userSettings.images.sharp);
	}

	minimizerQueue.push(
		new ImageMinimizerWebpackPlugin({
			minimizer: {
				implementation: ImageMinimizerWebpackPlugin.sharpMinify,
				options: {
					encodeOptions: sharpOptions,
				},
			},
		})
	);

	if ("undefined" !== typeof userSettings.images["svgo"]) {
		svgoOptions = Object.assign(svgoOptions, userSettings.images.svgo);
	}

	minimizerQueue.push(
		new ImageMinimizerWebpackPlugin({
			minimizer: {
				implementation: ImageMinimizerWebpackPlugin.svgoMinify,
				options: {
					encodeOptions: svgoOptions,
				},
			},
		})
	);
}

/**
Exports ******************************************************************************************************************
**/

let _exports = {
	stats: stats,
	mode: production ? "production" : "development",
	entry: userSettings.entry,
	devtool: production ? false : "source-map",
	target: "web",
	output: {
		path: utils.buildPath(env),
		filename: filenameTemplate("js/[name].js"),
		publicPath: utils.publicPath(env),
		devtoolModuleFilenameTemplate: "[absolute-resource-path]",
		devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]",
		libraryExport: "default",
		clean: !production,
	},
	resolve: {
		extensions: [".css", ".js", ".sass", ".scss"],
		alias: {
			font: "font",
		},
		byDependency: {
			style: {
				mainFiles: ["custom"],
			},
		},
		modules: [
			".",
			path.join(__dirname, "src"),
			path.join(__dirname, "src/api"),
			path.join(__dirname, "src/component"),
			path.join(__dirname, "src/style"),
			path.join(__dirname, "node_modules"),
		],
		plugins: [
			new DirectoryNamedWebpackPlugin({
				honorPackage: false,
			}),
		],
	},
	resolveLoader: {
		modules: [path.join(__dirname, "node_modules")],
	},
	module: {
		rules: [
			{
				test: jsTestRE,
				exclude: /node_modules/,
				use: jsLoaders,
			},
			{
				test: cssTestRE,
				use:
					userSettings.cssProcessing &&
					0 < userSettings.cssProcessing.length
						? userSettings.cssProcessing
						: cssProcessing,
			},
			{
				test: imgFullTestRE,
				include: [
					path.resolve(__dirname, "img"),
					path.resolve(__dirname, "node_modules"),
				],
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize:
							"undefined" !==
							typeof userSettings["base64MaxFileSize"]
								? userSettings.base64MaxFileSize
								: 0,
					},
				},
				generator: {
					filename: "[path][hash][ext]",
				},
			},
			{
				test: fontTestRE,
				type: "asset/resource",
				parser: {
					dataUrlCondition: {
						maxSize: 180000,
					},
				},
				generator: {
					filename: "[path][name][ext]",
				},
			},
		],
	},
	plugins: plugins,
	optimization: {
		minimizer: minimizerQueue,
	},
};

// + Работа с React
if (withReact) {
	_exports.resolve.extensions.push(".jsx");
	let block = null,
		jsBlock = null,
		cssBlock = null,
		imgBlock = null;
	for (block of _exports.module.rules) {
		if (jsTestRE === block.test) {
			jsBlock = block;
		}
		if (cssTestRE === block.test) {
			cssBlock = block;
		}
		if (imgFullTestRE === block.test) {
			imgBlock = block;
		}
		if (jsBlock && cssBlock && imgBlock) {
			break;
		}
	}
	if (jsBlock) {
		let index = _exports.module.rules.indexOf(jsBlock);
		_exports.module.rules.splice(index, 1, {
			test: jsxTestRE,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env", "@babel/preset-react"],
				},
			},
		});
	}
	if (cssBlock) {
		let index = _exports.module.rules.indexOf(cssBlock),
			moduleBlock = JSON.parse(JSON.stringify(cssBlock));
		moduleBlock.test = cssModuleTestRE;
		moduleBlock.use[1].options.modules = {
			mode: "local",
			localIdentName: "[folder]__[local]--[hash:base64:3]",
		};
		_exports.module.rules[index].exclude = cssModuleTestRE;
		_exports.module.rules.splice(index + 1, 0, moduleBlock);
	}
	if (imgBlock) {
		let index = _exports.module.rules.indexOf(imgBlock);
		_exports.module.rules.splice(index, 0, {
			test: svgTestRE,
			issuer: /\.(jsx?|tsx?)$/,
			use: ["@svgr/webpack"],
		});
	}
	_exports.resolve.modules.splice(
		-2,
		0,
		path.join(__dirname, "src/component-react")
	);
}

// + Работа с Typescript
if (withTS) {
	const loaders = [
		{
			loader: "ts-loader",
		},
	];

	if (withVue) {
		loaders[0]["options"] = {
			appendTsSuffixTo: [vueTestRE],
		};
	}

	// Подключаем prettier
	if (userSettings.usePrettier && process.env.NODE_ENV === "dev") {
		loaders.push({
			loader: path.resolve("./webpack/loaders/prettier.js"),
			options: {
				pathModules: /node_modules/g,
			},
		});
	}

	_exports.resolve.extensions.push(".ts");
	_exports.resolve.extensions.push(".tsx");
	_exports.module.rules.push({
		test: tsxTestRE,
		use: loaders,
	});
}

// + Работа с Vue
if (withVue) {
	_exports.resolve.extensions.push(".vue");
	_exports.resolve.alias["vue$"] = "vue/dist/vue.esm-bundler.js";
	_exports.module.rules.push({
		test: vueTestRE,
		use: ["vue-loader"],
	});
	_exports.resolve.modules.splice(
		-2,
		0,
		path.join(__dirname, "src/component-vue")
	);
}

if (userSettings.aliases) {
	_exports.resolve.alias = Object.assign(
		_exports.resolve.alias,
		userSettings.aliases
	);
}

if (userSettings.exposeGlobal) {
	userSettings.exposeGlobal.forEach(function (item) {
		let overrideValue =
			"undefined" !== typeof item["override"] ? item.override : true;
		_exports.module.rules.push({
			test: require.resolve(item.module),
			loader: "expose-loader",
			options: {
				exposes: {
					globalName: item.name,
					override: overrideValue,
				},
			},
		});
	});
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
				_exports.resolve.modules.splice(-2, 0, path);
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
	let host = utils.hotUrl();
	_exports.output.publicPath = host + utils.publicPath("dev");
	_exports.devServer = {
		allowedHosts: "all",
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Expose-Headers": "*",
		},
		historyApiFallback: true,
		host: "0.0.0.0",
		port: 8889,
		hot: true,
		client: {
			logging: "verbose",
			webSocketURL: host.replace("http", "ws") + "/ws",
		},
		static: [
			{
				directory: path.resolve(userSettings.docRoot),
			},
		],
	};
}

module.exports = _exports;
