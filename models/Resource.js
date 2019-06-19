const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Resource Model
 * ==========
 */

const Resource = new keystone.List('Resource', {
	map: { name: 'title' },
});

Resource.add({
	title: { type: String, required: true },
	url: { type: Types.Url },
});

Resource.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Resource.defaultColumns = 'title';

Resource.register();
