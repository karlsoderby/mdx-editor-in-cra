import React, { useState } from "react";
import "@mdxeditor/editor/style.css";
import Modal from "./components/Modal";

import {
  MDXEditor,
  quotePlugin,
  headingsPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  CreateLink,
  InsertTable,
  imagePlugin,
  tablePlugin,
  InsertImage,
  frontmatterPlugin,
  InsertFrontmatter,
} from "@mdxeditor/editor";

// Define the type for each markdown entry
type MarkdownEntry = {
  id: number;
  title: string;
  content: string;
};

function App(): JSX.Element {
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const handleOpenPrompt = () => setIsPromptOpen(true);
  const handleClosePrompt = () => setIsPromptOpen(false);

  const [entries, setEntries] = useState<MarkdownEntry[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<number | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const [editorKey, setEditorKey] = useState(0); // Key to force re-render only when necessary

  const handleExportMarkdown = () => {
    // Transform the title into a file-safe format
    const formatTitle = (title: string) =>
      title
        .trim() // Remove leading and trailing spaces
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/[^a-z0-9\-]/g, ""); // Remove non-alphanumeric characters except dashes

    const filename = `${formatTitle(currentTitle || "untitled")}.md`;

    const blob = new Blob([currentContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename; // Use the formatted filename
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNewEntry = (): void => {
    const newEntry: MarkdownEntry = {
      id: Date.now(),
      title: "Untitled",
      content: "",
    };
    setEntries([...entries, newEntry]);
    setCurrentEntryId(newEntry.id);
    setCurrentTitle(newEntry.title);
    setCurrentContent(newEntry.content);
  };

  const handleSaveEntry = (): void => {
    if (currentEntryId === null) return;

    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === currentEntryId
          ? {
              ...entry,
              title: currentTitle || "Untitled",
              content: currentContent,
            }
          : entry
      )
    );
  };

  const handleLoadEntry = (entry: MarkdownEntry): void => {
    setCurrentEntryId(entry.id);
    setCurrentTitle(entry.title);
    setCurrentContent(entry.content);
  };

  // Callback to append prompt response
  const handleAddContent = (newContent: string): void => {
    setCurrentContent((prevContent) => `${prevContent}\n${newContent}`);
    setEditorKey((prevKey) => prevKey + 1); // Update the editorKey to force a re-render
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar for saved entries */}
      <div
        style={{
          width: "25%",
          borderRight: "1px solid #ddd",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <h2>Entries</h2>
        <button
          style={{
            padding: "0.5rem",
            marginBottom: "1rem",
            background: "#28a745",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginRight: "0.5rem",
          }}
          onClick={handleNewEntry}
        >
          New Entry
        </button>
        <button
          style={{
            padding: "0.5rem",
            marginBottom: "1rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleSaveEntry}
        >
          Save Entry
        </button>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {entries.map((entry) => (
            <li key={entry.id} style={{ marginBottom: "0.5rem" }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "inherit",
                }}
                onClick={() => handleLoadEntry(entry)}
              >
                {entry.title || "Untitled"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Markdown editor */}
      <div style={{ flex: 1, padding: "1rem" }}>
        <div className="flex">
          <input
            type="text"
            value={currentTitle}
            placeholder="Enter a title..."
            onChange={(e) => setCurrentTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1rem",
              border: "1px solid #ddd",
            }}
          />

          <button
            onClick={handleExportMarkdown}
            style={{
              padding: "1px 1px",
              backgroundColor: "#ff9800",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Export Markdown
          </button>
        </div>
        {currentEntryId !== null ? (
          <MDXEditor
            key={editorKey} // Force re-render only when editorKey changes
            markdown={currentContent}
            onChange={(newContent) => setCurrentContent(newContent)}
            plugins={[
              frontmatterPlugin(),
              quotePlugin(),
              headingsPlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <InsertFrontmatter />
                    <InsertTable />
                    <InsertImage />
                    <CreateLink />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />
                  </>
                ),
              }),
              markdownShortcutPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              tablePlugin(),
              imagePlugin({
                imageUploadHandler: () =>
                  Promise.resolve("https://picsum.photos/200/300"),
                imageAutocompleteSuggestions: [
                  "https://picsum.photos/200/300",
                  "https://picsum.photos/200",
                ],
              }),
            ]}
          />
        ) : (
          <p>Please create or select an entry to start editing.</p>
        )}
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={handleOpenPrompt}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Open Prompt
          </button>
        </div>
      </div>

      <Modal
        isOpen={isPromptOpen}
        onClose={handleClosePrompt}
        onAddContent={handleAddContent}
      />
    </div>
  );
}

export default App;
