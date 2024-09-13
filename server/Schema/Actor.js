import mongoose, { Schema } from "mongoose";

const actorSchema = mongoose.Schema({
	personal_info: {
		name: {
			type: String,
			required: true,
		},
		dateOfBirth: {
			type: Date,
		},
		dateOfDeath: {
			type: Date,
		},
		placeOfBirth: {
			type: String,
		},
		knownFor: {
			type: String,
		},
		bio: {
			type: String,
		},
	},
	banner: {
		type: String,
		required: true,
	},
	activity: {
		rating: {
			type: Number,
		},
		ratedByCount: {
			type: Number,
		},
	},
	roles: [
		{
			type: Schema.Types.ObjectId,
			ref: "roles",
		},
	],
});

export default mongoose.model("actors", actorSchema);
