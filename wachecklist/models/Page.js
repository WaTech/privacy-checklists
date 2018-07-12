const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Page Model
 * ==========
 */

const Page = new keystone.List('Page', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Page.add({
	title: { type: String, required: true },
	pageTitle: { type: String },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
	slug: { type: String, unique: true },
	sections: { type: Types.Relationship, ref: 'Section', many: true },
});

Page.defaultColumns = 'title';

Page.register();
