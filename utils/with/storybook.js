const lib = require("./_lib"),
	fs = require("fs"),
	storybookScripts = {
		storybook: "./node_modules/.bin/start-storybook -p 6006",
		"build-storybook": "./node_modules/.bin/build-storybook",
		"prod-storybook": "node utils/storybook.js",
	},
	storybookFiles = {
		"main.js":
			"const\n\tpath = require('path'),\n\n\tDirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')\n;\n\n\n// Устанавливаем настройки Storybook и webpack\nmodule.exports = {\n\tstories: [\n\t\t'../src/stories/**/*.stories.@(js|jsx|ts|tsx)'\n\t],\n\n\taddons: [\n\t\t'@storybook/addon-backgrounds',\n\t\t'@storybook/addon-controls',\n\t\t'@storybook/addon-docs',\n\t\t'@storybook/addon-viewport',\n\t],\n\n\tframework: '@storybook/html',\n\n\tcore: {\n\t\t'builder': '@storybook/builder-webpack5',\n\t},\n\n\tfeatures: {\n\t\tstoryStoreV7: true,\n\t},\n\n\t// Доработки настроек Webpack\n\twebpackFinal: async (config) => {\n\t\t// Флаги работы с доп.пакетами\n\t\tlet\n\t\t\twithJquery = false\n\t\t;\n\n\t\t// Определяем наличие jQuery в проекте\n\t\ttry {\n\t\t\tlet jquery = require('jquery');\n\t\t\twithJquery = !!jquery;\n\t\t} catch {}\n\n\n\t\tfor (let i in config.module.rules) {\n\t\t\t// Дополняем правило для обработки html файлов\n\t\t\tif (String(config.module.rules[i].test) == /\\.html$/) {\n\t\t\t\tconfig.module.rules[i] = {\n\t\t\t\t\ttest: /\\.html$/,\n\t\t\t\t\tloader: 'html-loader',\n\t\t\t\t\toptions: {\n\t\t\t\t\t\tsources: false,\n\t\t\t\t\t}\n\t\t\t\t};\n\t\t\t}\n\t\t}\n\n\t\t// Добавляем обработку SCSS-файлов\n\t\tconfig.module.rules.push({\n\t\t\ttest: /\\.scss$/,\n\t\t\tuse: [\n\t\t\t\t'style-loader',\n\t\t\t\t{\n\t\t\t\t\tloader: 'css-loader',\n\t\t\t\t\toptions: {\n\t\t\t\t\t\turl: (url, resourcePath) => {\n\t\t\t\t\t\t\tif (url.startsWith('/')) {\n\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tif (url.startsWith('../')) {\n\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\tloader: 'postcss-loader',\n\t\t\t\t\toptions: {\n\t\t\t\t\t\tpostcssOptions: {\n\t\t\t\t\t\t\tplugins: [\n\t\t\t\t\t\t\t\t[\n\t\t\t\t\t\t\t\t\t'autoprefixer',\n\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t// Options\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t'sass-loader',\n\t\t\t],\n\t\t});\n\n\t\t// Добавляем обработку шрифтов\n\t\tconfig.module.rules.push({\n\t\t\ttest: /\\.woff2?(\\?\\S*)?$/i,\n\t\t\ttype: 'asset/resource',\n\t\t\tgenerator: {\n\t\t\t\tfilename: 'font/[name][ext]',\n\t\t\t}\n\t\t});\n\n\t\t// Добавляем обработку изображений\n\t\tconfig.module.rules.push({\n\t\t\ttest: /\\.(svg|jpg|png|gif|jpeg|webp)/i,\n\t\t\ttype: 'asset/resource',\n\t\t\tgenerator: {\n\t\t\t\tfilename: 'images/[name][ext]',\n\t\t\t}\n\t\t});\n\n\t\tconfig.resolve = {\n\t\t\textensions: ['.js', '.css', '.sass', '.scss', '.vue'],\n\t\t\tbyDependency: {\n\t\t\t\tstyle: {\n\t\t\t\t\tmainFiles: ['custom'],\n\t\t\t\t},\n\t\t\t},\n\t\t\tmodules: [\n\t\t\t\tpath.join(__dirname, '../src'),\n\t\t\t\tpath.join(__dirname, '../src/style'),\n\t\t\t\tpath.join(__dirname, '../node_modules'),\n\t\t\t\tpath.join(__dirname, '../'),\n\t\t\t],\n\t\t\tplugins: [\n\t\t\t\tnew DirectoryNamedWebpackPlugin({\n\t\t\t\t\thonorPackage: false,\n\t\t\t\t}),\n\t\t\t],\n\t\t};\n\n\t\texposeGlobal = withJquery ? [\n\t\t\t{'module': 'jquery', 'name': '$'},\n\t\t\t{'module': 'jquery', 'name': 'jQuery'},\n\t\t] : [];\n\n\t\texposeGlobal.forEach(function (item) {\n\t\t\tconfig.module.rules.push({\n\t\t\t\ttest: require.resolve(item.module),\n\t\t\t\tloader: 'expose-loader',\n\t\t\t\toptions: {\n\t\t\t\t\texposes: {\n\t\t\t\t\t\tglobalName: item.name,\n\t\t\t\t\t\toverride: true,\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\t\t});\n\n\t\treturn config;\n\t},\n};\n",
		"preview.js":
			"import './preview.scss';\n\nexport const parameters = {\n\tactions: {\n\t\targTypesRegex: '^on[A-Z].*'\n\t},\n\n\tbackgrounds: {\n\t\tdefault: 'light',\n\t\tvalues: [\n\t\t\t{\n\t\t\t\tname: 'light',\n\t\t\t\tvalue: '#fff',\n\t\t\t},\n\t\t\t{\n\t\t\t\tname: 'dark',\n\t\t\t\tvalue: '#ddd',\n\t\t\t},\n\t\t],\n\t},\n\n\tcontrols: {\n\t\tmatchers: {\n\t\t\tcolor: /(background|color)$/i,\n\t\t\tdate: /Date$/,\n\t\t},\n\t},\n\n\tviewport: {\n\t\tviewports: {\n\t\t\tmobile1: {\n\t\t\t\tname: 'Телефон',\n\t\t\t\tstyles: {\n\t\t\t\t\theight: '568px',\n\t\t\t\t\twidth: '320px',\n\t\t\t\t},\n\t\t\t\ttype: 'mobile',\n\t\t\t},\n\t\t\ttablet1: {\n\t\t\t\tname: 'Планшет',\n\t\t\t\tstyles: {\n\t\t\t\t\theight: '1024px',\n\t\t\t\t\twidth: '768px',\n\t\t\t\t},\n\t\t\t\ttype: 'tablet',\n\t\t\t},\n\t\t\tdesktop1: {\n\t\t\t\tname: 'Десктоп',\n\t\t\t\tstyles: {\n\t\t\t\t\theight: '1080px',\n\t\t\t\t\twidth: '1920px',\n\t\t\t\t},\n\t\t\t\ttype: 'desktop',\n\t\t\t},\n\t\t},\n\t},\n}\n",
		"preview.scss": '@import "style/style";\n@include site-fonts;\n',
	},
	storybookUtils = {
		"storybook.js":
			"'use strict';\n\nconst\n\tfs = require('fs'),\n\tpath = require('path'),\n\tstoriesPath = path.resolve(__dirname, '../src/stories')\n;\n\n\ntry {\n\tfs.accessSync(storiesPath);\n} catch (err) {\n\tconsole.log('Отсутствует каталог с историями Storybook - ' + storiesPath);\n\tprocess.exit();\n}\n\n\nconst\n\tstories = fs.opendirSync(storiesPath),\n\tentries = []\n;\nlet entry = null;\nwhile (entry = stories.readSync()) {\n\tif ('.gitkeep' !== entry.name) {\n\t\tentries.push(entry.name);\n\t}\n}\n\nif (0 === entries.length) {\n\tconsole.log('Отсутствуют истории Storybook - ' + storiesPath);\n\tprocess.exit();\n}\n\n\nconst\n\tuserSettings = require('../user.settings'),\n\t_server = require('@storybook/core/server'),\n\t_options = require('@storybook/html/dist/cjs/server/options')\n;\n\n_options.default.outputDir = path.resolve(`${userSettings.docRoot + userSettings.storybookBuildPath}`);\n\n(0, _server.buildStatic)(_options.default);\n",
	},
	packageData = lib.readRC("package.json", fs);

console.log("");

if (packageData) {
	console.log("Добавляем сценарии работы со Storybook...");
	Object.assign(packageData.scripts, storybookScripts);
	lib.writeRC("package.json", packageData, fs);
	console.log("Добавляем файл Storybook-утилиты...");
	lib.makeFiles(storybookUtils, "utils", fs);
}

lib.makeDir(lib.STORYBOOK_DIR, fs);
lib.makeDir(lib.STORIES_DIR, fs);
lib.makeFiles(storybookFiles, lib.STORYBOOK_DIR, fs);
