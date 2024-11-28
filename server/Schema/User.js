import mongoose, { Schema } from "mongoose";

let profile_imgs_name_list = [
	"Garfield",
	"Tinkerbell",
	"Annie",
	"Loki",
	"Cleo",
	"Angel",
	"Bob",
	"Mia",
	"Coco",
	"Gracie",
	"Bear",
	"Bella",
	"Abby",
	"Harley",
	"Cali",
	"Leo",
	"Luna",
	"Jack",
	"Felix",
	"Kiki",
];
let profile_imgs_collections_list = [
	"notionists-neutral",
	"adventurer-neutral",
	"fun-emoji",
];

const userSchema = mongoose.Schema(
	{
		personal_info: {
			firstName: {
				type: String,
				lowercase: true,
				required: true,
				minlength: [2, "First name must be 2 letters long"],
			},
			surname: {
				type: String,
				lowercase: true,
				required: true,
				minlength: [3, "fullname must be 3 letters long"],
			},
			username: {
				type: String,
				minlength: [3, "Username must be 3 letters long"],
				unique: true,
			},
			email: {
				type: String,
				required: true,
				lowercase: true,
				unique: true,
			},
			password: String,
			profile_img: {
				type: String,
				default: () => {
					return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`;
				},
			},
      backgroundImg: {
        type: String,
      }
		},
		account_info: {
			total_articles: {
				type: Number,
				default: 0,
			},
			total_reviews: {
				type: Number,
				default: 0,
			},
			total_reads: {
				type: Number,
				default: 0,
			},
		},
		admin: {
			type: Boolean,
			default: false,
		},
		google_auth: {
			type: Boolean,
			default: false,
		},
		facebook_auth: {
			type: Boolean,
			default: false,
		},
		articles: {
			type: [Schema.Types.ObjectId],
			ref: "articles",
			default: [],
		},
		reviews: {
			type: [Schema.Types.ObjectId],
			ref: "reviews",
			default: [],
		},
		ratings: {
			type: [
				{
					item_id: {
						type: Schema.Types.ObjectId,
						required: true,
						refPath: "ratings.itemType", // Dynamically references the correct collection
					},
					itemType: {
						type: String,
						required: true,
						enum: ["movies", "series", "games"], // Ensures the type is one of the three
					},
					rating: {
						type: Number,
						required: true,
						min: 1,
						max: 10,
					},
					reviewText: {
						type: String,
						maxlength: 160, // Optional field if you want to add short reviews
					},
					timestamp: {
						type: Date,
						default: Date.now,
					},
				},
			],
			default: [],
		},
		favoriteMedias: {
			type: [
				{
					item_id: {
						type: Schema.Types.ObjectId,
						required: true,
						refPath: "favoriteMedias.itemType", // Dynamically references the correct collection
					},
					itemType: {
						type: String,
						required: true,
						enum: ["movies", "series", "games"], // Ensures the type is one of the three
					},
					timestamp: {
						type: Date,
						default: Date.now,
					},
				},
			],
			default: [],
		},
		wantToSeeMedias: {
			type: [
				{
					item_id: {
						type: Schema.Types.ObjectId,
						required: true,
						refPath: "wantsToSeeMedias.itemType", // Dynamically references the correct collection
					},
					itemType: {
						type: String,
						required: true,
						enum: ["movies", "series", "games"], // Ensures the type is one of the three
					},
					timestamp: {
						type: Date,
						default: Date.now,
					},
				},
			],
			default: [],
		},
	},
	{
		timestamps: {
			createdAt: "joinedAt",
		},
	},
);

export default mongoose.model("users", userSchema);
