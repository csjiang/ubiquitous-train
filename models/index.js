const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack');

const Page = db.define('page', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle:  {
		type: Sequelize.STRING,
		allowNull: false
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('open', 'closed')
	},
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	tags: {
		type: Sequelize.ARRAY(Sequelize.TEXT)
	}
	}, {
		getterMethods: {
			route: function() {
				return '/wiki/' + this.urlTitle;
			}
		},
		hooks: {
			beforeValidate: function(page, options) {
				if (page.title) {
					page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
				} else {
					page.urlTitle = Math.random().toString(36).substring(2, 7);
				}
			}
		},
		classMethods: {
			findByTag: function(tags) {
				//console.log(tags)
				return this.findAll({
					where: {
						tags: {
							$overlap: tags
						}
					}
				})
			}
		}, 
		instanceMethods: {
			findSimilar: function() {
				return Page.findAll({
					where: {
						tags: {
							$overlap: this.tags
						},
						id: {
							$ne: this.id
						}
					}
				})
			}
		}
	});

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
		allowNull: false
    },
    email: {
        type: Sequelize.STRING,
		isEmail: true,
		allowNull: false
    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
