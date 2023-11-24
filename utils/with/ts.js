const
	lib = require('./_lib'),

	fs = require('fs'),

	tsConfig = {
		"include": [
			"src/**/*",
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
			"typeRoots": [
				"./node_modules/@types",
				"src/component-react/types"
			],
			"types": [
				"node"
			],
			"jsx": "react-jsx",
			"module": "CommonJS",
			"rootDir": "",
			"outDir": "dist",
			"esModuleInterop": true,
			"skipLibCheck": true,
			"allowSyntheticDefaultImports": true,
			"baseUrl": ".",
			"allowJs": true,
			"isolatedModules": true,
			"alwaysStrict": true,
			"noImplicitAny": true,
			"strictNullChecks": true,
			"strictPropertyInitialization": true,
			"strictFunctionTypes": true,
			"noImplicitThis": true,
			"strictBindCallApply": true
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
