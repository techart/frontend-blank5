const // Функция формирования структуры каталогов и файлов
	makeFiles = (entries, base, fs) => {
		for (let name in entries) {
			let path = `${base}/${name}`;
			if (typeof "" === typeof entries[name]) {
				if (!fs.existsSync(path)) {
					console.log(`${path} - записываем файл...`);
					fs.writeFileSync(path, entries[name]);
				} else {
					console.log(`${path} - файл уже существует`);
				}
			} else {
				if (!fs.existsSync(path)) {
					console.log(`${path} - создаём подкаталог...`);
					fs.mkdirSync(path);
				} else {
					console.log(`${path} - подкаталог уже существует`);
				}
				makeFiles(entries[name], path, fs);
			}
		}
	};

module.exports = {
	// Имя файла с настройками eslint
	ESLINT_RC_FILE: ".eslintrc.json",
	// Имя файла с настройками stylelint
	STYLELINT_RC_FILE: ".stylelintrc",
	// Имя файла с настройками Typescript
	TS_CONFIG_FILE: "tsconfig.json",
	// Имя файла с проектными настройками webpack
	USER_SETTINGS_FILE: "user.settings.js",
	// Имя файла с описанием сборок страниц (React)
	USER_ENTRIES_FILE: "user.entries.js",

	// Каталог блоков
	BLOCKS_DIR: "src/block",
	// Каталог компонентов React
	REACT_DIR: "src/component-react",
	// Каталог компонентов Vue
	VUE_DIR: "src/component-vue",
	// Каталог настроек Storybook
	STORYBOOK_DIR: ".storybook",
	// Каталог историй Storybook
	STORIES_DIR: "src/stories",

	// Функция чтения настроек
	readRC: (file, fs) => JSON.parse(fs.readFileSync(file, "utf-8")),

	// Функция сохранения настроек
	writeRC: (file, data, fs) =>
		fs.writeFileSync(file, JSON.stringify(data, null, "\t")),

	// Проверяем и создаём каталог`
	makeDir: (dir, fs) => {
		if (!fs.existsSync(dir)) {
			console.log(`Создаём каталог ${dir}...`);
			fs.mkdirSync(dir);
		} else {
			console.log(`Каталог ${dir} уже существует.`);
		}
	},

	makeFiles,

	mergeUnique: (a, b) => {
		let r = [...a];
		for (let v of b) {
			if (!r.includes(v)) {
				r.push(v);
			}
		}
		return r;
	},
};
