import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/AppLayout";
import { Icon } from "../components/Icon";
import { api } from "../lib/api";

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [suggestQuiz, setSuggestQuiz] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api("/chat").then((d) => {
      if (d.messages.length === 0) {
        setMessages([
          {
            role: "assistant",
            content: "Hi! I'm your AI Career Counselor. Ask me about careers, colleges, or salaries — or take the quiz for personalized matches.",
          },
        ]);
      } else {
        setMessages(d.messages);
      }
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || sending) return;
    setInput("");
    setSuggestQuiz(false);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setSending(true);
    try {
      const data = await api("/chat", { method: "POST", body: { message } });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setSuggestQuiz(!!data.suggestQuiz);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar title="AI Career Counselor" onBack={true} />

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} />
        ))}
        {sending && <ChatBubble role="assistant" content="Typing…" muted />}
        {suggestQuiz && (
          <button
            onClick={() => navigate("/quiz")}
            className="self-start bg-brand-soft text-brand text-sm font-medium px-4 py-2 rounded-xl"
          >
            Take the Career Quiz →
          </button>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 px-5 py-4 border-t border-border sticky bottom-0 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          className="input flex-1"
          maxLength={500}
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label="Send message"
          className="h-11 w-11 rounded-full bg-brand text-white grid place-items-center disabled:opacity-50 flex-shrink-0"
        >
          <Icon.Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function ChatBubble({ role, content, muted }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}>
      {!isUser && (
        <span className="h-7 w-7 rounded-full bg-brand text-white grid place-items-center flex-shrink-0">
          <Icon.Bot className="h-4 w-4" />
        </span>
      )}
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
          isUser
            ? "bg-brand text-white rounded-br-sm"
            : `bg-surface text-brand-dark rounded-bl-sm ${muted ? "italic text-muted" : ""}`
        }`}
      >
        {content}
      </div>
    </div>
  );
}
