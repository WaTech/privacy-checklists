const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Section Model
 * ==========
 */

const Section = new keystone.List('Section', {
	map: { name: 'title' },
});

Section.add({
	title: { type: String },
	content: { type: Types.Html, wysiwyg: true, height: 250 },
	media: { type: Types.Text },
	button: {
		text: { type: Types.Text },
		url: { type: Types.Url },
	},
});

Section.defaultColumns = 'title';

Section.register();
