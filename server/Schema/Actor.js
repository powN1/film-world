import mongoose, { Schema } from "mongoose";

const roleSchema = mongoose.Schema({
	movieName: {
		type: String,
		required: false,
	},
	serieName: {
		type: String,
		required: false,
	},
	animeName: {
		type: String,
		required: false,
	},
	characterName: {
		type: String,
		required: true,
	},
  characterBanner: {
    type: String,
    required: true,
  },
	rating: {
		type: Number,
		required: true,
		min: 0,
		max: 10,
	},
	ratedCount: {
		type: Number,
		required: true,
	},
});

const actorSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	banner: {
		type: String,
		required: true,
	},
	roles: {
    type: [roleSchema],
    required: true
  },
	activity: {
		rating: {
			type: Number,
		},
		ratedByCount: {
			type: Number,
		},
	},
});

export default mongoose.model("actors", actorSchema);
