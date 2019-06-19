const keystone = require('keystone');

/**
 * Tag Model
 * ==================
 */

const Tag = new keystone.List('Tag', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Tag.add({
	name: { type: String, required: true },
});

Tag.schema.static({
	searchByName (query) {
		return this.find({
			name: {
				$regex: query,
				$options: 'gi',
			},
		});
	},
});

Tag.register();
