import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema(
	{
		mediaId: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "mediaType",
		},
		mediaAuthor: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "mediaType",
		},
		comment: {
			type: String,
			required: true,
		},
		children: {
			type: [Schema.Types.ObjectId],
			ref: "comments",
		},
		commentedBy: {
			type: Schema.Types.ObjectId,
			require: true,
			ref: "users",
		},
		isReply: {
			type: Boolean,
			default: false,
		},
		parent: {
			type: Schema.Types.ObjectId,
			ref: "comments",
		},
		mediaType: {
			type: String,
			required: true,
			enum: ["movies", "series", "games", "articles", "reviews"], // List of possible collections
		},
	},
	{
		timestamps: {
			createdAt: "commentedAt",
		},
	},
);

export default mongoose.model("comments", commentSchema);
