const
	fs = require('fs'),
	path = require('path'),
	storiesPath = path.resolve(__dirname, '../src/stories')
;


try {
	fs.accessSync(storiesPath);
} catch (err) {
	console.log('Отсутствует каталог с историями Storybook - ' + storiesPath);
	process.exit();
}


const
	stories = fs.opendirSync(storiesPath),
	entries = []
;
let entry = null;
while (entry = stories.readSync()) {
	if ('.gitkeep' !== entry.name) {
		entries.push(entry.name);
	}
}

if (0 === entries.length) {
	console.log('Отсутствуют истории Storybook - ' + storiesPath);
	process.exit();
}


const
	userSettings = require('../user.settings'),
	{ spawn } = require("child_process"),
	yarn = spawn(
		"yarn",
		[
			"build-storybook",
			"-o",
			path.resolve(`${userSettings.docRoot + userSettings.storybookBuildPath}`),
			// "--debug-webpack",
		]
	)
;

yarn.stdout.on("data", (data) => {
    console.log(data.toString());
});

yarn.stderr.on("data", (data) => {
    console.log(data.toString());
});

yarn.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

yarn.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
});
