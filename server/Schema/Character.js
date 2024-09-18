import mongoose, { Schema } from "mongoose";

const characterSchema = Schema({
	personal_info: {
		firstName: {
			type: String,
		},
		surname: {
			type: String,
		},
		fullname: {
			type: String,
		},
		characterName: {
			type: String,
		},
		dateOfBirth: {
			type: Date,
		},
		placeOfBirth: {
			type: String,
		},
		height: {
			type: Number,
		},
		bio: {
			type: String,
		},
	},
	banner: {
		type: String,
		required: true,
	},
	creators: {
		type: [String],
	},
	universe: {
		type: [String],
	},
	activity: {
		likedByCount: {
			type: Number,
		},
	},
	roles: [
		{
			type: Schema.Types.ObjectId,
			ref: "roles",
		},
	],
	adversaries: [
		{
			type: Schema.Types.ObjectId,
			ref: "characters",
		},
	],
});

export default mongoose.model("characters", characterSchema);
