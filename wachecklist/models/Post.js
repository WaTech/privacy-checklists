const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

const Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Textarea },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	related: {
		posts: { type: Types.Relationship, ref: 'Post', many: true },
		checklists: { type: Types.Relationship, ref: 'Checklist', many: true },
	},
	slug: { type: String },
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Post.schema.pre('save', function (next) {
	if (this.slug) {
		this.slug = this.slug.replace(/\s/, '-');
	}
	next();
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';

Post.schema.static({
	searchByParams (query, categories, fields = '') {
		return this.find({
			$or: [
				{
					title: {
						$regex: query,
						$options: 'gi',
					},
				},
				{
					categories: {
						$in: categories,
					},
				},
			],
			state: 'published',
		}, fields)
		.sort('-publishedDate')
		.populate('categories');
	},
});

Post.register();
