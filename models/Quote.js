const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Quote Model
 * ==================
 */

const Quote = new keystone.List('Quote', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Quote.add({
	name: { type: String, required: true },
	quote: { type: Types.Textarea },
	author: { type: Types.Text },
	typeTarget: { type: Types.Select, options: 'checklist, manual', default: 'checklist' },
	targetChecklist: { type: Types.Relationship, ref: 'Checklist', dependsOn: { typeTarget: 'checklist' } },
	targetLink: { type: Types.Text, dependsOn: { typeTarget: 'manual' } },
});

Quote.register();
