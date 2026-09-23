import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';

export const ChatbotButton = ({ onClick, isOpen = false }) => {
  if (isOpen) return null; // When modal/panel is open, launcher button can hide or show minimize

  return (
    <button
      onClick={onClick}
      aria-label="Open Sehat_Sathi AI Healthcare Assistant"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-elevated hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-teal-500/30 cursor-pointer"
    >
      <div className="relative flex items-center justify-center">
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-teal-700 rounded-full animate-pulse" />
      </div>

      <div className="hidden sm:flex flex-col text-left pr-1">
        <span className="text-xs font-bold leading-tight">Ask Sehat_Sathi</span>
        <span className="text-[10px] text-teal-100 font-medium leading-tight">AI Health Assistant</span>
      </div>
    </button>
  );
};
