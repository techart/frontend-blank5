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
		content: "import 'component-react/apps';\n"
	},

	// Файлы для примера компонентов React
	reactComponents = {
		"apps": {
			"controllers": {
				".gitkeep": ""
			},
			"hooks": {
				".gitkeep": ""
			},
			"index.ts": "export { App } from './ui'",
			"pages": {
				".gitkeep": ""
			},
			"stores": {
				".gitkeep": ""
			},
			"ui": {
				"index.tsx": "import React from 'react'\n\nconst App: React.FC = () => {\n\treturn (\n\t\t<div>App example</div>\n\t)\n}\n\nexport { App }"
			}
		},
		"components": {
			"title": {
				"index.module.scss": "@import \"~style\";\n",
				"index.tsx": "import React from 'react'\n\nimport styles from './index.module.scss'\n\ntype CommonTitleT = {\n\tchildren: string,\n}\n\nconst Title: React.FC<CommonTitleT> = ({ children }) => {\n\treturn <h1 className={styles.root}>{children}</h1>\n}\n\nexport default React.memo(Title)"
			}
		},
		"hooks": {
			"useDynamicSvgImport.ts": "import { useRef, useState, useEffect } from 'react'\n\nconst useDynamicSVGImport = (name: string): object => {\n\tconst importedIconRef = useRef()\n\tconst [loading, setLoading] = useState(false)\n\tconst [error, setError] = useState()\n\tconst [data, setData] = useState<object | null>(null)\n\n\tuseEffect((): void => {\n\t\tsetLoading(true)\n\t\tconst importIcon = async (): Promise<void> => {\n\t\t\ttry {\n\t\t\t\timportedIconRef.current = (await import(/* webpackMode: \"eager\" */ `!!@svgr/webpack?-svgo,+titleProp,+ref!../icons/${name}`)).default\n\t\t\t} catch (err: any) {\n\t\t\t\tsetError(err.message)\n\t\t\t\tconsole.error(err.message)\n\t\t\t} finally {\n\t\t\t\tsetData(importedIconRef.current !== undefined ? importedIconRef.current : null);\n\t\t\t\tsetLoading(false)\n\t\t\t}\n\t\t};\n\t\timportIcon()\n\t}, [name])\n\n\n\treturn { error, loading, SvgIcon: data }\n}\n\nexport default useDynamicSVGImport\n",
			"useLoadRecaptcha.ts": "import { useEffect } from 'react'\n\nconst useLoadRecaptcha = (googleKey: string): void => {\n\tuseEffect(() => {\n\t\tif(!(window as any).grecaptcha && !location.href.includes('techart')) {\n\t\t\tconst script = document.createElement(\"script\")\n\t\t\tscript.src = `https://www.google.com/recaptcha/api.js?render=${googleKey}`\n\t\t\tdocument.body.appendChild(script)\n\t\t}\n\t}, [])\n}\n\nexport default useLoadRecaptcha",
			"useModal.ts": "import { useState } from 'react'\n\nconst useModal = (): object => {\n\tlet [modalState, setModalState] = useState(false)\n\tlet [modalComponent, setModalComponent] = useState(null)\n\n\treturn { modalState, setModalState, modalComponent, setModalComponent }\n}\n\nexport default useModal\n",
			"useWindowDimensions.ts": "import { useState, useEffect } from 'react'\nimport throttle from 'lodash/throttle'\n\nconst useWindowDimensions = (): object => {\n\tconst [size, setWindowSize] = useState({\n\t\twidth: window.innerWidth,\n\t\theight: window.innerHeight\n\t})\n\n\tuseEffect(() => {\n\t\tconst resizeHandler = throttle((e: UIEvent)  => {\n\t\t\tconst w = e.target as Window\n\t\t\tsetWindowSize({\n\t\t\t\twidth: w.innerWidth,\n\t\t\t\theight: w.innerWidth\n\t\t\t})\n\t\t}, 100)\n\n\t\twindow.addEventListener('resize', resizeHandler)\n\n\t\treturn (): void => {\n\t\t\twindow.removeEventListener('resize', resizeHandler)\n\t\t}\n\t}, [])\n\n\treturn size\n}\n\nexport default useWindowDimensions\n"
		},
		"modules": {
			"modal": {
				"controller": {
					"index.tsx": "const ModalController = (modalComponent = '') => {\n\tlet component = null\n\n\tswitch (modalComponent) {\n\t\tcase 'sendCheckWord':\n\t\t\tcomponent = <div>компонент1</div>\n\t\t\tbreak\n\t\tcase 'сhangePassword':\n\t\t\tcomponent = <div>компонент2</div>\n\t\t\tbreak\n\t\tdefault:\n\t\t\tcomponent = modalComponent\n\t\t\tbreak\n\t}\n\n\treturn component\n\n}\n\nexport default ModalController"
				},
				"index.ts": "export { Modal } from './ui'",
				"lib": {
					"Store.ts": "import { makeAutoObservable } from 'mobx'\n\nimport ModalController from '../controller'\n\nclass ModalStore {\n\tmodalState: boolean = false\n\tmodalComponent: any = null\n\n\tconstructor() {\n\t\tthis.changeModalComponent = this.changeModalComponent.bind(this)\n\t\tthis.changeModalState = this.changeModalState.bind(this)\n\t\tmakeAutoObservable(this)\n\t}\n\n\tchangeModalState(state: boolean) {\n\t\tthis.modalState = state\n\t}\n\n\tchangeModalComponent(component: any) {\n\t\tthis.modalComponent = ModalController(component)\n\t}\n}\n\nconst Store = new ModalStore()\nexport default Store"
				},
				"ui": {
					"index.module.scss": "@import \"~style\";\n\n.root {\n\ttop: 0;\n\tleft: 0;\n\twidth: 100vw;\n\theight: calc(100vh - calc(100vh - 100%));\n\tposition: fixed;\n\tz-index: 999;\n}\n\n.bg {\n\tposition: relative;\n\tz-index: 2;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\topacity: 0.5;\n\tbackground-color: black;\n}\n\n.content {\n\tposition: absolute;\n\tz-index: 3;\n\ttop: 50%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%);\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tmin-width: 340px;\n\tcolor: #fff;\n}\n\n.buttonWrapper {\n\tmax-width: 1440px;\n\tleft: 50%;\n\ttransform: translateX(-50%);\n\twidth: 100%;\n\ttop: 40px;\n\tposition: absolute;\n\tjustify-content: flex-end;\n\tdisplay: flex;\n\tz-index: 10;\n}\n\n.close {\n\twidth: 22px;\n\theight: 22px;\n\tcolor: #000;\n\tcursor: pointer;\n\tmargin-right: 20px;\n\n\tsvg {\n\t\tpath {\n\t\t\ttransition: fill 0.3s;\n\t\t\tfill: red;\n\t\t}\n\t}\n\n\t&:hover {\n\t\tsvg {\n\t\t\tpath {\n\t\t\t\tfill: red;\n\t\t\t}\n\t\t}\n\t}\n}\n",
					"index.tsx": "import { createRoot } from 'react-dom/client'\nimport { observer } from 'mobx-react-lite'\n\nimport Store from '../lib/Store'\n\nimport styles from './index.module.scss'\nimport { useCallback } from 'react'\n\nconst Modal = observer(() => {\n\tconst { modalState, modalComponent, changeModalState } = Store\n\n\tconst closeModal = useCallback(() => {\n\t\tchangeModalState(false)\n\t}, [])\n\n\tif(!modalState)\n\t\treturn null\n\n\treturn (\n\t\t<div className={styles.root}>\n\t\t\t<div className={styles.bg} onClick={closeModal}>\n\t\t\t\t<div className={styles.buttonWrapper}>\n\t\t\t\t\t<div className={styles.close} onClick={closeModal}>\n\t\t\t\t\t\tX\n\t\t\t\t\t\t{/* <CloseIcon /> */}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div className={styles.content}>\n\t\t\t\t{modalComponent}\n\t\t\t</div>\n\t\t</div>\n\n\t)\n})\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\tconst root = createRoot(document.getElementById('modal') as HTMLElement)\n\troot.render(<Modal />)\n})\n\nexport { Modal }"
				}
			}
		},
		"types": {
			"declaration.d.ts": "declare module '*.scss'\ndeclare module '*.module.scss'\ndeclare module '*.svg'"
		}
	},
	reactUtils = {
		"react": {
			"stubs": {
				"api.js": "const createInterfaceStub = (name) => {\n\treturn `export interface ${name}ApiI {\n\n}`\n}\n\nconst createApiStub = (name) => {\n\treturn `import axios from 'axios'\n\nimport { ${name}ApiI } from './types'\nimport { ResponseT } from 'api/types'\n\nclass ${name}Api implements ${name}ApiI {\n\tinstance = axios.create({\n\t\tbaseURL: '/api/',\n\t\ttimeout: 5000,\n\t\theaders: {\n\t\t\t'Content-Type': 'application/json'\n\t\t}\n\t})\n\n\tconstructor() {\n\t}\n}\n\nconst instance = new ${name}()\nexport default instance`\n}\n\nmodule.exports = { createApiStub, createInterfaceStub }",
				"app.js": "const createAppStub = (name) => {\n\treturn `import React from 'react'\n\nconst ${name}: React.FC = () => {\n\treturn (\n\t\t<div>\n\t\t\t${name}\n\t\t</div>\n\t)\n}\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\tconst root = createRoot(document.getElementById('${name}') as HTMLElement)\n\troot.render(<${name} />)\n})\n\nexport { ${name} }\n`\n}\n\nmodule.exports = createAppStub",
				"common.js": "const createCommonStub = (name) => {\n\treturn `import React from 'react'\n\nimport styles from './index.module.scss'\n\nconst ${name}: React.FC = () => {\n\treturn (\n\t\t<div className={styles.root}>\n\t\t\t${name}\n\t\t</div>\n\t)\n}\n\nexport { ${name} }\n`\n}\n\nmodule.exports = createCommonStub",
				"mobxStore.js": "const createMobxStoreStub = (name) => {\n\treturn `import { makeAutoObservable } from 'mobx'\n\nimport { ${name}StoreI } from './types'\n\nclass ${name}Store implements ${name}StoreI {\n\n\tconstructor() {\n\t\tmakeAutoObservable(this, {}, { autoBind: true })\n\t}\n}\n\nconst store = new ${name}Store()\nexport default store`\n}\n\nconst createNamedMobxStoreStub = (name) => {\n\treturn `import { makeAutoObservable } from 'mobx'\n\nimport { ${name}StoreI } from './types'\n\nclass ${name}Store implements ${name}StoreI {\n\n\tconstructor() {\n\t\tmakeAutoObservable(this, {}, { autoBind: true })\n\t}\n}\n\nexport default ${name}Store`\n}\n\nmodule.exports = { createMobxStoreStub, createNamedMobxStoreStub }",
				"mobxStoreInterface.js": "const createMobxStoreInterfaceStub = () => {\n\treturn `export interface RootStoreI {\n\n}`\n}\n\nconst createNamedMobxStoreInterfaceStub = (name) => {\n\treturn `export interface ${name}StoreI {\n\n}\\n\\n`\n}\n\nmodule.exports = { createMobxStoreInterfaceStub, createNamedMobxStoreInterfaceStub }",
				"module.js": "const createModuleStub = (name) => {\n\treturn `import React from 'react'\n\nconst ${name}: React.FC = () => {\n\treturn (\n\t\t<div>\n\t\t\t${name}\n\t\t</div>\n\t)\n}\n\nexport { ${name} }\n`\n}\n\nmodule.exports = createModuleStub",
				"reExport.js": "const reExportStub = (name) => {\n\treturn `export { ${name} } from './ui'`\n}\n\nmodule.exports = reExportStub",
				"styles.js": "const createStylesStub = () => {\n\treturn `@import \"~style\";\n\n.root {\n\t//\n}`\n}\n\nmodule.exports = createStylesStub"
			},
			"tools.js": "const fs = require('fs')\n\nconst pathToReactComponents = 'src/component-react/'\nconst pathToCommonBlocks = 'src/block/common-blocks'\n\nconst createModule = (name) => {\n\tconst reExportStub = require('./stubs/reExport.js')\n\tconst createModuleStub = require('./stubs/module.js')\n\n\tconsole.clear()\n\n\tif(!name)\n\t\treturn console.error('\\x1b[41m', 'Введите имя модуля', '\\x1b[0m')\n\n\tconst path = `${pathToReactComponents}modules/`\n\tfs.mkdirSync(`${path}${name}/lib`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/ui`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/store`, { recursive: true })\n\n\ttry {\n\t\tfs.writeFileSync(`${path}${name}/index.tsx`, reExportStub(name))\n\t\tfs.writeFileSync(`${path}${name}/ui/index.tsx`, createModuleStub(name))\n\t} catch (err) {\n\t\tconsole.error(err)\n\t}\n\n\treturn console.log(`Module ${name} successfully created. Path: ${path}${name}`)\n}\n\nconst removeModule = (name) => {\n\tconst path = `${pathToReactComponents}modules/`\n\n\tfs.rmSync(`${path}${name}`, { recursive: true, force: true })\n\n\tconsole.log(`Module ${name} successfully removed. Path: ${path}${name}`)\n}\n\nconst createApp = (name) => {\n\tconst reExportStub = require('./stubs/reExport.js')\n\tconst createAppStub = require('./stubs/app.js')\n\n\tconsole.clear()\n\n\tif(!name)\n\t\treturn console.error('\\x1b[41m', 'Введите имя App', '\\x1b[0m')\n\n\tconst path = `${pathToReactComponents}apps/`\n\tfs.mkdirSync(`${path}${name}/lib`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/ui`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/store`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/controllers`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/pages`, { recursive: true })\n\n\ttry {\n\t\tfs.writeFileSync(`${path}${name}/index.tsx`, reExportStub(name))\n\t\tfs.writeFileSync(`${path}${name}/ui/index.tsx`, createAppStub(name))\n\t} catch (err) {\n\t\tconsole.error(err)\n\t}\n\n\treturn console.log(`App ${name} successfully created. Path: ${path}${name}`)\n}\n\nconst removeApp = (name) => {\n\tconst path = `${pathToReactComponents}apps/`\n\n\tfs.rmSync(`${path}${name}`, { recursive: true, force: true })\n\n\tconsole.log(`App ${name} successfully removed. Path: ${path}${name}`)\n}\n\nconst createComponent = (name) => {\n\tconst createCommonStub = require('./stubs/common.js')\n\tconst createStylesStub = require('./stubs/styles.js')\n\n\tconsole.clear()\n\n\tif(!name)\n\t\treturn console.error('\\x1b[41m', 'Введите имя компонента', '\\x1b[0m')\n\n\tconst path = `${pathToReactComponents}components/`\n\tfs.mkdirSync(`${path}${name}`, { recursive: true })\n\n\ttry {\n\t\tfs.writeFileSync(`${path}${name}/index.tsx`, createCommonStub(name))\n\t\tfs.writeFileSync(`${path}${name}/index.module.scss`, createStylesStub(name))\n\t} catch (err) {\n\t\tconsole.error(err)\n\t}\n\n\treturn console.log(`Component ${name} successfully created. Path: ${path}${name}`)\n}\n\nconst createMobxStore = (path, name) => {\n\tconst mobxStores = require('./stubs/mobxStore.js')\n\tconst mobxStoreInterfaces = require('./stubs/mobxStoreInterface.js')\n\n\tif(!path)\n\t\treturn console.error('\\x1b[41m', 'Введите путь, где необходимо создать Mobx Store', '\\x1b[0m')\n\n\tconst pathAndName = path.split('/')\n\tconst pathForWrite = `${pathToReactComponents}${pathAndName[0]}/`\n\n\ttry {\n\t\tif(!name) {\n\t\t\tfs.writeFileSync(`${pathForWrite}${pathAndName.at(-1)}/store/index.ts`, mobxStores.createMobxStoreStub('Root'))\n\t\t\tfs.writeFileSync(`${pathForWrite}${pathAndName.at(-1)}/store/types.ts`, mobxStoreInterfaces.createMobxStoreInterfaceStub('Root'))\n\t\t} else {\n\t\t\tfs.writeFileSync(`${pathForWrite}${pathAndName.at(-1)}/store/${name}Store.ts`, mobxStores.createNamedMobxStoreStub(name))\n\t\t\tfs.appendFileSync(`${pathForWrite}${pathAndName.at(-1)}/store/types.ts`, mobxStoreInterfaces.createNamedMobxStoreInterfaceStub(name))\n\t\t}\n\t} catch(err) {\n\t\tconsole.error(err)\n\t}\n}\n\nconst createCasesString = (arr) => {\n\tlet result = ''\n\n\tarr.forEach((e, i) => {\n\t\tresult += `${i > 0 ? '\\n\\t\\t\\t' : ''}case '${e.block}':`\n\n\t\te.files.forEach(paths => {\n\t\t\tresult += `\\n\\t\\t\\t\\timport(/* webpackMode: \"eager\" */ 'src/block/common-blocks/${e.block}/${paths}')`\n\t\t})\n\n\t\tresult += '\\n\\t\\t\\t\\tbreak;'\n\t})\n\n\treturn result\n}\n\nconst createFileContent = (arr) => {\n\tconst cases = createCasesString(arr)\n\n\treturn `const importCommonBlocks = (arr) => {\n\tarr.forEach(async e => {\n\t\tswitch(e) {\n\t\t\t${cases}\n\t\t}\n\t})\n}\n\nexport { importCommonBlocks }`\n}\n\nconst updateImporterPaths = () => {\n\tif(!fs.existsSync(pathToCommonBlocks))\n\t\treturn console.error('\\x1b[46m', `Отстутствует директория: ${pathToCommonBlocks}`, '\\x1b[0m')\n\n\tconst path = require('path')\n\n\tconst blocks = fs.readdirSync(pathToCommonBlocks, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)\n\n\tif(blocks.length === 0)\n\t\treturn console.error('\\x1b[46m', `Отстутствуют блоки в директории: ${pathToCommonBlocks}`, '\\x1b[0m')\n\n\tconst blocksData = []\n\n\tblocks.forEach(e => {\n\t\tconst files = fs.readdirSync(`${pathToCommonBlocks}/${e}/`, { withFileTypes: true }).map(dirent => dirent.name)\n\n\t\tconst obj = {\n\t\t\tblock: e,\n\t\t\tfiles: []\n\t\t}\n\n\t\tfiles.forEach(file => {\n\t\t\tif(path.extname(file) !== '.php')\n\t\t\t\tobj.files.push(file)\n\t\t})\n\n\t\tblocksData.push(obj)\n\t})\n\n\tconst result = createFileContent(blocksData)\n\n\tfs.writeFileSync('src/component/importer.js', result)\n\n\tconsole.log('\\x1b[36m', `\\n\\n${result}\\n\\n`, '\\x1b[0m')\n}\n\nconst createApi = (name) => {\n\tconst api = require('./stubs/api.js')\n\n\tconsole.clear()\n\n\tconst path = 'src/api/'\n\n\tif(!name)\n\t\treturn console.error('\\x1b[41m', 'Введите имя компонента', '\\x1b[0m')\n\n\tfs.mkdirSync(`${path}${name}`, { recursive: true })\n\n\ttry {\n\t\tfs.writeFileSync(`${path}${name}/index.ts`, api.createApiStub(name))\n\t\tfs.writeFileSync(`${path}${name}/types.ts`, api.createInterfaceStub(name))\n\t\tfs.writeFileSync(`${path}${name}/actions.ts`, '')\n\t} catch (err) {\n\t\tconsole.error(err)\n\t}\n\n\treturn console.log(`Api ${name} successfully created. Path: ${path}${name}`)\n}\n\nmodule.exports = { createModule, removeModule, createApp, removeApp, createComponent, createMobxStore, updateImporterPaths, createApi }\n"
		}
	},
	reactScripts = {
		"createModule": "run-func utils/react/tools.js createModule",
		"removeModule": "run-func utils/react/tools.js removeModule",
		"createApp": "run-func utils/react/tools.js createApp",
		"removeApp": "run-func utils/react/tools.js removeApp",
		"createComponent": "run-func utils/react/tools.js createComponent",
		"createMobxStore": "run-func utils/react/tools.js createMobxStore",
		"updateImporter": "run-func utils/react/tools.js updateImporterPaths",
		"createApi": "run-func utils/react/tools.js createApi"
	},

	// Содержимое пользовательских настроек
	settings = require("../../user.settings"),
	settingLines = fs.readFileSync(lib.USER_SETTINGS_FILE, "utf-8").split("\n"),

	package = lib.readRC("package.json", fs)
;


console.log('');


// Если прочитали настройки eslint
if (eslintRC) {
	console.log('Добавляем настройки eslint...');
	// Добавялем пресет
	// eslintRC.extends = eslintRC.extends.concat(eslint.extends);
	eslintRC.extends = lib.mergeUnique(eslintRC.extends, eslint.extends);
	// Добавляем плагин
	// eslintRC.plugins = eslintRC.plugins.concat(eslint.plugins);
	eslintRC.plugins = lib.mergeUnique(eslintRC.plugins, eslint.plugins);
	// Сохраняем новые настройки в файл настроек
	lib.writeRC(lib.ESLINT_RC_FILE, eslintRC, fs);
}


// Если прочитали настройки stylelint
if (stylelintRC) {
	console.log('Исправляем настройки stylelint для использования CSS-модулей...');
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

if (package) {
	console.log('Добавляем сценарии работы с утилитами для React...');
	Object.assign(package.scripts, reactScripts);
	lib.writeRC("package.json", package, fs);
}
