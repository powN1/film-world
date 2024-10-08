import mongoose, { Schema } from "mongoose";

const gameSchema = mongoose.Schema({
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
	},
	genre: {
		type: [String],
		required: true,
	},
	releaseDate: {
		type: Date,
	},
	dlcs: {
		type: [
			{
				name: String,
				cover: {
					url: String,
				},
			},
		],
	},
	platforms: {
		type: [String],
	},
	similarGames: {
		type: [String],
	},
	universe: {
		type: [String],
	},
	developers: {
		type: [String],
	},
	publishers: {
		type: [String],
	},
	photos: {
		type: [String],
	},
	videos: {
		type: [String],
	},
	reviews: {
		type: [Schema.Types.ObjectId],
		ref: "reviews",
		default: [],
	},
});

export default mongoose.model("games", gameSchema);
