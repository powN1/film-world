import React, { createContext, useContext, useState } from "react";
import NewsEditor from "../components/NewsEditor";
import PublishForm from '../components/PublishForm'

const newsStructure = {
	title: "",
	banner: "",
	content: [],
	tags: [],
	description: "",
	author: { personal_info: {} },
};

export const EditorContext = createContext({});

export default function CreateNewsPage() {
	const [news, setNews] = useState(newsStructure);
	const [editorState, setEditorState] = useState("editor");
	const [textEditor, setTextEditor] = useState({ isReady: false });
	const [loading, setLoading] = useState(true);

	return (
		<EditorContext.Provider value={{ news, setNews, editorState, setEditorState, textEditor, setTextEditor }} >
			{editorState === "editor" ? <NewsEditor /> : <PublishForm />}
		</EditorContext.Provider>
	);
}
