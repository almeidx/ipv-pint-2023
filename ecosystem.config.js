exports.apps = [
	{
		cwd: "./server",
		env: {
			NODE_ENV: "production",
		},
		name: "server",
		script: "pnpm start",
	},
];
