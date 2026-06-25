"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X, Send, Minimize2, User,
  ArrowRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMessageMutation } from "@/services/chatApi";
import { ChatMessage } from "@/services/chatApi";
import { useAppSelector } from "@/store/hooks";
import { GeminiIcon } from "./GeminiIcon";
import { cn } from "@/lib/utils";

const GUEST_MESSAGES = [
  "👋 Hi! I'm your AI Shopping Assistant powered by Gemini.",
  "I can help you find products, track orders, answer questions, and much more!",
  "Create a free account to start chatting with me.",
];

export function AIChatWidget() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Shopping Assistant powered by **Gemini**. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  // Open from Navbar chat icon click
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener("openAIChat", handleOpen);
    return () => window.removeEventListener("openAIChat", handleOpen);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && isAuthenticated) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized, isAuthenticated]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await sendMessage({
        message: input,
        history: messages.slice(-10),
      }).unwrap();

      if (res.data?.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data!.reply },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble right now. Please try again in a moment.",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple markdown bold renderer
  const renderContent = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
            className="w-[340px] sm:w-[380px] bg-white dark:bg-gray-950 rounded-3xl shadow-2xl border border-border/50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <GeminiIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-none">
                      AI Assistant
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-white/70 text-[11px]">
                        Powered by Gemini
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* === GUEST VIEW === */}
            {!isAuthenticated ? (
              <div className="p-5">
                {/* Guest Messages */}
                <div className="space-y-3 mb-5">
                  {GUEST_MESSAGES.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="flex gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <GeminiIcon className="w-4 h-4" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-foreground leading-relaxed">
                        {msg}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Features */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-4 mb-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    ✨ What I can do
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "🛍️ Find products",
                      "📦 Track orders",
                      "💰 Best deals",
                      "❓ Any questions",
                    ].map((feat) => (
                      <div
                        key={feat}
                        className="text-xs bg-white dark:bg-gray-900 rounded-xl px-3 py-2 font-medium shadow-sm"
                      >
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/register");
                    }}
                    className="w-full h-11 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Sparkles className="w-4 h-4" />
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/login");
                    }}
                    className="w-full h-10 rounded-2xl border-2 border-border hover:border-primary/40 text-sm font-semibold transition-colors"
                  >
                    Already have an account? Sign in
                  </motion.button>
                </div>
              </div>
            ) : (
              /* === AUTHENTICATED CHAT VIEW === */
              <>
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-3 bg-muted/10">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex gap-2.5",
                        msg.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <GeminiIcon className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                          msg.role === "user"
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-sm"
                            : "bg-white dark:bg-gray-900 border border-border/50 rounded-tl-sm"
                        )}
                      >
                        {renderContent(msg.content)}
                      </div>

                      {msg.role === "user" && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2.5 justify-start"
                    >
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <GeminiIcon className="w-4 h-4" />
                      </div>
                      <div className="bg-white dark:bg-gray-900 border border-border/50 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                        <div className="flex gap-1 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                              animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                              transition={{
                                duration: 0.7,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {[
                        "Find best deals",
                        "Track my order",
                        "Return policy",
                        "Recommend products",
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => {
                            setInput(prompt);
                            inputRef.current?.focus();
                          }}
                          className="flex-shrink-0 text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full font-medium hover:from-blue-100 hover:to-purple-100 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t bg-background">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="rounded-2xl pr-4 text-sm h-10 bg-muted/50 border-muted focus-visible:ring-blue-500/30"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex-shrink-0 transition-opacity"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    Powered by Google Gemini AI
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Pill */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="bg-white dark:bg-gray-950 border rounded-full shadow-xl px-4 py-2.5 flex items-center gap-2.5 hover:shadow-2xl transition-shadow"
          >
            <GeminiIcon className="w-5 h-5" />
            <span className="text-sm font-semibold">AI Assistant</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsMinimized(false);
              }}
              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.button>
        )}
      </AnimatePresence>

      {/* FAB — Gemini Icon */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-xl flex items-center justify-center group"
        >
          <GeminiIcon className="w-7 h-7" />

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-2xl animate-ping bg-purple-500 opacity-20 group-hover:opacity-0" />

          {/* Tooltip */}
          <div className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Chat with Gemini AI
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </motion.button>
      )}
    </div>
  );
}
