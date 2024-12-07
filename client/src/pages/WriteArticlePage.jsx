import React, { createContext, useContext, useState } from "react";
import ArticleEditor from "../components/ArticleEditor";
import PublishForm from '../components/PublishForm'

const reviewStructure = {
	title: "",
	banner: "",
	content: [],
	tags: [],
	description: "",
	author: { personal_info: {} },
};

export const EditorContext = createContext({});

export default function WriteArticlePage() {
	const [article, setArticle] = useState(reviewStructure);
	const [editorState, setEditorState] = useState("editor");
	const [textEditor, setTextEditor] = useState({ isReady: false });

	return (
		<EditorContext.Provider value={{ article, setArticle, editorState, setEditorState, textEditor, setTextEditor }}>
			{editorState === "editor" ? <ArticleEditor /> : <PublishForm />}
		</EditorContext.Provider>
	);
}
