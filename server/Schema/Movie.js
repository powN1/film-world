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
	budget: {
		type: Number,
	},
	cover: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	originCountry: {
		type: [String],
	},
	length: {
		type: Number,
	},
	originalTitle: {
		type: String,
	},
  releaseDate: {
    type: Date
  },
	revenue: {
		type: Number,
	},
	status: {
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
		popularity: {
			type: Number,
		},
	},
	genre: {
		type: [String],
		required: true,
	},
	year: {
		type: Number,
	},
	director: {
		type: [String],
	},
	screenplay: {
		type: [String],
	},
	photos: {
		type: [String],
	},
	videos: {
		type: [String],
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "reviews",
		},
	],
});

export default mongoose.model("movies", movieSchema);
