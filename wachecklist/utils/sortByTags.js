const moment = require('moment');

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
}

module.exports = sortByTags;
