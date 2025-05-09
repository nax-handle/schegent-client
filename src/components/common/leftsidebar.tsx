import React from "react";
import { ChevronRight, MoreVertical, X } from "lucide-react";

export default function leftsidebar() {
  return (
    <div className="w-60 border-r border-gray-200 flex flex-col">
      <div className="p-3">
        <button className="w-full py-2 px-4 text-left rounded-md border border-gray-200 font-medium">
          New Chat
        </button>
      </div>

      <nav className="flex-1">
        <div className="px-3 py-2">
          <button className="flex items-center gap-2 w-full py-2 px-3 rounded-md bg-gray-100">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span>Recents</span>
          </button>
        </div>

        <div className="px-3 py-2">
          <button className="flex items-center gap-2 w-full py-2 px-3 rounded-md text-gray-700">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
              </svg>
            </div>
            <span>Projects</span>
          </button>
        </div>

        <div className="px-3 py-2">
          <button className="flex items-center gap-2 w-full py-2 px-3 rounded-md text-gray-700">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span>Community</span>
          </button>
        </div>

        <div className="px-3 py-2 border-t border-gray-200">
          <div className="flex items-center justify-between py-1 px-3">
            <span className="text-sm text-gray-500">Favorite Projects</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="px-3 py-2 border-t border-gray-200">
          <div className="flex items-center justify-between py-1 px-3">
            <span className="text-sm text-gray-500">Favorite Chats</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="px-3 py-2 border-t border-gray-200">
          <div className="flex items-center justify-between py-1 px-3">
            <span className="text-sm text-gray-500">Recent</span>
            <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
          </div>

          <div className="mt-1">
            <div className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-100">
              <span className="text-sm">Dashboard schedule</span>
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between py-2 px-3">
              <span className="text-sm">SaaS landing page</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3">
              <span className="text-sm">Card</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="mt-auto p-3 border-t border-gray-200">
        <div className="bg-gray-50 p-3 rounded-md relative">
          <div className="flex justify-between items-start">
            <div className="font-medium text-sm">New Feature</div>
            <button className="text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            v0 Premium users now have access to image generation in v0
          </p>
        </div>
      </div>
    </div>
  );
}
