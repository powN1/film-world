import mongoose, { Schema } from "mongoose";

const reviewSchema = mongoose.Schema({
	activity: {
		rating: {
			type: Number,
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
	},
	description: {
		type: String,
	},
	title: {
		type: String,
		required: true,
	},
});

export default mongoose.model("reviews", reviewSchema);
