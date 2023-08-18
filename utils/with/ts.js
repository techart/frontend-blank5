const
	lib = require('./_lib'),

	fs = require('fs'),

	tsConfig = {
		"include": [
			"src/component-react/**/*",
		],
		"exclude": [
			"node_modules",
		],
		"compilerOptions": {
			"target": "es6",
			"lib": [
				"es6",
				"dom",
				"es2017"
			],
			"jsx": "react",
			"module": "ES6",
			"rootDir": "",
			"outDir": "dist",
			"esModuleInterop": true,
			"skipLibCheck": true,
			"allowSyntheticDefaultImports": true,
			"baseUrl": ".",
			"allowJs": true,
			"isolatedModules": true,
			"moduleResolution": "node16"
		}
	}
;


console.log('');


if (!fs.existsSync(lib.TS_CONFIG_FILE)) {
	console.log(`Сохраняем файл настроек ${lib.TS_CONFIG_FILE}...`);
	lib.writeRC(lib.TS_CONFIG_FILE, tsConfig, fs);
} else {
	console.log(`Файл настроек ${lib.TS_CONFIG_FILE} уже существует.`);
}
