const
	lib = require('./_lib'),

	fs = require('fs'),

	// Дополнения к настройкам eslint
	eslint = {
		extends: [
			"plugin:vue/vue3-recommended",
			"plugin:vue/vue3-strongly-recommended",
			"plugin:vue/vue3-essential"
		],
		globals: {
			"Vue": true
		},
		parserOptions: {
			"ecmaVersion": "latest",
			"sourceType": "module"
		},
		plugins: [
			"vue"
		],
	    rules: {
			"vue/html-indent": ["error", "tab"]
	    }
	},
	// Содержимое файла настроек eslint
	eslintRC = lib.readRC(lib.ESLINT_RC_FILE, fs),

	// Дополнительная точка сборки Vue для пользовательских настроек
	entryPoint = {
		name: "vue",
		file: "src/entry/vue.js",
		content: "import 'component-vue/app';\n"
	},

	// Файлы для примера компонентов Vue
	vueComponents = {
		"app.js": "import { createApp } from 'vue';\n\nimport App from './banner';\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\tconst app = createApp(App);\n\tapp.mount('#vue');\n});\n",
		"banner.vue": "<template>\n\t<div>{{ message }}</div>\n</template>\n\n<script>\n\texport default {\n\t\tdata() {\n\t\t\treturn {\n\t\t\t\tmessage: 'Тестовый Vue-компонент!',\n\t\t\t}\n\t\t}\n\t}\n</script>\n"
	},

	// Содержимое пользовательских настроек
	settings = require("../../user.settings"),
	settingLines = fs.readFileSync(lib.USER_SETTINGS_FILE, "utf-8").split("\n")
;


console.log('');


// Если прочитали настройки eslint
if (eslintRC) {
	console.log('Добавляем настройки eslint...');
	// Добавялем пресеты
	eslintRC.extends = eslintRC.extends.concat(eslint.extends);
	// Добавляем Vue в список глобальных переменных
	Object.assign(eslintRC.globals, eslint.globals);
	// Добавляем настройки парсера
	Object.assign(eslintRC.parserOptions, eslint.parserOptions);
	// Добавляем плагин
	eslintRC.plugins = eslintRC.plugins.concat(eslint.plugins);
	// Добавялем правила
	Object.assign(eslintRC.rules, eslint.rules);
	// Сохраняем новые настройки в файл настроек
	lib.writeRC(lib.ESLINT_RC_FILE, eslintRC, fs);
}


// Если прочитали пользовательские настройки
if (settings &&
	settingLines) {

	// Если не нашли в списке точек сборки точку сборки для Vue
	if ('undefined' === typeof settings.entry[entryPoint.name]) {
		let
			// В содержимом файла с настройками находим строку с началом списка точек сборки
			entryStart = settingLines.findIndex(line => line.match(/^\s+entry:\s+\{$/)),
			// Находим строку с окончанием списка точек сборки
			entryFinish = (0 <= entryStart) ? settingLines.slice(entryStart).findIndex(line => line.match(/^\s+\},$/)) + entryStart : -1
		;

		console.log('Создаём точку сборки vue...');
		if (0 < entryFinish) {
			console.log('Добавляем запись о точке сборке в список точек сборки...');
			// Вставляем перед окончанием списка точек сборки запись о точке сборки vue
			settingLines.splice(entryFinish, 0, `\t\t${entryPoint.name}: ['./${entryPoint.file}'],`);
			// Сохраняем изменённые настройки в файл
			fs.writeFileSync(lib.USER_SETTINGS_FILE, settingLines.join("\n"), "utf-8");
		}

		if (!fs.existsSync(entryPoint.file)) {
			console.log('Создаём файл точки сборки vue...');
			fs.writeFileSync(entryPoint.file, entryPoint.content);
		} else {
			console.log('Файл точки сборки vue уже существует.');
		}

	} else {
		console.log('Точка сборки vue уже задана в файле настроек.');
	}

	lib.makeDir(lib.VUE_DIR, fs);
	console.log('Формируем файлы примера Vue-приложения...');
	lib.makeFiles(vueComponents, lib.VUE_DIR, fs);
}
