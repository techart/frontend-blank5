const
	lib = require('./_lib'),

	fs = require('fs'),

	// Дополнения к настройкам eslint
	eslint = {
		globals: {
			"$": true,
			"jQuery": true
	    }
	},
	// Содержимое файла настроек eslint
	eslintRC = lib.readRC(lib.ESLINT_RC_FILE, fs)
;


console.log('');


// Если прочитали настройки eslint
if (eslintRC) {
	console.log('Добавляем настройки eslint...');
	// Добавляем Vue в список глобальных переменных
	Object.assign(eslintRC.globals, eslint.globals);
	// Сохраняем новые настройки в файл настроек
	lib.writeRC(lib.ESLINT_RC_FILE, eslintRC, fs);
}
