import mongoose, { Schema } from "mongoose";

const actorSchema = mongoose.Schema({
	personal_info: {
		name: {
			type: String,
			required: true,
		},
		fullname: {
			type: String,
		},
		dateOfBirth: {
			type: Date,
      required: true,
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
