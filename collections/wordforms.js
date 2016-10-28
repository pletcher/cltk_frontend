this.Wordforms = new Meteor.Collection('wordforms');

Schemas.Wordforms = new SimpleSchema({
	word: {
		type: String,
		max: 60,
	},

	definitions: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
	},
	texts: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
	},

	createdAt: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isInsert) {
				return new Date();
			}
			return null;
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
	},
	updatedAt: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isUpdate) {
				return new Date();
			}
			return null;
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
	},

});

Wordforms.attachSchema(Schemas.Wordforms);
