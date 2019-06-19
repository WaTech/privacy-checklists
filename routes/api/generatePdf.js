const fs = require('fs');
const pdf = require('html-pdf');
const keystone = require('keystone');
const handlebars = require('handlebars');

const ChecklistModel = keystone.list('Checklist').model;
const ChecklistItemModel = keystone.list('ChecklistItem').model;

const toObject = (obj) => obj.map(item => item.toObject());

const options = {
	border: 0,
	header: {
		height: '65px',
	},
	footer: {
		height: '45px',
		contents: {
			2: '',
		},
	},
	base: `file://${process.cwd()}/public/pdf`,
};

function isFull (items) {
	return items.every(item => !item.items);
};

exports = module.exports = async (req, res, next) => {
	const { body: data } = req;
	const fullChecklists = isFull(data.items);
	let checklists;
	let fields = 'items';

	try {
		const checklist = await ChecklistModel.findOne({ _id: data.id });

		if (fullChecklists) {
			checklists = data.items;
		} else {
			checklists = data.items.filter(item => item.items);
		}

		Promise.all(checklists.map(item => {
			if (!fullChecklists) {
				fields = item.items.map(item => `items.${item}`).toString().replace(/,/g, ' ');
			}

			return ChecklistItemModel.findOne({ _id: item.id }, `${fields} title heading content`);
		}))
		.then(checklists => {
			const { title, slug, content: { extended } } = checklist;

			fs.readFile('./templates/pdf/checklist-pdf.hbs', 'utf8', (err, file) => {
				if (err) return Promise.reject(err);
				const fileName = `${slug}-${Date.now()}`;

				const html = handlebars.compile(file)({
					title,
					extended,
					checklists: toObject(checklists),
				});

				options.footer.contents.default = `<div style="padding:0 30px;color:#d5d5d5;font-family:'Nunito',sans-serif;font-size:11px"><span style="float:left">${title}</span><span style="float:right">{{page}}</span></div>`;

				pdf.create(html, options).toFile(`./public/download/${fileName}.pdf`, (err) => {
					if (err) return Promise.reject(err);

					res.json({
						fileName: `${slug}.pdf`,
						fileUrl: `/download/${fileName}.pdf`,
					});
				});
			});
		})
		.catch(err => next(err));
	} catch (e) {
		next(e);
	}
};
