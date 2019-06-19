const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Checklist Model
 * ==========
 */

const Checklist = new keystone.List('Checklist', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: {
		createdAt: true,
		createdBy: true,
		updatedAt: true,
		updatedBy: true,
	},
});

Checklist.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Textarea },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	items: { type: Types.Relationship, ref: 'ChecklistItem', many: true },
	tags: { type: Types.Relationship, ref: 'Tag', many: true },
	related: {
		posts: { type: Types.Relationship, ref: 'Post', many: true },
		checklists: { type: Types.Relationship, ref: 'Checklist', many: true },
	},
	resources: { type: Types.Relationship, ref: 'Resource', many: true },
	resource: {
		title: { type: String },
		url: { type: Types.Url },
	},
	slug: { type: String },
});

Checklist.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Checklist.schema.pre('save', function (next) {
	if (this.slug) {
		this.slug = this.slug.replace(/\s/, '-');
	}
	next();
});

Checklist.defaultColumns = 'title, createdAt, createdBy, updatedBy, updatedAt';

Checklist.schema.static({
	searchByParams (query, tags, fields = '') {
		return this.find({
			$or: [
				{
					title: {
						$regex: query,
						$options: 'gi',
					},
				},
				{
					tags: {
						$in: tags,
					},
				},
			],
			state: 'published',
		}, fields)
		.sort('-updatedAt')
		.populate('tags', 'name key');
	},
});

Checklist.register();
