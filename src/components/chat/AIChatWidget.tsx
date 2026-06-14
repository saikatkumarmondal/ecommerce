"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMessageMutation } from "@/services/chatApi";
import { ChatMessage } from "@/services/chatApi";
import { cn } from "@/lib/utils";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your shopping assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openAIChat", handleOpen);
    return () => window.removeEventListener("openAIChat", handleOpen);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          content: "Sorry, I'm having trouble responding. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 sm:w-96 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">AI Assistant</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <p className="text-white/70 text-xs">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-7 w-7"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-7 w-7"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] px-3 py-2 rounded-2xl text-sm",
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="rounded-full text-sm h-9"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  className="rounded-full h-9 w-9 flex-shrink-0"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized state */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-950 rounded-full shadow-xl border px-4 py-2 flex items-center gap-3 cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI Assistant</span>
            <X
              className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsMinimized(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.div>
        </motion.button>
      )}
    </div>
  );
}