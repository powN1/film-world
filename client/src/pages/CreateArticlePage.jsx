import React, { createContext, useContext, useState } from "react";
import ArticleEditor from "../components/ArticleEditor";
import PublishForm from '../components/PublishForm'

const articleStructure = {
	title: "",
	banner: "",
	content: [],
	tags: [],
	description: "",
	author: { personal_info: {} },
};

export const EditorContext = createContext({});

export default function CreateArticlePage() {
	const [article, setArticle] = useState(articleStructure);
	const [editorState, setEditorState] = useState("editor");
	const [textEditor, setTextEditor] = useState({ isReady: false });
	const [loading, setLoading] = useState(true);

	return (
		<EditorContext.Provider value={{ article, setArticle, editorState, setEditorState, textEditor, setTextEditor }} >
			{editorState === "editor" ? <ArticleEditor /> : <PublishForm />}
		</EditorContext.Provider>
	);
}
