const
	path = require('path'),

	DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')
;


// Устанавливаем настройки Storybook и webpack
module.exports = {
	stories: [
		"../src/stories/**/*.stories.@(js|jsx|ts|tsx)"
	],

	addons: [
		"@storybook/addon-backgrounds",
		"@storybook/addon-controls",
		"@storybook/addon-docs",
		"@storybook/addon-viewport",
	],

	framework: "@storybook/html",

	core: {
		"builder": "@storybook/builder-webpack5",
	},

	// Доработки настроек Webpack
	webpackFinal: async (config) => {


		for (let i in config.module.rules) {
			// Дополняем правило для обработки html файлов
			if (String(config.module.rules[i].test) == /\.html$/) {
				config.module.rules[i] = {
					test: /\.html$/,
					loader: "html-loader",
					options: {
						sources: false,
					}
				};
			}
		}

		// Добавляем обработку SCSS-файлов
		config.module.rules.push({
			test: /\.scss$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						url: (url, resourcePath) => {
							if (url.startsWith('/')) {
								return false;
							}
							if (url.startsWith('../')) {
								return false;
							}
							return true;
						}
					}
				},
				{
					loader: "postcss-loader",
					options: {
						postcssOptions: {
							plugins: [
								[
									"autoprefixer",
									{
										// Options
									},
								],
							],
						},
					}
				},
				'sass-loader',
			],
		});

		// Добавляем обработку шрифтов
		config.module.rules.push({
			test: /\.woff2?(\?\S*)?$/i,
			type: 'asset/resource',
			generator: {
				filename: 'font/[name][ext]',
			}
		});

		// Добавляем обработку изображений
		config.module.rules.push({
			test: /\.(svg|jpg|png|gif|jpeg|webp)/i,
			type: 'asset/resource',
			generator: {
				filename: 'images/[name][ext]',
			}
		});

		config.resolve = {
			extensions: ['.js', '.vue', '.scss', '.less', '.css', '.sass'],
			alias: {
				'tao-bem': '@webtechart/tao-bem',
			},
			byDependency: {
				style: {
					mainFiles: ["custom"],
				},
			},
			modules: [
				path.join(__dirname, '../src'),
				path.join(__dirname, '../node_modules'),
				path.join(__dirname, '../'),
			],
			plugins: [
				new DirectoryNamedWebpackPlugin({
					honorPackage: false,
				}),
			],
		};

		exposeGlobal = [
			{'module': 'jquery', 'name': '$'},
			{'module': 'jquery', 'name': 'jQuery'},
		];

		exposeGlobal.forEach(function (item) {
			config.module.rules.push({
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

		return config;
	},
};