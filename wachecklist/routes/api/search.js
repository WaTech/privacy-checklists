const keystone = require('keystone');
const moment = require('moment');
const TagModel = keystone.list('Tag').model;
const PostModel = keystone.list('Post').model;
const ChecklistModel = keystone.list('Checklist').model;
const CategoryModel = keystone.list('PostCategory').model;

async function searchByTagsAndCategory (query) {
	const tags = await TagModel.searchByName(query);
	const categories = await CategoryModel.searchByName(query);

	return { tags, categories };
};

function sortByTags (data, query) {
	return data.map(item => {
		const post = item.toObject();
		const tag = post.tags.find(tag => query.test(tag.name));
		const index = post.tags.indexOf(tag);

		return { ...post, index };
	})
	.sort((prev, next) => {
		if (prev.index === next.index) {
			const prevDate = moment(prev.updatedAt).valueOf();
			const nextDate = moment(next.updatedAt).valueOf();
			return nextDate - prevDate;
		} else if (prev.index === -1 || next.index === -1) {
			return next.index - prev.index;
		} else {
			return prev.index - next.index;
		}
	});
};

exports = module.exports = async (req, res, next) => {
	if (!req.query.q) return res.json({});

	let query = new RegExp(`.*${req.query.q.trim().replace(/[<>*(+)?]/g, '\\$&')}.*`, 'i');

	try {
		const { tags, categories } = await searchByTagsAndCategory(query);
		const posts = await PostModel.searchByParams(query, categories, 'title');
		const checklists = await ChecklistModel.searchByParams(query, tags, 'title tags updatedAt');
		const sortChecklists = sortByTags(checklists, query);

		res.json({ results: [...sortChecklists, ...posts].slice(0, 6) });
	} catch (e) {
		next(e);
	}
};
