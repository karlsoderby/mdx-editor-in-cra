import React, { useState } from 'react';
import '@mdxeditor/editor/style.css';
import { MDXProvider } from '@mdx-js/react';
import Modal from './components/Modal';


import {
  MDXEditor,
  quotePlugin,
  headingsPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  BlockTypeSelect,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  CreateLink,
  InsertTable,
  imagePlugin,
  tablePlugin,
  InsertCodeBlock,
  InsertImage,
  frontmatterPlugin,
  InsertFrontmatter
} from '@mdxeditor/editor';
 


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
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [currentContent, setCurrentContent] = useState<string>('');

  // Create a new entry
  const handleNewEntry = (): void => {
    const newEntry: MarkdownEntry = {
      id: Date.now(),
      title: 'Untitled',
      content: '',
    };
    setEntries([...entries, newEntry]);
    setCurrentEntryId(newEntry.id);
    setCurrentTitle(newEntry.title);
    setCurrentContent(newEntry.content);
  };

  // Save the current content and title to the selected entry
  const handleSaveEntry = (): void => {
    if (currentEntryId === null) return;

    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === currentEntryId
          ? { ...entry, title: currentTitle || 'Untitled', content: currentContent }
          : entry
      )
    );
  };

  // Load an entry into the editor
  const handleLoadEntry = (entry: MarkdownEntry): void => {
    setCurrentEntryId(entry.id);
    setCurrentTitle(entry.title);
    setCurrentContent(entry.content);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for saved entries */}
      <div
        style={{
          width: '25%',
          borderRight: '1px solid #ddd',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        <h2>Entries</h2>
        <button
          style={{
            padding: '0.5rem',
            marginBottom: '1rem',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
          onClick={handleNewEntry}
        >
          New Entry
        </button>
        <button
          style={{
            padding: '0.5rem',
            marginBottom: '1rem',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleSaveEntry}
        >
          Save Entry
        </button>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {entries.map((entry) => (
            <li key={entry.id} style={{ marginBottom: '0.5rem' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 'inherit',
                }}
                onClick={() => handleLoadEntry(entry)}
              >
                {entry.title || 'Untitled'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Markdown editor */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {/* Title input field */}
        <input
          type="text"
          value={currentTitle}
          placeholder="Enter a title..."
          onChange={(e) => setCurrentTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
          }}
        />

        {/* Markdown editor */}
        {currentEntryId !== null ? (

  
          <MDXEditor
            key={currentEntryId} // Force re-render when switching entries
            markdown={currentContent}
            onChange={(newContent) => {
              setCurrentContent(newContent);
            }}
            plugins={[
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
              frontmatterPlugin(),
              markdownShortcutPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              tablePlugin(),
              imagePlugin({
                imageUploadHandler: () => {
                  return Promise.resolve('https://picsum.photos/200/300')
                },
                imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200']
              }),
            ]}
          />

        ) : (
          <p>Please create or select an entry to start editing.</p>
        )}
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={handleOpenPrompt}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Open Prompt
          </button>
        </div>
      </div>
      
      <Modal isOpen={isPromptOpen} onClose={handleClosePrompt}>
        <h2>Prompt</h2>
        <p>Write your prompt functionality here.</p>
        <button
          onClick={handleClosePrompt}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            marginTop: '1rem',
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default App;