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

exports = module.exports = (req, res) => {
	const locals = res.locals;
	const view = new keystone.View(req, res);

	// Init locals
	locals.section = 'search';
	locals.data = {
		total: 0,
		posts: [],
		checklists: [],
		categories: [],
		query: req.query.q,
	};

	if (!req.query.q) return view.render('search');

	let query = new RegExp(`.*${req.query.q.trim().replace(/[<>*(+)?]/g, '\\$&')}.*`, 'i');

	view.on('init', async (next) => {
		try {
			const { tags, categories } = await searchByTagsAndCategory(query);
			const posts = await PostModel.searchByParams(query, categories);
			const checklists = await ChecklistModel.searchByParams(query, tags);
			const sortChecklists = sortByTags(checklists, query);

			locals.data.posts = posts;
			locals.data.checklists = sortChecklists;
			locals.data.total = posts.length + sortChecklists.length;
			next();
		} catch (e) {
			next(e);
		}
	});

	// Render the view
	view.render('search');
};
