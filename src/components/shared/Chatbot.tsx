"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

// Function to format links and markdown bold syntax (**text**) into clickable links and strong tags safely.
const formatMessage = (text: string) => {
  if (!text) return null;

  // Regex to match URLs: https://... or http://...
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split text by URLs first
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      // Clean up URL if it has trailing punctuation from the sentence
      let cleanUrl = part;
      const trailingPunctuation = /[.,)]+$/;
      const hasTrailing = cleanUrl.match(trailingPunctuation);
      let suffix = "";
      if (hasTrailing) {
        suffix = hasTrailing[0];
        cleanUrl = cleanUrl.replace(trailingPunctuation, "");
      }
      return (
        <span key={i}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800 font-semibold break-all inline"
          >
            {cleanUrl}
          </a>
          {suffix}
        </span>
      );
    }

    // For non-link parts, parse bold markdown **text**
    const boldRegex = /(\*\*.*?\*\*)/g;
    const subParts = part.split(boldRegex);

    return (
      <span key={i}>
        {subParts.map((subPart, j) => {
          if (subPart.startsWith("**") && subPart.endsWith("**")) {
            return (
              <strong key={j} className="font-extrabold text-gray-900">
                {subPart.slice(2, -2)}
              </strong>
            );
          }
          return subPart;
        })}
      </span>
    );
  });
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo Kaka! Beta Nina, Asisten AI Desa Nekmese. Ada yang bisa beta bantu hari ini? Kaka bisa bertanya tentang profil desa, destinasi wisata, produk UMKM lokal, kebudayaan, atau transparansi anggaran desa.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef(false);

  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input when chat is opened (desktop only to prevent mobile keyboard flickering loops)
      if (windowSize.width >= 768) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      }
    }
  }, [messages, isOpen, isLoading, windowSize.width]);

  const sendMessage = async (messageText: string) => {
    if (isLoading) return;
    setErrorMessage(null);

    // Tambah pesan user ke state
    const updatedMessages = [...messages, { role: "user" as const, content: messageText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Siapkan riwayat pesan untuk API
      const riwayatPesan = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pesanBaru: messageText,
          riwayatPesan: riwayatPesan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Tangani HTTP 429 atau error lainnya
        if (response.status === 429) {
          throw new Error("Sistem sedang sibuk karena banyak antrean. Silakan coba 1 menit lagi.");
        } else {
          throw new Error(data.error || "Terjadi kesalahan saat menghubungi asisten AI.");
        }
      }

      // Tambahkan balasan bot ke chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, content: data.balasan },
      ]);
    } catch (error: any) {
      console.error("Error sending message to chatbot:", error);
      const userFriendlyError = error?.message || "Terjadi kesalahan. Silakan coba lagi.";
      
      // Tampilkan error feedback berwarna merah muda di dalam UI
      setErrorMessage(userFriendlyError);
      
      // Opsional: Tambahkan error state ke daftar pesan
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: userFriendlyError,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue("");
    sendMessage(text);
  };

  return (
    <div className={cn(
      "fixed z-50 font-sans",
      isOpen
        ? "inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-auto sm:h-auto"
        : "bottom-6 right-6"
    )}>
      {/* Floating Action Button (Glossy Drag-and-Drop Apple Style) */}
      <motion.button
        drag={!isOpen}
        dragConstraints={{
          left: -windowSize.width + 80,
          right: 0,
          top: -windowSize.height + 80,
          bottom: 0,
        }}
        dragElastic={0.1}
        dragMomentum={false}
        animate={{
          x: isOpen ? 0 : undefined,
          y: isOpen ? 0 : undefined,
        }}
        onTap={() => {
          setIsOpen(!isOpen);
        }}
        className={cn(
          "items-center justify-center size-14 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-turquoise/40 backdrop-blur-md",
          isOpen
            ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer shadow-[0_8px_24px_rgba(239,68,68,0.25)] border border-red-600/20 sm:flex hidden absolute bottom-0 right-0"
            : "bg-white/20 text-slate-700/60 hover:bg-white/60 hover:text-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.35)] border border-white/40 cursor-grab active:cursor-grabbing flex"
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        layout
        aria-label="Tanya Nina - Asisten AI Desa"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="size-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel (Frosted Glassmorphism) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed sm:absolute inset-0 sm:inset-auto sm:bottom-20 sm:right-0 w-full sm:w-[400px] h-[100dvh] sm:h-[600px] max-h-screen sm:max-h-[calc(100vh-8rem)] bg-white rounded-none sm:rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border-0 sm:border border-gray-100 z-50 animate-in fade-in duration-200"
          >
            {/* Header (Solid White) */}
            <div className="bg-white border-b border-gray-100 text-navy px-5 py-4 flex items-center justify-between shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-turquoise/10 flex items-center justify-center border border-turquoise/20 relative shadow-inner">
                  <Bot className="size-6 text-turquoise" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-navy tracking-wide leading-tight flex items-center gap-1.5">
                    Nina - Asisten AI Desa Nekmese
                    <Sparkles className="size-3.5 text-amber-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">Aktif untuk info seputar desa</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors focus:outline-none"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Message List Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-200",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed",
                        isUser
                          ? "bg-turquoise/20 text-slate-900 border border-turquoise/30 rounded-tr-none font-medium shadow-sm"
                          : msg.isError
                          ? "bg-rose-50 text-rose-700 border border-rose-100/80 rounded-tl-none flex items-start gap-2.5 font-medium shadow-sm"
                          : "bg-white text-gray-800 border border-gray-100 rounded-tl-none font-normal shadow-sm"
                      )}
                    >
                      {!isUser && msg.isError && (
                        <AlertCircle className="size-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div className="whitespace-pre-line break-words">
                        {formatMessage(msg.content)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in duration-200">
                  <div className="bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <span className="text-xs font-medium">Asisten sedang mengetik</span>
                    <div className="flex space-x-1 items-center h-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-turquoise rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-turquoise rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-turquoise rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error banner inside message stream */}
              {errorMessage && !messages[messages.length - 1]?.isError && (
                <div className="bg-rose-50 border border-rose-100/80 text-rose-700 rounded-xl p-3 text-xs flex items-center gap-2 animate-in fade-in duration-300">
                  <AlertCircle className="size-4 text-rose-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Quick Reply Suggestion Pills */}
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-col gap-2 mt-4 px-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">Rekomendasi Pertanyaan:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { text: "🌿 Wisata Alam", query: "Apa saja tempat wisata alam yang menarik di Desa Nekmese?" },
                      { text: "☕ Kopi Nekmese", query: "Bagaimana cara memesan Kopi Arabika Nekmese?" },
                      { text: "🗺️ Visi & Misi", query: "Apa visi dan misi Desa Nekmese?" },
                      { text: "📊 APBDes", query: "Berapa total anggaran APBDes Nekmese terbaru?" }
                    ].map((pill, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => sendMessage(pill.query)}
                        className="text-xs bg-white hover:bg-slate-50 text-teal-800 border border-slate-200 rounded-full px-3 py-1.5 font-medium transition-all text-left shadow-sm active:scale-95 cursor-pointer"
                      >
                        {pill.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scroll Helper */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer (Solid White) */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-gray-150 bg-white flex items-center gap-2 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.01)]"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder={isLoading ? "Menunggu balasan..." : "Tulis pesan Anda..."}
                className={cn(
                  "flex-1 border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-turquoise focus:ring-1 focus:ring-turquoise transition-all bg-slate-50",
                  isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-150" : "border-slate-200"
                )}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={cn(
                  "p-2.5 rounded-full text-white transition-all focus:outline-none",
                  isLoading || !inputValue.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-slate-200/20"
                    : "bg-slate-900 hover:bg-slate-800 hover:shadow-[0_4px_12px_rgba(15,23,42,0.25)] active:scale-95 cursor-pointer"
                )}
                aria-label="Kirim pesan"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
