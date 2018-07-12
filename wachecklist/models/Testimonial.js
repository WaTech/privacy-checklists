var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Testimonial Model
 * ==========
 */

var Testimonial = new keystone.List('Testimonial', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Testimonial.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	authorName: { type: String },
	position: { type: String },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
});

Testimonial.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Testimonial.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';

Testimonial.register();
