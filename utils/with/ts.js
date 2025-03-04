const lib = require("./_lib"),
	fs = require("fs"),
	withPacks = {
		React: false,
		Vue: false,
	},
	tsConfigReact = {
		include: ["src/**/*"],
		exclude: ["node_modules"],
		compilerOptions: {
			target: "esnext",
			lib: ["esnext", "dom", "dom.iterable"],
			typeRoots: ["./node_modules/@types", "src/component-react/types"],
			types: ["node"],
			paths: {
				"api/*": ["src/api/*"],
				"apps/*": ["src/component-react/apps/*"],
				"components/*": ["src/component-react/components/*"],
				"hooks/*": ["src/component-react/hooks/*"],
				"modules/*": ["src/component-react/modules/*"],
				"style/*": ["src/component-react/style/*"],
			},
			allowJs: true,
			allowSyntheticDefaultImports: true,
			alwaysStrict: true,
			baseUrl: ".",
			esModuleInterop: true,
			isolatedModules: true,
			jsx: "react-jsx",
			module: "esnext",
			moduleResolution: "node",
			noImplicitAny: true,
			noImplicitThis: true,
			outDir: "dist",
			rootDir: "",
			skipLibCheck: true,
			sourceMap: true,
			strict: true,
			strictBindCallApply: true,
			strictFunctionTypes: true,
			strictNullChecks: true,
			strictPropertyInitialization: true,
		},
	},
	tsConfigVue = {
		extends: "@vue/tsconfig/tsconfig.json",
		include: ["src/**/*"],
		exclude: ["node_modules"],
		files: ["./src/component-vue/vue-shims.d.ts"],
		compilerOptions: {
			target: "esnext",
			lib: ["esnext", "dom", "dom.iterable"],
			typeRoots: ["./node_modules/@types"],
			paths: {
				"api/*": ["src/api/*"],
			},
			noEmit: false,
			allowJs: true,
			allowSyntheticDefaultImports: true,
			alwaysStrict: true,
			baseUrl: ".",
			esModuleInterop: true,
			isolatedModules: true,
			module: "esnext",
			moduleResolution: "node",
			noImplicitAny: true,
			noImplicitThis: true,
			outDir: "dist",
			rootDir: "",
			skipLibCheck: true,
			sourceMap: true,
			strict: true,
			strictBindCallApply: true,
			strictFunctionTypes: true,
			strictNullChecks: true,
			strictPropertyInitialization: true,
		},
	},
	tsConfigDefault = {
		include: ["src/**/*"],
		exclude: ["node_modules"],
		compilerOptions: {
			target: "esnext",
			lib: ["esnext", "dom", "dom.iterable"],
			typeRoots: ["./node_modules/@types", "src/types"],
			paths: {
				"api/*": ["src/api/*"],
			},
			allowJs: true,
			allowSyntheticDefaultImports: true,
			alwaysStrict: true,
			baseUrl: ".",
			esModuleInterop: true,
			isolatedModules: true,
			module: "esnext",
			moduleResolution: "node",
			noImplicitAny: true,
			noImplicitThis: true,
			outDir: "dist",
			rootDir: "",
			skipLibCheck: true,
			sourceMap: true,
			strict: true,
			strictBindCallApply: true,
			strictFunctionTypes: true,
			strictNullChecks: true,
			strictPropertyInitialization: true,
		},
	};

console.log("");

// Определяем наличие React в проекте
try {
	let reactdom = require("react-dom");
	withPacks.React = !!reactdom;
} catch {
	// ...
}

// Определяем наличие Vue в проекте
try {
	let vue = require("vue");
	withPacks.Vue = !!vue;
} catch {
	// ...
}

if (!fs.existsSync(lib.TS_CONFIG_FILE)) {
	console.log(`Сохраняем файл настроек ${lib.TS_CONFIG_FILE}...`);
	if (withPacks.React) {
		console.log("...для React...");
		lib.writeRC(lib.TS_CONFIG_FILE, tsConfigReact, fs);
	} else if (withPacks.Vue) {
		console.log("...для Vue...");
		lib.writeRC(lib.TS_CONFIG_FILE, tsConfigVue, fs);
	} else {
		console.log("...по умолчанию...");
		lib.writeRC(lib.TS_CONFIG_FILE, tsConfigDefault, fs);
		console.log("Создаем каталог для определения типов...");
		lib.makeDir("src/types", fs);
	}
} else {
	console.log(`Файл настроек ${lib.TS_CONFIG_FILE} уже существует.`);
}
