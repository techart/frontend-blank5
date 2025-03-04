const lib = require("./_lib"),
	fs = require("fs"),
	// Дополнения к настройкам eslint
	eslint = {
		extends: ["plugin:react/recommended"],
		plugins: ["react"],
	},
	// Содержимое файла настроек eslint
	eslintRC = lib.readRC(lib.ESLINT_RC_FILE, fs),
	// Содержимое файла настроек stylelint
	stylelintRC = lib.readRC(lib.STYLELINT_RC_FILE, fs),
	// Дополнительная точка сборки React для пользовательских настроек
	entryPoint = {
		name: "react",
		file: "src/entry/react.js",
		content: "import 'component-react/apps';\n",
	},
	// Файлы для "блоков"
	blocks = {
		"common-blocks": {
			".gitkeep": "",
		},
		"common-components": {
			"common-components.js": "function requireAll(r) {\n\tr.keys().map(r)\n}\n\nrequireAll(require.context('.', true, /^\\.\\/[^/]+\\/[^/.]+\\.(js|css|scss|sass|less|ts)$/))\n",
		},
	},
	// Файлы для примера компонентов React
	reactComponents = {
		apps: {
			controllers: {
				".gitkeep": "",
			},
			hooks: {
				".gitkeep": "",
			},
			"index.ts": "export { App } from './ui'",
			pages: {
				".gitkeep": "",
			},
			stores: {
				".gitkeep": "",
			},
			ui: {
				"index.tsx":
					"import React from 'react'\n\nconst App: React.FC = () => {\n\treturn (\n\t\t<div>App example</div>\n\t)\n}\n\nexport { App }",
			},
		},
		components: {
			button: {
				"buttonHooks.tsx":
					"import { useState, useEffect, useCallback } from 'react'\nimport { Props } from './types'\n\nconst useButton = (props: Props) => {\n\tconst { handler, size, override, classes, options } = props\n\n\tconst [isActive, setIsActive] = useState<boolean>(false)\n\tconst [activeClass, setActiveClass] = useState<string>('defaultBtnActiveClass')\n\tconst [classesList, setClassesList] = useState<string>(`button`)\n\tconst [currentSize, setCurrentSize] = useState<string | null>('small')\n\tconst [currentAlign, setCurrentAlign] = useState<string>('left')\n\n\tconst onClickHandler = useCallback(() => {\n\t\tif(!handler)\n\t\t\treturn null\n\t\telse {\n\t\t\thandler()\n\t\t\tif(options?.canActive)\n\t\t\t\tsetIsActive(!isActive)\n\t\t}\n\t}, [handler, isActive])\n\n\tuseEffect(() => {\n\t\tif(override) {\n\t\t\tif(!classes) {\n\t\t\t\tthrow new Error('Override button must have prop classes')\n\t\t\t}\n\n\t\t\tsetClassesList(classes!)\n\t\t\tsetCurrentSize(null)\n\t\t} else {\n\t\t\tsetClassesList(`${classesList} ${classes}`)\n\n\t\t\tif(size)\n\t\t\t\tsetCurrentSize(size)\n\n\t\t\tif(options?.Ico?.src)\n\t\t\t\tsetCurrentAlign(`c-${options?.Ico?.align}-ico`)\n\n\t\t\tif(options?.activeClass)\n\t\t\t\tsetActiveClass(options!.activeClass)\n\n\t\t\tif(options?.forceActive)\n\t\t\t\tsetIsActive(true)\n\t\t}\n\n\t}, [])\n\n\treturn { onClickHandler, classesList, currentSize, isActive, activeClass, currentAlign }\n}\n\nexport default useButton",
				"index.tsx":
					"import React from 'react'\nimport clsx from 'clsx'\n\nimport { Props } from './types'\n\nimport useButton from './buttonHooks'\n\nconst Button: React.FC<Props> = (props: Props) => {\n\tconst { activeClass, classesList, currentSize, isActive, onClickHandler, currentAlign } = useButton(props)\n\n\treturn (\n\t\t<button\n\t\t\tonClick={onClickHandler}\n\t\t\tclassName={clsx(classesList, currentSize, {\n\t\t\t\t\t[activeClass]: isActive,\n\t\t\t\t\t['disabled']: props.options?.disabled,\n\t\t\t\t})\n\t\t\t}\n\t\t>\n\t\t\t{props.options?.Ico && <div className={currentAlign}>{props.options!.Ico.src}</div>}\n\t\t\t<span>\n\t\t\t\t{props.text}\n\t\t\t</span>\n\t\t</button>\n\t)\n}\n\nexport default React.memo(Button)",
				"styles.tsx":
					"import { createUseStyles } from 'react-jss'\nimport { colors } from 'style/variables'\n\nimport { useCommonSvgStrokeTransition } from 'style/svgTransitionsPreset'\n\nexport const useButtonWithIcon = (type: string) => {\n\tconst buttonSvg = useCommonSvgStrokeTransition({\n\t\tactiveColor: colors.colorHover,\n\t\ttiming: '0.3s',\n\t\ttype: type\n\t}).svgContainer\n\n\treturn {\n\t\tbutton: useButtonView().simpleButton,\n\t\tsvg: buttonSvg\n\t}\n}\n\nexport const useButtonView = createUseStyles<string, any>({\n\tsimpleButton: {\n\t\tcolor: colors.colorActive,\n\t\tbackgroundColor: colors.colorWhite,\n\n\t\t'&:hover': {\n\t\t\tbackgroundColor: colors.colorWhite,\n\t\t\tcolor: colors.colorHover,\n\t\t},\n\n\t\t'&.active': {\n\t\t\tbackgroundColor: colors.colorWhite,\n\t\t\tcolor: colors.colorHover,\n\t\t},\n\t}\n})\n",
				"types.ts":
					"export type Icon = {\n\tsrc: React.ReactNode\n\talign: string\n}\n\nexport type Options = {\n\tcanActive?: boolean\n\tforceActive?: boolean\n\tactiveClass?: string\n\tIco?: Icon | null\n\tdisabled?: boolean\n}\n\nexport type Props = {\n\ttext: string\n\thandler?: () => void\n\tsize?: string\n\toverride?: boolean\n\tclasses?: string\n\toptions?: Options\n}",
			},
			select: {
				"hooks.ts":
					"import { useEffect, useState, useCallback, RefObject } from 'react'\n\nconst useSelect = (clear: boolean, ref: RefObject<HTMLLabelElement | null>) => {\n\tconst [curOption, setCurOption] = useState<string | null>(null)\n\tconst [showOptions, setShowOptions] = useState<boolean>(false)\n\n\tuseEffect(() => {\n\t\tif(ref.current) {\n\t\t\tconst outsideMenuClickHandler = (e: Event) => {\n\t\t\t\tif(ref.current && !ref.current.contains(e.target as HTMLElement))\n\t\t\t\t\tsetShowOptions(false)\n\t\t\t}\n\n\t\t\tdocument.addEventListener('click', outsideMenuClickHandler)\n\n\t\t\treturn () => {\n\t\t\t\tdocument.removeEventListener('click', outsideMenuClickHandler)\n\t\t\t}\n\t\t}\n\t}, [ref])\n\n\tuseEffect(() => {\n\t\tif(clear) {\n\t\t\tsetCurOption(null)\n\t\t}\n\t}, [clear])\n\n\treturn {\n\t\tcurOption,\n\t\tsetCurOption,\n\t\tshowOptions,\n\t\tsetShowOptions,\n\t}\n}\n\nexport default useSelect",
				"index.tsx":
					"import React, { useCallback, useRef } from 'react'\nimport clsx from 'clsx'\n\nimport useSelect from './hooks'\n\nimport { useDefaultSelect } from './styles'\n\nimport { SelectT } from './types'\n\nconst Select: React.FC<SelectT> = ({\n\toptions,\n\tdisabled,\n\tisValid,\n\tplaceholder,\n\thandler,\n\tclasses,\n\tclear\n}) => {\n\tconst defaultStyles = useDefaultSelect().defaultSelect\n\tconst selectRef = useRef<HTMLLabelElement>(null),\n\n\t\t{\n\t\t\tcurOption,\n\t\t\tshowOptions,\n\t\t\tsetShowOptions,\n\t\t\tsetCurOption,\n\t\t} = useSelect(clear!, selectRef),\n\n\t\tonClickHandler = useCallback((value: string) => {\n\t\t\tsetCurOption(value)\n\t\t\tsetShowOptions(false)\n\n\t\t\tif(handler)\n\t\t\t\thandler(value)\n\t\t}, [])\n\n\treturn (\n\t\t<label className={clsx(defaultStyles, classes, {\n\t\t\t['disabled']: disabled,\n\t\t\t})}\n\t\t\tref={selectRef}\n\t\t>\n\t\t\t<div className={clsx('title', {\n\t\t\t\t['open']: showOptions,\n\t\t\t\t['error']: isValid,\n\t\t\t})} onClick={() => setShowOptions(!showOptions)}>\n\t\t\t\t{ curOption ? curOption : placeholder }\n\t\t\t</div>\n\t\t\t{showOptions &&\n\t\t\t<div className='select'>\n\t\t\t\t{options.map(item => (\n\t\t\t\t\t<div\n\t\t\t\t\t\tkey={item.name}\n\t\t\t\t\t\tclassName={clsx('option', {\n\t\t\t\t\t\t\t['active']: curOption === item.value,\n\t\t\t\t\t\t})}\n\t\t\t\t\t\tonClick={() => onClickHandler(item.value) }\n\t\t\t\t\t>\n\t\t\t\t\t{ item.name }\n\t\t\t\t\t</div>\n\t\t\t\t))}\n\t\t\t</div>\n\t\t\t}\n\t\t</label>\n\t)\n}\n\nexport default React.memo(Select)\n",
				"styles.tsx":
					"import { createUseStyles } from 'react-jss'\n\nexport const useDefaultSelect = createUseStyles<string, any>({\n\tdefaultSelect: {\n\t\tposition: 'relative',\n\t\tdisplay: 'flex',\n\t\tflexDirection: 'column',\n\t\tcursor: 'pointer',\n\n\t\t'&.disabled': {\n\t\t\t'pointerEvents': 'none',\n\t\t},\n\n\t\t'& div.title': {\n\t\t\tposition: 'relative',\n\t\t\twidth: '100%',\n\t\t\toverflow: 'hidden',\n\t\t\ttextOverflow: 'ellipsis',\n\n\t\t\t'&::before': {\n\t\t\t\tposition: 'absolute',\n\t\t\t\ttop: '50%',\n\t\t\t\tzIndex: 1,\n\t\t\t\tcontent: `''`,\n\t\t\t}\n\t\t},\n\n\t\t'& div.title.open': {\n\t\t\t'&::before': {\n\t\t\t\ttransform: 'translateY(-50%) rotate(180deg)',\n\t\t\t}\n\t\t},\n\n\t\t'& div.select': {\n\t\t\tdisplay: 'block',\n\t\t\tposition: 'absolute',\n\t\t\ttop: '100%',\n\t\t\tleft: 0,\n\t\t\tzIndex: 99,\n\t\t\twidth: '100%',\n\t\t\toverflowY: 'auto',\n\t\t\toverflowX: 'hidden',\n\t\t},\n\n\t\t'& div.option': {\n\t\t\tlineHeight: 1,\n\t\t},\n\t},\n})\n",
				"types.ts":
					"import { RegisterOptions, UseFormRegister, UseFormSetValue } from 'react-hook-form'\n\nexport type SelectT = {\n\toptions: Array<{\n\t\tname: string,\n\t\tvalue: string,\n\t}>\n\tclasses: string\n\tplaceholder: string\n\thandler?: any\n\tdisabled?: boolean\n\tclear?: boolean\n\tisValid?: object | undefined\n}",
			},
			title: {
				"index.module.scss": '@import "~style";\n',
				"index.tsx":
					"import React from 'react'\n\nimport styles from './index.module.scss'\n\ntype CommonTitleT = {\n\tchildren: string,\n}\n\nconst Title: React.FC<CommonTitleT> = ({ children }) => {\n\treturn <h1 className={styles.root}>{children}</h1>\n}\n\nexport default React.memo(Title)",
			},
		},
		hooks: {
			"useWindowDimensions.ts":
				"import { useState, useEffect } from 'react'\nimport throttle from 'lodash/throttle'\n\nconst useWindowDimensions = (): object => {\n\tconst [size, setWindowSize] = useState({\n\t\twidth: window.innerWidth,\n\t\theight: window.innerHeight\n\t})\n\n\tuseEffect(() => {\n\t\tconst resizeHandler = throttle((e: UIEvent)  => {\n\t\t\tconst w = e.target as Window\n\t\t\tsetWindowSize({\n\t\t\t\twidth: w.innerWidth,\n\t\t\t\theight: w.innerWidth\n\t\t\t})\n\t\t}, 100)\n\n\t\twindow.addEventListener('resize', resizeHandler)\n\n\t\treturn (): void => {\n\t\t\twindow.removeEventListener('resize', resizeHandler)\n\t\t}\n\t}, [])\n\n\treturn size\n}\n\nexport default useWindowDimensions\n",
		},
		modules: {
			modal: {
				controller: {
					"index.tsx":
						"const ModalController = (modalComponent = '') => {\n\tlet component = null\n\n\tswitch (modalComponent) {\n\t\tcase 'sendCheckWord':\n\t\t\tcomponent = <div>компонент1</div>\n\t\t\tbreak\n\t\tcase 'сhangePassword':\n\t\t\tcomponent = <div>компонент2</div>\n\t\t\tbreak\n\t\tdefault:\n\t\t\tcomponent = modalComponent\n\t\t\tbreak\n\t}\n\n\treturn component\n\n}\n\nexport default ModalController",
				},
				"index.ts": "export { Modal } from './ui'",
				lib: {
					"Store.ts":
						"import { makeAutoObservable } from 'mobx'\n\nimport ModalController from '../controller'\n\nclass ModalStore {\n\tmodalState: boolean = false\n\tmodalComponent: any = null\n\n\tconstructor() {\n\t\tthis.changeModalComponent = this.changeModalComponent.bind(this)\n\t\tthis.changeModalState = this.changeModalState.bind(this)\n\t\tmakeAutoObservable(this)\n\t}\n\n\tchangeModalState(state: boolean) {\n\t\tthis.modalState = state\n\t}\n\n\tchangeModalComponent(component: any) {\n\t\tthis.modalComponent = ModalController(component)\n\t}\n}\n\nconst Store = new ModalStore()\nexport default Store",
				},
				ui: {
					"index.module.scss":
						'@import "~style";\n\n.root {\n\ttop: 0;\n\tleft: 0;\n\twidth: 100vw;\n\theight: calc(100vh - calc(100vh - 100%));\n\tposition: fixed;\n\tz-index: 999;\n}\n\n.bg {\n\tposition: relative;\n\tz-index: 2;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\topacity: 0.5;\n\tbackground-color: black;\n}\n\n.content {\n\tposition: absolute;\n\tz-index: 3;\n\ttop: 50%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%);\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tmin-width: 340px;\n\tcolor: #fff;\n}\n\n.buttonWrapper {\n\tmax-width: 1440px;\n\tleft: 50%;\n\ttransform: translateX(-50%);\n\twidth: 100%;\n\ttop: 40px;\n\tposition: absolute;\n\tjustify-content: flex-end;\n\tdisplay: flex;\n\tz-index: 10;\n}\n\n.close {\n\twidth: 22px;\n\theight: 22px;\n\tcolor: #000;\n\tcursor: pointer;\n\tmargin-right: 20px;\n\n\tsvg {\n\t\tpath {\n\t\t\ttransition: fill 0.3s;\n\t\t\tfill: red;\n\t\t}\n\t}\n\n\t&:hover {\n\t\tsvg {\n\t\t\tpath {\n\t\t\t\tfill: red;\n\t\t\t}\n\t\t}\n\t}\n}\n',
					"index.tsx":
						"import { createRoot } from 'react-dom/client'\nimport { observer } from 'mobx-react-lite'\n\nimport Store from '../lib/Store'\n\nimport styles from './index.module.scss'\nimport { useCallback } from 'react'\n\nconst Modal = observer(() => {\n\tconst { modalState, modalComponent, changeModalState } = Store\n\n\tconst closeModal = useCallback(() => {\n\t\tchangeModalState(false)\n\t}, [])\n\n\tif(!modalState)\n\t\treturn null\n\n\treturn (\n\t\t<div className={styles.root}>\n\t\t\t<div className={styles.bg} onClick={closeModal}>\n\t\t\t\t<div className={styles.buttonWrapper}>\n\t\t\t\t\t<div className={styles.close} onClick={closeModal}>\n\t\t\t\t\t\tX\n\t\t\t\t\t\t{/* <CloseIcon /> */}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div className={styles.content}>\n\t\t\t\t{modalComponent}\n\t\t\t</div>\n\t\t</div>\n\n\t)\n})\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\tconst root = createRoot(document.getElementById('modal') as HTMLElement)\n\troot.render(<Modal />)\n})\n\nexport { Modal }",
				},
			},
		},
		style: {
			"svgTransitionsPreset.ts":
				"import { createUseStyles } from 'react-jss'\n\ntype RuleNames = 'svgContainer'\n\ntype useCommonSvgStrokeTransitionType = {\n\ttiming?: string\n\tactiveColor?: string\n\ttype?: string\n}\n\nexport const useCommonSvgStrokeTransition = createUseStyles<RuleNames, any>({\n\tsvgContainer: {\n\t\t'& div': {\n\t\t\tdisplay: 'flex',\n\t\t\talignItems: 'center'\n\t\t},\n\n\t\t'& svg path': {\n\t\t\ttransition: props => `stroke ${props.timing ?? '0.3s'}, fill ${props.timing ?? '0.3s'}`\n\t\t},\n\n\t\t'&:hover svg path': {\n\t\t\t'stroke': props => props.type === 'stroke' ? props.activeColor : '',\n\t\t\t'fill': (props: useCommonSvgStrokeTransitionType) => props.type === 'fill' ? props.activeColor : '',\n\t\t},\n\n\t\t'&.active svg path': {\n\t\t\t'stroke': props => props.type === 'stroke' ? props.activeColor : '',\n\t\t\t'fill': (props: useCommonSvgStrokeTransitionType) => props.type === 'fill' ? props.activeColor : '',\n\t\t},\n\n\t\t'& .c-right-ico': {\n\t\t\torder: 1\n\t\t}\n\t}\n})",
			"variables.ts":
				"export const colors = {\n\tcolorWhite: '#fff',\n\tcolorActive: '#005258',\n\tcolorHover: '#8eb533',\n}",
		},
		types: {
			"declaration.d.ts":
				"declare module '*.scss'\ndeclare module '*.module.scss'\ndeclare module '*.svg'",
		},
	},
	reactUtils = {
		react: {
			stubs: {
				"api.js":
					"const createInterfaceStub = (name) => {\n\treturn `export interface ${name}ApiI {\n\n}`\n}\n\nconst createApiStub = (name) => {\n\treturn `import axios from 'axios'\n\nimport { ${name}ApiI } from './types'\nimport { ResponseT } from 'api/types'\n\nclass ${name}Api implements ${name}ApiI {\n\tinstance = axios.create({\n\t\tbaseURL: '/api/',\n\t\ttimeout: 5000,\n\t\theaders: {\n\t\t\t'Content-Type': 'application/json'\n\t\t}\n\t})\n\n\tconstructor() {\n\t}\n}\n\nconst instance = new ${name}()\nexport default instance`\n}\n\nmodule.exports = { createApiStub, createInterfaceStub }",
				"app.js":
					"const createAppStub = (name) => {\n\treturn `import React from 'react'\n\nconst ${name}: React.FC = () => {\n\treturn (\n\t\t<div>\n\t\t\t${name}\n\t\t</div>\n\t)\n}\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\tconst root = createRoot(document.getElementById('${name}') as HTMLElement)\n\troot.render(<${name} />)\n})\n\nexport { ${name} }\n`\n}\n\nmodule.exports = createAppStub",
				"common.js":
					"const createCommonStub = (name) => {\n\treturn `import React from 'react'\n\nimport styles from './index.module.scss'\n\nconst ${name}: React.FC = () => {\n\treturn (\n\t\t<div className={styles.root}>\n\t\t\t${name}\n\t\t</div>\n\t)\n}\n\nexport { ${name} }\n`\n}\n\nmodule.exports = createCommonStub",
				"mobxStore.js":
					"const createMobxStoreStub = (name) => {\n\treturn `import { makeAutoObservable } from 'mobx'\n\nimport { ${name}StoreI } from './types'\n\nclass ${name}Store implements ${name}StoreI {\n\n\tconstructor() {\n\t\tmakeAutoObservable(this, {}, { autoBind: true })\n\t}\n}\n\nconst store = new ${name}Store()\nexport default store`\n}\n\nconst createNamedMobxStoreStub = (name) => {\n\treturn `import { makeAutoObservable } from 'mobx'\n\nimport { ${name}StoreI } from './types'\n\nclass ${name}Store implements ${name}StoreI {\n\n\tconstructor() {\n\t\tmakeAutoObservable(this, {}, { autoBind: true })\n\t}\n}\n\nexport default ${name}Store`\n}\n\nmodule.exports = { createMobxStoreStub, createNamedMobxStoreStub }",
				"mobxStoreInterface.js":
					"const createMobxStoreInterfaceStub = () => {\n\treturn `export interface RootStoreI {\n\n}`\n}\n\nconst createNamedMobxStoreInterfaceStub = (name) => {\n\treturn `export interface ${name}StoreI {\n\n}\\n\\n`\n}\n\nmodule.exports = { createMobxStoreInterfaceStub, createNamedMobxStoreInterfaceStub }",
				"module.js":
					"const createModuleStub = (name) => {\n\treturn `import React from 'react'\n\nconst ${name}: React.FC = () => {\n\treturn (\n\t\t<div>\n\t\t\t${name}\n\t\t</div>\n\t)\n}\n\nexport { ${name} }\n`\n}\n\nmodule.exports = createModuleStub",
				"reExport.js":
					"const reExportStub = (name) => {\n\treturn `export { ${name} } from './ui'`\n}\n\nmodule.exports = reExportStub",
				"styles.js":
					'const createStylesStub = () => {\n\treturn `@import "~style";\n\n.root {\n\t//\n}`\n}\n\nmodule.exports = createStylesStub',
			},
			"tools.js":
				"const fs = require('fs')\n\nconst pathToReactComponents = 'src/component-react/'\nconst pathToCommonBlocks = 'src/block/common-blocks'\n\nconst createModule = (name) => {\n\tconst reExportStub = require('./stubs/reExport.js')\n\tconst createModuleStub = require('./stubs/module.js')\n\n\tconsole.clear()\n\n\tif(!name)\n\t\treturn console.error('\\x1b[41m', 'Введите имя модуля', '\\x1b[0m')\n\n\tconst path = `${pathToReactComponents}modules/`\n\tfs.mkdirSync(`${path}${name}/lib`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/ui`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/store`, { recursive: true })\n\n\ttry {\n\t\tfs.writeFileSync(`${path}${name}/index.tsx`, reExportStub(name))\n\t\tfs.writeFileSync(`${path}${name}/ui/index.tsx`, createModuleStub(name))\n\t} catch (err) {\n\t\tconsole.error(err)\n\t}\n\n\treturn console.log(`Module ${name} successfully created. Path: ${path}${name}`)\n}\n\nconst removeModule = (name) => {\n\tconst path = `${pathToReactComponents}modules/`\n\n\tfs.rmSync(`${path}${name}`, { recursive: true, force: true })\n\n\tconsole.log(`Module ${name} successfully removed. Path: ${path}${name}`)\n}\n\nconst createApp = (name) => {\n\tconst reExportStub = require('./stubs/reExport.js')\n\tconst createAppStub = require('./stubs/app.js')\n\n\tconsole.clear()\n\n\tif(!name)\n\t\treturn console.error('\\x1b[41m', 'Введите имя App', '\\x1b[0m')\n\n\tconst path = `${pathToReactComponents}apps/`\n\tfs.mkdirSync(`${path}${name}/lib`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/ui`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/store`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/controllers`, { recursive: true })\n\tfs.mkdirSync(`${path}${name}/pages`, { recursive: true })\n\n\ttry {\n\t\tfs.writeFileSync(`${path}${name}/index.tsx`, reExportStub(name))\n\t\tfs.writeFileSync(`${path}${name}/ui/index.tsx`, createAppStub(name))\n\t} catch (err) {\n\t\tconsole.error(err)\n\t}\n\n\treturn console.log(`App ${name} successfully created. Path: ${path}${name}`)\n}\n\nconst removeApp = (name) => {\n\tconst path = `${pathToReactComponents}apps/`\n\n\tfs.rmSync(`${path}${name}`, { recursive: true, force: true })\n\n\tconsole.log(`App ${name} successfully removed. Path: ${path}${name}`)\n}\n\nconst createComponent = (name) => {\n\tconst createCommonStub = require('./stubs/common.js')\n\tconst createStylesStub = require('./stubs/styles.js')\n\n\tconsole.clear()\n\n\tif(!name)\n\t\treturn console.error('\\x1b[41m', 'Введите имя компонента', '\\x1b[0m')\n\n\tconst path = `${pathToReactComponents}components/`\n\tfs.mkdirSync(`${path}${name}`, { recursive: true })\n\n\ttry {\n\t\tfs.writeFileSync(`${path}${name}/index.tsx`, createCommonStub(name))\n\t\tfs.writeFileSync(`${path}${name}/index.module.scss`, createStylesStub(name))\n\t} catch (err) {\n\t\tconsole.error(err)\n\t}\n\n\treturn console.log(`Component ${name} successfully created. Path: ${path}${name}`)\n}\n\nconst createMobxStore = (path, name) => {\n\tconst mobxStores = require('./stubs/mobxStore.js')\n\tconst mobxStoreInterfaces = require('./stubs/mobxStoreInterface.js')\n\n\tif(!path)\n\t\treturn console.error('\\x1b[41m', 'Введите путь, где необходимо создать Mobx Store', '\\x1b[0m')\n\n\tconst pathAndName = path.split('/')\n\tconst pathForWrite = `${pathToReactComponents}${pathAndName[0]}/`\n\n\ttry {\n\t\tif(!name) {\n\t\t\tfs.writeFileSync(`${pathForWrite}${pathAndName.at(-1)}/store/index.ts`, mobxStores.createMobxStoreStub('Root'))\n\t\t\tfs.writeFileSync(`${pathForWrite}${pathAndName.at(-1)}/store/types.ts`, mobxStoreInterfaces.createMobxStoreInterfaceStub('Root'))\n\t\t} else {\n\t\t\tfs.writeFileSync(`${pathForWrite}${pathAndName.at(-1)}/store/${name}Store.ts`, mobxStores.createNamedMobxStoreStub(name))\n\t\t\tfs.appendFileSync(`${pathForWrite}${pathAndName.at(-1)}/store/types.ts`, mobxStoreInterfaces.createNamedMobxStoreInterfaceStub(name))\n\t\t}\n\t} catch(err) {\n\t\tconsole.error(err)\n\t}\n}\n\nconst createCasesString = (arr) => {\n\tlet result = ''\n\n\tarr.forEach((e, i) => {\n\t\tresult += `${i > 0 ? '\\n\\t\\t\\t' : ''}case '${e.block}':`\n\n\t\te.files.forEach(paths => {\n\t\t\tresult += `\\n\\t\\t\\t\\timport('src/block/common-blocks/${e.block}/${paths}')`\n\t\t})\n\n\t\tresult += '\\n\\t\\t\\t\\tbreak;'\n\t})\n\n\treturn result\n}\n\nconst createFileContent = (arr) => {\n\tconst cases = createCasesString(arr)\n\n\treturn `const importCommonBlocks = (arr) => {\n\tarr.forEach(e => {\n\t\tswitch(e) {\n\t\t\t${cases}\n\t\t}\n\t})\n}\n\nexport { importCommonBlocks }`\n}\n\nconst updateImporterPaths = () => {\n\tif(!fs.existsSync(pathToCommonBlocks))\n\t\treturn console.error('\\x1b[46m', `Отстутствует директория: ${pathToCommonBlocks}`, '\\x1b[0m')\n\n\tconst path = require('path')\n\n\tconst blocks = fs.readdirSync(pathToCommonBlocks, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)\n\n\tif(blocks.length === 0)\n\t\treturn console.error('\\x1b[46m', `Отстутствуют блоки в директории: ${pathToCommonBlocks}`, '\\x1b[0m')\n\n\tconst blocksData = []\n\n\tblocks.forEach(e => {\n\t\tconst files = fs.readdirSync(`${pathToCommonBlocks}/${e}/`, { withFileTypes: true }).map(dirent => dirent.name)\n\n\t\tconst obj = {\n\t\t\tblock: e,\n\t\t\tfiles: []\n\t\t}\n\n\t\tfiles.forEach(file => {\n\t\t\tif(path.extname(file) !== '.php')\n\t\t\t\tobj.files.push(file)\n\t\t})\n\n\t\tblocksData.push(obj)\n\t})\n\n\tconst result = createFileContent(blocksData)\n\n\tfs.writeFileSync('src/component/importer.js', result)\n\n\tconsole.log('\\x1b[36m', `\\n\\n${result}\\n\\n`, '\\x1b[0m')\n}\n\nconst createApi = (name) => {\n\tconst api = require('./stubs/api.js')\n\n\tconsole.clear()\n\n\tconst path = 'src/api/'\n\n\tif(!name)\n\t\treturn console.error('\\x1b[41m', 'Введите имя компонента', '\\x1b[0m')\n\n\tfs.mkdirSync(`${path}${name}`, { recursive: true })\n\n\ttry {\n\t\tfs.writeFileSync(`${path}${name}/index.ts`, api.createApiStub(name))\n\t\tfs.writeFileSync(`${path}${name}/types.ts`, api.createInterfaceStub(name))\n\t\tfs.writeFileSync(`${path}${name}/actions.ts`, '')\n\t} catch (err) {\n\t\tconsole.error(err)\n\t}\n\n\treturn console.log(`Api ${name} successfully created. Path: ${path}${name}`)\n}\n\nmodule.exports = { createModule, removeModule, createApp, removeApp, createComponent, createMobxStore, updateImporterPaths, createApi }\n",
		},
		"EntryBuilder.js": "const fs = require('fs')\nconst path = require('path')\nconst process = require('process')\n\nclass EntryBuilder {\n\tconstructor() {\n\t\tthis.basePath = 'src/block/'\n\t\tthis.commonBlocksBasePath = 'src/block/common-blocks/'\n\t\tthis.reactComponentsBasePath = 'src/component-react/'\n\t\tthis._injectDefaultLayout = this._injectDefaultLayout.bind(this)\n\t\tthis._createPathForPageBlocks = this._createPathForPageBlocks.bind(this)\n\t\tthis._createPathsArrForAdditionalBlocks = this._createPathsArrForAdditionalBlocks.bind(this)\n\t\tthis.__createPathsArrForReactComponents = this._createPathsArrForReactComponents.bind(this)\n\t\tthis._catchError = this._catchError.bind(this)\n\t}\n\n\t_catchError(path) {\n\t\tif(!fs.existsSync(path)) {\n\t\t\tconsole.error('\\x1b[46m', `Отсутствует директория: ${path}`, '\\x1b[0m')\n\t\t\tprocess.exit()\n\t\t}\n\t}\n\n\t_injectDefaultLayout() {\n\t\treturn `${this.basePath}layout`\n\t}\n\n\t_createPathForPageBlocks(pageBlocks) {\n\t\t// Если используется только папка common\n\t\tif(pageBlocks === '')\n\t\t\treturn ''\n\n\t\t// Если используются несколько папок\n\t\tif(Array.isArray(pageBlocks)) {\n\t\t\tlet blockList = []\n\n\t\t\tpageBlocks.forEach(pageBlock => {\n\t\t\t\tthis._catchError(`${this.basePath}${pageBlock}`)\n\n\t\t\t\tblockList.push(`${this.basePath}${pageBlock}`)\n\t\t\t})\n\n\t\t\treturn blockList\n\t\t}\n\n\t\t// Дефолтное поведение при использовании одной папки\n\t\tthis._catchError(`${this.basePath}${pageBlocks}`)\n\n\t\treturn `${this.basePath}${pageBlocks}`\n\t}\n\n\t_createPathsArrForAdditionalBlocks(additionalBlocks) {\n\t\tif(additionalBlocks.length === 0)\n\t\t\treturn null\n\n\t\tconst result = []\n\n\t\tadditionalBlocks.forEach(e => {\n\t\t\tthis._catchError(`${this.commonBlocksBasePath}${e}`)\n\n\t\t\tconst files = fs.readdirSync(`${this.commonBlocksBasePath}${e}`, { withFileTypes: true }).map(dirent => dirent.name)\n\n\t\t\tconst obj = {\n\t\t\t\tblock: e,\n\t\t\t\tfiles: []\n\t\t\t}\n\n\t\t\tfiles.forEach(file => {\n\t\t\t\tif(path.extname(file) !== '.php')\n\t\t\t\t\tif(path.basename(file, '.ts') !== 'types')\n\t\t\t\t\t\tobj.files.push(`${this.commonBlocksBasePath}${e}/${file}`)\n\t\t\t})\n\n\t\t\tresult.push(...obj.files)\n\t\t})\n\n\t\treturn result\n\t}\n\n\t_createPathsArrForReactComponents(reactComponents) {\n\t\tif(reactComponents.length === 0)\n\t\t\treturn null\n\n\t\tconst result = []\n\n\t\treactComponents.forEach(e => {\n\t\t\tthis._catchError(`${this.reactComponentsBasePath}${e}`)\n\n\t\t\tconst files = fs.readdirSync(`${this.reactComponentsBasePath}${e}`, { withFileTypes: true }).map(dirent => dirent.name)\n\n\t\t\tconst obj = {\n\t\t\t\tblock: e,\n\t\t\t\tfiles: []\n\t\t\t}\n\n\t\t\tfiles.forEach(file => {\n\t\t\t\tif(path.extname(file) === '.jsx' || path.extname(file) === '.js' || path.extname(file) === '.tsx' || path.extname(file) === '.ts')\n\t\t\t\t\t// обработка файла с названием index\n\t\t\t\t\tobj.files.push(`${this.reactComponentsBasePath}${e}/${file}`)\n\t\t\t})\n\n\t\t\tresult.push(...obj.files)\n\t\t})\n\n\t\treturn result\n\t}\n\n\t_createPathForAdditionalFiles(additionalFiles) {\n\t\tif(additionalFiles.length === 0)\n\t\t\treturn null\n\n\t\tconst result = []\n\n\t\tadditionalFiles.forEach(file => {\n\t\t\tthis._catchError(`src/${file}`)\n\n\t\t\tresult.push(`src/${file}`)\n\t\t})\n\n\t\treturn result\n\t}\n\n\t_createPathForLayout(layout) {\n\t\tthis._catchError(`src/${layout}`)\n\n\t\treturn `src/${layout}`\n\t}\n\n\tbuildEntry(pageBlocks, additionalBlocks = [], reactComponents = [], layout = '', additionalFiles = []) {\n\t\tconst buildedEntry = []\n\t\tconst pageBlocksPath = this._createPathForPageBlocks(pageBlocks)\n\t\tconst additionalBlocksPaths = this._createPathsArrForAdditionalBlocks(additionalBlocks)\n\t\tconst reactComponentsPaths = this._createPathsArrForReactComponents(reactComponents)\n\t\tconst additionalFilesPaths = this._createPathForAdditionalFiles(additionalFiles)\n\t\tconst layoutPaths = this._createPathForLayout(layout)\n\n\t\t// base site styles\n\t\tbuildedEntry.push('src/style/layout/base.scss')\n\t\tbuildedEntry.push('src/block/common-components')\n\t\t// page components\n\t\tif(pageBlocksPath !== '') {\n\t\t\tif(typeof pageBlocksPath === 'string')\n\t\t\t\tbuildedEntry.push(pageBlocksPath)\n\t\t\telse\n\t\t\t\tbuildedEntry.push(...pageBlocksPath)\n\t\t}\n\n\t\tif(reactComponentsPaths !== null && reactComponentsPaths.length > 0)\n\t\t\tbuildedEntry.push(...reactComponentsPaths)\n\n\t\tif(additionalBlocksPaths !== null && additionalBlocksPaths.length > 0)\n\t\t\tbuildedEntry.push(...additionalBlocksPaths)\n\n\t\tif(layout === '')\n\t\t\tbuildedEntry.push(this._injectDefaultLayout())\n\t\telse {\n\t\t\tbuildedEntry.push(layoutPaths)\n\t\t}\n\t\t// обработка другого лейаута\n\n\t\tif(additionalFiles !== null && additionalFiles.length > 0)\n\t\t\tbuildedEntry.push(...additionalFilesPaths)\n\n\t\t// обработка рандомных подключаемых файлов\n\n\t\treturn buildedEntry\n\t}\n}\n\nmodule.exports = new EntryBuilder()",
	},
	reactScripts = {
		createModule: "run-func utils/react/tools.js createModule",
		removeModule: "run-func utils/react/tools.js removeModule",
		createApp: "run-func utils/react/tools.js createApp",
		removeApp: "run-func utils/react/tools.js removeApp",
		createComponent: "run-func utils/react/tools.js createComponent",
		createMobxStore: "run-func utils/react/tools.js createMobxStore",
		updateImporter: "run-func utils/react/tools.js updateImporterPaths",
		createApi: "run-func utils/react/tools.js createApi",
	},
	// Содержимое пользовательских настроек
	settings = require("../../user.settings"),
	settingLines = fs.readFileSync(lib.USER_SETTINGS_FILE, "utf-8").split("\n"),
	settingsPrepend = "const entriesModule = require('./user.entries')\n\n",
	entriesContent = "// Подключайте сюда и экспортируйте описания сборок страниц\n// const mainEntry = require('./_entries/mainEntry')\n\nmodule.exports = {\n\t// mainEntry,\n}",
	packageData = lib.readRC("package.json", fs);

console.log("");

// Если прочитали настройки eslint
if (eslintRC) {
	console.log("Добавляем настройки eslint...");
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
	console.log(
		"Исправляем настройки stylelint для использования CSS-модулей..."
	);
	// Убираем шаблон для имён классов
	stylelintRC.rules["selector-class-pattern"] = null;
	// Сохраняем новые настройки в файл настроек
	lib.writeRC(lib.STYLELINT_RC_FILE, stylelintRC, fs);
}

// Если прочитали пользовательские настройки
if (settings && settingLines) {
	// Если не нашли в списке точек сборки точку сборки для React
	if ("undefined" === typeof settings.entry[entryPoint.name]) {
		let // В содержимом файла с настройками находим строку с началом списка точек сборки
			entryStart = settingLines.findIndex((line) =>
				line.match(/^\s+entry:\s+\{$/)
			),
			// Находим строку с окончанием списка точек сборки
			entryFinish =
				0 <= entryStart
					? settingLines
							.slice(entryStart)
							.findIndex((line) => line.match(/^\s+\},$/)) +
						entryStart
					: -1;

		console.log("Создаём точку сборки react...");
		if (0 < entryFinish) {
			console.log(
				"Добавляем запись о точке сборке в список точек сборки..."
			);
			// Вставляем перед окончанием списка точек сборки запись о точке сборки react
			settingLines.splice(
				entryFinish,
				0,
				`\t\t${entryPoint.name}: ['./${entryPoint.file}'],`
			);
			// Сохраняем изменённые настройки в файл
			fs.writeFileSync(
				lib.USER_SETTINGS_FILE,
				settingsPrepend + settingLines.join("\n"),
				"utf-8"
			);
			// Создаём "болванку" для подключения сборок страниц
			if (!fs.existsSync(entryPoint.file)) {
				console.log("Создаём файл с описаниями сборок страниц react...");
				fs.writeFileSync(
					lib.USER_ENTRIES_FILE,
					entriesContent,
					"utf-8"
				);
			} else {
				console.log("Файл с описаниями сборок страниц react уже существует.");
			}
		}

		if (!fs.existsSync(entryPoint.file)) {
			console.log("Создаём файл точки сборки react...");
			fs.writeFileSync(entryPoint.file, entryPoint.content);
		} else {
			console.log("Файл точки сборки react уже существует.");
		}
	} else {
		console.log("Точка сборки react уже задана в файле настроек.");
	}

	lib.makeDir(lib.REACT_DIR, fs);
	console.log("Формируем файлы примера React-приложения...");
	lib.makeFiles(reactComponents, lib.REACT_DIR, fs);
	console.log("Добавляем файлы React-утилит...");
	lib.makeFiles(reactUtils, "utils", fs);
	console.log("Добавляем каталоги \"блоков\" React-приложения...");
	lib.makeFiles(blocks, lib.BLOCKS_DIR, fs);
}

if (packageData) {
	console.log("Добавляем сценарии работы с утилитами для React...");
	Object.assign(packageData.scripts, reactScripts);
	lib.writeRC("package.json", packageData, fs);
}
