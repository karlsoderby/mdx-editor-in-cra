import React, { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddContent: (content: string) => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAddContent }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const handlePrompt = async () => {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure your .env file is configured
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await res.json();
      setResponse(data.choices[0]?.message?.content || "No response received.");
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Chat with OpenAI</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <button
          onClick={handlePrompt}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Send Prompt
        </button>
        {response && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <h3 className="font-semibold mb-2">Response:</h3>
            <p className="text-gray-700 mb-4">{response}</p>
            <button
              onClick={() => {
                onAddContent(response); // Pass the response to the parent
                onClose(); // Close the modal
                console.log("Adding content:", response);
              }}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Add to Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;