import mongoose, { Schema } from "mongoose";

const reviewSchema = mongoose.Schema(
	{
		review_id: {
			type: String,
			required: true,
			unique: true,
		},
		activity: {
			rating: {
				type: Number,
			},
			totalComments: {
				type: Number,
				default: 0,
			},
			totalParentComments: {
				type: Number,
				default: 0,
			},
		},
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "users",
		},
		banner: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
			enum: ["movies", "series", "games"],
		},
		content: {
			type: [],
			// required: true
		},
		comments: {
			type: [Schema.Types.ObjectId],
			ref: "comments",
		},
		description: {
			type: String,
		},
		draft: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			required: true,
		},
		referredMedia: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "category",
		},
	},
	{
		timestamps: {
			createdAt: "publishedAt",
		},
	},
);
export default mongoose.model("reviews", reviewSchema);
