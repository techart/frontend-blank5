module.exports = {
	docRoot: '../www',
	buildPath: '../www/builds',
	storybookBuildPath: '/storybook', // От docRoot
	usePrettier: false,
	mainStyleType: 'postcss-scss',
	mainTemplateType: 'blade',
	entry: {
		// Для вынесения общих частей всех точек сборки нужно раскомментировать эту строчку
		// common: ['jquery'], // По умолчанию все общие части собираеются в файл index.js
		index: ['./src/entry/index.js'],
		// Пример создания дополнительной точки сборки
		// main: ['./src/entry/main.js'],
	},
	stats: {},
	https: false,
	images: {
	},
	base64MaxFileSize: 10000,
	// Два следующих объекта использовать только в крайней необходимости
	aliases: { // Альтернативные имена для путей, например "my_plugin" : "src/component/alert"
	},
	providePlugin: { // Автоматическая подгрузка модулей через providePlugin
	},
	exposeGlobal: [],
	resolve: {},
	module: {},
	output: {},
	cssProcessing: [],
	useBundleAnalyzer: true
};
