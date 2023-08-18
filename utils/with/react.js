const
	lib = require('./_lib'),

	fs = require('fs'),

	// Дополнения к настройкам eslint
	eslint = {
		extends: ["plugin:react/recommended"],
		plugins: [
			"react"
		]
	},
	// Содержимое файла настроек eslint
	eslintRC = lib.readRC(lib.ESLINT_RC_FILE, fs),

	// Содержимое файла настроек stylelint
	stylelintRC = lib.readRC(lib.STYLELINT_RC_FILE, fs),

	// Дополнительная точка сборки React для пользовательских настроек
	entryPoint = {
		name: "react",
		file: "src/entry/react.js",
		content: "import 'component-react/app';\n"
	},

	// Файлы для примера компонентов React
	reactComponents = {
		"api": {
			"index.js": "// export { sendFeedbackRequest } from './forms/feedbackForm/index.jsx'"
		},
		"components": {
			"common": {
				"modal": {
					"index.jsx": "import React, { useEffect, useState } from 'react'\nimport PropTypes from 'prop-types'\n\n// import { ReactComponent as CloseIcon } from '../../../icons/close-popup.svg'\n\nimport styles from './index.module.scss'\n\nconst Modal = ({ popupContent, isVisible, changeModalState }) => {\n\tconst [content, setContent] = useState(null)\n\n\tconst closePopUp = () => {\n\t\tchangeModalState(false)\n\t}\n\n\tuseEffect(() => {\n\t\tconst escapeDownHandler = (e) => {\n\t\t\tif(e.key === 'Escape')\n\t\t\t\tchangeModalState(false)\n\t\t}\n\n\t\tdocument.addEventListener('keydown', escapeDownHandler)\n\n\t\treturn () => document.removeEventListener('keydown', escapeDownHandler)\n\t}, [changeModalState])\n\n\tuseEffect(() => {\n\t\tsetContent(popupContent)\n\t}, [popupContent])\n\n\tif(!isVisible)\n\t\treturn null\n\n\treturn (\n\t\t<div className={styles.root}>\n\t\t\t<div className={styles.bg} onClick={closePopUp}>\n\t\t\t\t<div className={styles.buttonWrapper}>\n\t\t\t\t\t<div className={styles.close} onClick={closePopUp}>\n\t\t\t\t\t\t{/* <CloseIcon /> */}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div className={styles.content}>\n\t\t\t\t{content}\n\t\t\t</div>\n\t\t</div>\n\n\t)\n}\n\nModal.propTypes = {\n\tpopupContent: PropTypes.element,\n\tisVisible: PropTypes.bool.isRequired,\n\tchangeModalState: PropTypes.func.isRequired,\n}\n\nexport default React.memo(Modal)\n",
					"index.module.scss": ".root {\n\ttop: 0;\n\tleft: 0;\n\twidth: 100vw;\n\theight: calc(100vh - calc(100vh - 100%));\n\tposition: fixed;\n\tz-index: 999;\n}\n\n.bg {\n\tposition: relative;\n\tz-index: 2;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: rgba(#000, 0.9);\n}\n\n.content {\n\tposition: absolute;\n\tz-index: 3;\n\ttop: 50%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%);\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tmin-width: 340px;\n\tcolor: #fff;\n}\n\n.buttonWrapper {\n\tmax-width: 1440px;\n\tleft: 50%;\n\ttransform: translateX(-50%);\n\twidth: 100%;\n\ttop: 40px;\n\tposition: absolute;\n\tjustify-content: flex-end;\n\tdisplay: flex;\n\tz-index: 10;\n}\n\n.close {\n\twidth: 22px;\n\theight: 22px;\n\tcolor: #000;\n\tcursor: pointer;\n\tmargin-right: 20px;\n\n\tsvg {\n\t\tpath {\n\t\t\ttransition: fill 0.3s;\n\t\t\tfill: red;\n\t\t}\n\t}\n\n\t&:hover {\n\t\tsvg {\n\t\t\tpath {\n\t\t\t\tfill: red;\n\t\t\t}\n\t\t}\n\t}\n}\n"
				},
				"portal": {
					"index.jsx": "import ReactDOM from 'react-dom'\nimport PropTypes from 'prop-types'\n\nconst Portal = ({ component, elemId }) => {\n\tconst container = document.getElementById(elemId)\n\treturn (\n\t\tReactDOM.createPortal(component, container)\n\t)\n}\n\nPortal.propTypes = {\n\tcomponent: PropTypes.element,\n\telemId: PropTypes.string.isRequired\n}\n\nexport default Portal"
				}
			}
		},
		"hooks": {
			"useDynamicSvgImport.jsx": "import { useRef, useState, useEffect } from 'react'\n\nconst useDynamicSVGImport = (name) => {\n\tconst importedIconRef = useRef()\n\tconst [loading, setLoading] = useState(false)\n\tconst [error, setError] = useState()\n\tconst [data, setData] = useState(null)\n\n\tuseEffect(() => {\n\t\tsetLoading(true)\n\t\tconst importIcon = async () => {\n\t\t\ttry {\n\t\t\t\timportedIconRef.current = (await import(/* webpackMode: \"eager\" */ `!!@svgr/webpack?-svgo,+titleProp,+ref!../icons/${name}`)).default\n\t\t\t} catch (err) {\n\t\t\t\tsetError(err.message)\n\t\t\t\tconsole.error(err.message)\n\t\t\t} finally {\n\t\t\t\tsetData(importedIconRef.current)\n\t\t\t\tsetLoading(false)\n\t\t\t}\n\t\t};\n\t\timportIcon()\n\t}, [name])\n\n\n\treturn { error, loading, SvgIcon: data }\n}\n\nexport default useDynamicSVGImport\n",
			"useFetch.jsx": "import { useEffect, useState } from 'react'\nimport { processRequestResult } from '../../../utils/utils.js'\n\nexport const fetchDo = async (url) => {\n\ttry {\n\t\tconst request = await fetch(url)\n\t\tconst data = await request.json()\n\t\treturn processRequestResult(data, 'ok')\n\t} catch (err) {\n\t\tconsole.error(`Ошибка запроса. Url: ${url}. Сообщение: ${err.message}`)\n\t\treturn processRequestResult({err: err.message}, 'error')\n\t}\n}\n\nexport const useFetch = (url) => {\n\tconst [data, setData] = useState(null)\n\tconst [loading, setLoading] = useState(false)\n\tconst [error, setError] = useState(null)\n\n\tuseEffect(() => {\n\t\tif(url) {\n\t\t\tconst controller = new AbortController()\n\t\t\tsetLoading(true)\n\n\t\t\tfetch(url, controller.signal)\n\t\t\t\t.then(response => response.json())\n\t\t\t\t.then(result => setData(result))\n\t\t\t\t.catch(err => {\n\t\t\t\t\tsetError(err.message)\n\t\t\t\t\tconsole.error(`Ошибка запроса. Url: ${url}. Сообщение: ${err.message}`)\n\t\t\t\t})\n\t\t\t\t.finally(() => setLoading(false))\n\n\t\t\treturn () => controller.abort()\n\t\t}\n\t}, [url])\n\n\treturn { data, loading, error }\n}\n",
			"useModal.jsx": "import { useState } from 'react'\n\nconst useModal = () => {\n\tlet [modalState, setModalState] = useState(false)\n\tlet [modalComponent, setModalComponent] = useState(null)\n\n\treturn { modalState, setModalState, modalComponent, setModalComponent }\n}\n\nexport default useModal\n",
			"useWindowDimensions.jsx": "import { useState, useEffect } from 'react'\nimport throttle from 'lodash/throttle'\n\nconst useWindowDimensions = () => {\n\tconst [size, setWindowSize] = useState({\n\t\twidth: window.innerWidth,\n\t\theight: window.innerHeight\n\t})\n\n\tuseEffect(() => {\n\t\tconst resizeHandler = throttle(e => {\n\t\t\tsetWindowSize({\n\t\t\t\twidth: e.target.innerWidth,\n\t\t\t\theight: e.target.innerWidth\n\t\t\t})\n\t\t}, 100)\n\n\t\twindow.addEventListener('resize', resizeHandler)\n\n\t\treturn () => {\n\t\t\twindow.removeEventListener('resize', resizeHandler)\n\t\t}\n\t}, [])\n\n\treturn size\n}\n\nexport default useWindowDimensions\n"
		},
		"modules": {
			"form": {
				"store": {
					"readme.txt": "Логика работы модуля\n"
				},
				"ui": {
					"index.jsx": "import React, { useContext } from 'react'\nimport { useForm } from \"react-hook-form\"\nimport { useFetch, fetchDo } from '../../../hooks/useFetch'\n\n// Импорт контекста\nimport { ModalContext } from '../../../app'\n\nimport styles from './index.module.css'\n\n// import { sendFeedbackRequest } from '../../../api/index'\n\nconst FeedbackForm = () => {\n\tconst { register, handleSubmit, formState: { errors } } = useForm()\n\n\t// Будем использовать 2 функции из контекста\n\tconst { setModalState, setModalComponent } = useContext(ModalContext);\n\t\n\t// Пример хука для получения данных\n\tconst { requestData, loading, error } = useFetch('https://jsonplaceholder.typicode.com/posts/1')\n\n\tconst onSubmit = (data) => {\n\t\tconsole.log(data)\n\t\t// использование функций контекста\n\t\tsetModalComponent(<div>Модальное окно ответ</div>)\n\t\tsetModalState(true)\n\t}\n\n\tconst clickHandler = async() => {\n\t\tconst data = await fetchDo('https://jsonplaceholder.typicode.com/posts/1')\n\t\tconsole.log(data)\n\t}\n\n\tif(loading)\n\t\treturn <div>Loading</div>\n\n\tif(error)\n\t\treturn <div>Error</div>\n\n\treturn (\n\t\t/* \"handleSubmit\" will validate your inputs before invoking \"onSubmit\" */\n\t\t<form onSubmit={handleSubmit(onSubmit)} className={styles.root}>\n\t\t\t{/* register your input into the hook by invoking the \"register\" function */}\n\t\t\t<input className={styles.input} defaultValue=\"test\" {...register(\"example\")} />\n\t\t\t{/* include validation with required or other standard HTML validation rules */}\n\t\t\t<input className={styles.input} {...register(\"exampleRequired\", { required: true })} />\n\t\t\t{/* errors will return when field validation fails  */}\n\t\t\t{errors.exampleRequired && <span>This field is required</span>}\n\t\t\t<div className={styles.testClick} onClick={clickHandler}>fetch</div>\n\t\t\t<input className={styles.testSubmit} type=\"submit\" />\n\t\t</form>\n\t)\n}\n\nexport default FeedbackForm\n",
					"index.module.css": ".root {\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: green;\n\tpadding: 15px;\n}\n\n.input {\n\tborder: 1px solid gray;\n}\n\n.testClick {\n\tmax-width: 40px;\n\tbackground-color: gray;\n\tmargin: 10px 0;\n\tcursor: pointer;\n}\n\n.testSubmit {\n\tbackground-color: gray;\n\tcursor: pointer;\n}\n",
					"readme.txt": "Представление\n"
				}
			},
			"readme.txt": "Модули с инкапуслированной бизнеслогикой\n"
		},
		"app.jsx": "import React, { createContext } from 'react'\nimport { createRoot } from 'react-dom/client'\n\nimport useModal from './hooks/useModal'\n\nimport Portal from './components/common/portal'\nimport ModalComponent from './components/common/modal'\nimport FeedbackForm from './modules/form/ui/index'\n\n// Объявляем контекст(после заполнения контекста, его можно будет импортировать в любом месте и использовать)\nexport const ModalContext = createContext({})\n\n// Примеры того, как можно организовывать реакт компоненты/приложения\n\nconst App = () => {\n\tconst { modalState, setModalState, modalComponent, setModalComponent } = useModal()\n\t\n\treturn (\n\t\t<ModalContext.Provider value={{ modalState, setModalState, modalComponent, setModalComponent }}>\n\t\t\t<FeedbackForm/>\n\t\t\t<Portal component={<ModalComponent isVisible={modalState} changeModalState={setModalState} popupContent={modalComponent} />} elemId={'portal'} />\n\t\t</ModalContext.Provider>\n\t)\n}\n\n \ndocument.addEventListener('DOMContentLoaded', () => {\n\t// Пример обёртки приложения в контекст с доступом к модалке (context react)\n\tconst root = createRoot(document.getElementById('react'))\n\n\troot.render(<App />)\n})\n"
	},
	reactUtils = {
		"utils.d.ts": "declare module 'utils'\n",
		"utils.js": "const processRequestResult = (data, status) => {\n\treturn {\n\t\tstatus: status,\n\t\tpayload: data\n\t}\n}\n\nexport { processRequestResult }\n"
	},

	// Содержимое пользовательских настроек
	settings = require("../../user.settings"),
	settingLines = fs.readFileSync(lib.USER_SETTINGS_FILE, "utf-8").split("\n")
;


console.log('');


// Если прочитали настройки eslint
if (eslintRC) {
	console.log('Добавляем настройки eslint...');
	// Добавялем пресет
	eslintRC.extends = eslintRC.extends.concat(eslint.extends);
	// Добавляем плагин
	eslintRC.plugins = eslintRC.plugins.concat(eslint.plugins);
	// Сохраняем новые настройки в файл настроек
	lib.writeRC(lib.ESLINT_RC_FILE, eslintRC, fs);
}


// Если прочитали настройки stylelint
if (stylelintRC) {
	console.log('Исправляем настройки stylelint для испоьзования CSS-модулей...');
	// Убираем шаблон для имён классов
	stylelintRC.rules['selector-class-pattern'] = null;
	// Сохраняем новые настройки в файл настроек
	lib.writeRC(lib.STYLELINT_RC_FILE, stylelintRC, fs);
}


// Если прочитали пользовательские настройки
if (settings &&
	settingLines) {

	// Если не нашли в списке точек сборки точку сборки для React
	if ('undefined' === typeof settings.entry[entryPoint.name]) {
		let
			// В содержимом файла с настройками находим строку с началом списка точек сборки
			entryStart = settingLines.findIndex(line => line.match(/^\s+entry:\s+\{$/)),
			// Находим строку с окончанием списка точек сборки
			entryFinish = (0 <= entryStart) ? settingLines.slice(entryStart).findIndex(line => line.match(/^\s+\},$/)) + entryStart : -1
		;

		console.log('Создаём точку сборки react...');
		if (0 < entryFinish) {
			console.log('Добавляем запись о точке сборке в список точек сборки...');
			// Вставляем перед окончанием списка точек сборки запись о точке сборки react
			settingLines.splice(entryFinish, 0, `\t\t${entryPoint.name}: ['./${entryPoint.file}'],`);
			// Сохраняем изменённые настройки в файл
			fs.writeFileSync(lib.USER_SETTINGS_FILE, settingLines.join("\n"), "utf-8");
		}

		if (!fs.existsSync(entryPoint.file)) {
			console.log('Создаём файл точки сборки react...');
			fs.writeFileSync(entryPoint.file, entryPoint.content);
		} else {
			console.log('Файл точки сборки react уже существует.');
		}

	} else {
		console.log('Точка сборки react уже задана в файле настроек.');
	}

	lib.makeDir(lib.REACT_DIR, fs);
	console.log('Формируем файлы примера React-приложения...');
	lib.makeFiles(reactComponents, lib.REACT_DIR, fs);
	console.log('Добавляем файлы React-утилит...');
	lib.makeFiles(reactUtils, "utils", fs);
}
