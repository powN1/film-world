import React, { createContext, useContext, useState } from "react";
import ReviewEditor from "../components/ReviewEditor";
import PublishReviewForm from '../components/PublishReviewForm'

const reviewStructure = {
	title: "",
	banner: "",
  category: "",
	content: [],
	tags: [],
	description: "",
  referredMediaID: "",
	author: { personal_info: {} },
  activity: { rating: 0 },
};

export const EditorContext = createContext({});

export default function WriteArticlePage() {
	const [review, setReview] = useState(reviewStructure);
	const [editorState, setEditorState] = useState("editor");
	const [textEditor, setTextEditor] = useState({ isReady: false });

	return (
		<EditorContext.Provider value={{ review, setReview, editorState, setEditorState, textEditor, setTextEditor }}>
			{editorState === "editor" ? <ReviewEditor /> : <PublishReviewForm/>}
		</EditorContext.Provider>
	);
}
