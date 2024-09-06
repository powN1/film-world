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
	description: {
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
		type: String,
		required: true,
	},
	year: {
		type: Number,
	},
});

export default mongoose.model("games", gameSchema);
