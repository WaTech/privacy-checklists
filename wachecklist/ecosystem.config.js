module.exports = {
	apps: [
		{
			name: 'WAChecklist',
			script: './keystone.js',
			watch: false,
			ignore_watch: [
				'public',
				'node_modules',
				'.idea',
				'.vscode',
				'.git',
			],
			env_development: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
};
