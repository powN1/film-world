import mongoose, { Schema } from "mongoose";

const movieSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	banner: {
		type: String,
		required: true,
	},
	cover: {
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
	length: {
		type: Number,
	},
	year: {
		type: Number,
	},
	originCountry: {
		type: [String],
	},
	director: {
		type: [String],
	},
	screenplay: {
		type: [String],
	},
  status: {
    type: String
  }
});

export default mongoose.model("movies", movieSchema);
