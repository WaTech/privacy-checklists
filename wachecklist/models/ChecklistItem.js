const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * ChecklistItem Model
 * ==========
 */

const ChecklistItem = new keystone.List('ChecklistItem', {
	map: { name: 'title' },
	track: {
		createdAt: true,
		createdBy: true,
		updatedAt: true,
		updatedBy: true,
	},
});

ChecklistItem.add({
	title: { type: String, required: true },
	heading: { type: String },
	content: { type: Types.Html, wysiwyg: true, height: 250 },
	items: {
		item_1: { type: Types.Html, wysiwyg: true, height: 200 },
		item_2: { type: Types.Html, wysiwyg: true, height: 200 },
		item_3: { type: Types.Html, wysiwyg: true, height: 200 },
		item_4: { type: Types.Html, wysiwyg: true, height: 200 },
		item_5: { type: Types.Html, wysiwyg: true, height: 200 },
		item_6: { type: Types.Html, wysiwyg: true, height: 200 },
		item_7: { type: Types.Html, wysiwyg: true, height: 200 },
		item_8: { type: Types.Html, wysiwyg: true, height: 200 },
		item_9: { type: Types.Html, wysiwyg: true, height: 200 },
		item_10: { type: Types.Html, wysiwyg: true, height: 200 },
		item_11: { type: Types.Html, wysiwyg: true, height: 200 },
		item_12: { type: Types.Html, wysiwyg: true, height: 200 },
		item_13: { type: Types.Html, wysiwyg: true, height: 200 },
		item_14: { type: Types.Html, wysiwyg: true, height: 200 },
		item_15: { type: Types.Html, wysiwyg: true, height: 200 },
	},
});

ChecklistItem.defaultColumns = 'title, createdAt, createdBy, updatedBy, updatedAt';

ChecklistItem.register();
