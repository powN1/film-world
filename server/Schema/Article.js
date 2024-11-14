import mongoose, { Schema } from "mongoose";

const articleSchema = mongoose.Schema(
	{
		articleId: {
			type: String,
			required: true,
			unique: true,
		},
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
			maxlength: 200,
			// required: true
		},
		content: {
			type: [],
			// required: true
		},
		tags: {
			type: [String],
			// required: true
		},
		draft: {
			type: Boolean,
			default: false,
		},
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "users",
		},
		activity: {
			total_comments: {
				type: Number,
				default: 0,
			},
			total_parent_comments: {
				type: Number,
				default: 0,
			},
		},
		comments: {
			type: [Schema.Types.ObjectId],
			ref: "comments",
		},
	},
	{
		timestamps: {
			createdAt: "publishedAt",
		},
	},
);

export default mongoose.model("articles", articleSchema);
