import mongoose, { Schema } from "mongoose";

const animeSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	banner: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	activity: {
		rating: {
			type: Number,
		},
		ratedByCount: {
			type: Number,
		},
		peopleAwaiting: {
			type: Number,
		},
	},
	genre: {
		type: [String],
		required: true,
	},
  seasons: {
    type: Number,
  },
	yearBeginning: {
		type: Number,
	},
	yearEnding: {
		type: Number,
	},
});

export default mongoose.model("animes", animeSchema);
