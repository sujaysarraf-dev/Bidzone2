/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { geminiService } from "../services/geminiService";
import { clsx } from "clsx";
import { useLocation } from "react-router-dom";
import { store } from "../store";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const location = useLocation();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! I'm the Bidzone Assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get context from current page
  const getContext = () => {
    const match = location.pathname.match(/\/auctions\/([^/]+)/);
    if (match) {
      const auctionId = match[1];
      const auction = store.getAuctionById(auctionId);
      if (auction) {
        return `The user is currently viewing an auction for: ${auction.title}. 
        Asset Type: ${auction.assetType}. 
        Description: ${auction.description}. 
        Current Bid: Rs. ${auction.currentBid}. 
        Location: ${auction.location.address}.
        Institution: ${auction.institutionId}.`;
      }
    }
    return undefined;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const context = getContext();
    
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    const response = await geminiService.chat(userMessage, context);
    setMessages(prev => [...prev, { role: "bot", text: response || "I'm sorry, I couldn't process that." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-neutral-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-neutral-800 transition-all hover:scale-110 active:scale-95"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? "64px" : "500px",
              width: "350px"
            }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="bg-white border border-neutral-200 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-neutral-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Bidzone AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={clsx(
                        "flex gap-3 max-w-[85%]",
                        m.role === "user" ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={clsx(
                        "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
                        m.role === "bot" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"
                      )}>
                        {m.role === "bot" ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div className={clsx(
                        "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                        m.role === "bot" ? "bg-white border border-neutral-100" : "bg-neutral-900 text-white"
                      )}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white border border-neutral-100 p-3 rounded-2xl shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-neutral-50 border-t border-neutral-100">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask a question..." 
                      className="w-full bg-white border border-neutral-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neutral-900 text-white rounded-lg disabled:opacity-50 transition-all"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
