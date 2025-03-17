import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const { data } = await axios.post("http://localhost:5001/chatbot", { message: input });
            setMessages([...newMessages, { role: "bot", content: data.reply }]);
        } catch (error) {
            console.error("Error:", error);
        }

        setInput("");
        setLoading(false);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "Close Chat" : "Chat with Us"}
            </button>

            {isOpen && (
                <div className="absolute bottom-14 right-0 w-80 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-2">Healthcare Chatbot</h2>
                    <div className="h-60 overflow-y-auto p-2 border rounded-lg">
                        {messages.map((msg, index) => (
                            <p key={index} className={`p-2 ${msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-600"}`}>
                                <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong> {msg.content}
                            </p>
                        ))}
                        {loading && <p className="text-gray-500">Typing...</p>}
                    </div>
                    <div className="flex mt-3">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-lg"
                            placeholder="Ask a health question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={sendMessage} disabled={loading}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
