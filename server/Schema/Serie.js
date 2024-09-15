import mongoose, { Schema } from "mongoose";

const serieSchema = mongoose.Schema({
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
	createdBy: {
		type: [String],
	},
	description: {
		type: String,
	},
	firstAirDate: {
		type: Date,
	},
	lastAirDate: {
		type: Date,
	},
	numberOfEpisodes: {
		type: Number,
	},
	numberOfSeasons: {
		type: Number,
	},
	originCountry: {
		type: [String],
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
	seasons: {
		type: [
			{
				airDate: String,
				episodeCount: Number,
				name: String,
				description: String,
				cover: String,
				seasonNumber: Number,
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
			},
		],
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

export default mongoose.model("series", serieSchema);
