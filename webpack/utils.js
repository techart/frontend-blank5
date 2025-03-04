const settings = require("../user.settings");
const path = require("path");

module.exports = {
	hotPort: function () {
		let node_version = process.env.HOSTNAME || "";

		switch (node_version) {
			case "nodejs-8":
				return 10120;

			case "nodejs-8-old":
				return 10121;

			case "nodejs-14":
				return 10140;

			case "nodejs-16":
				return 10160;

			case "nodejs-18":
				return 10180;

			case "nodejs-20":
			default:
				return 10200;
		}
	},

	hotUrl: function () {
		return (
			(settings.https ? "https" : "http") +
			"://localhost:" +
			this.hotPort()
		);
	},

	publicPath: function (env) {
		env = env || "prod";
		return this.buildPath(env).replace(path.resolve(settings.docRoot), "");
	},

	buildPath: function (env) {
		env = env || "prod";
		if (env === "hot") {
			env = "dev";
		}
		return path.resolve(settings.buildPath, env) + "/";
	},
};
