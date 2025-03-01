"use client";

import { useState, useEffect, useRef } from "react";
import copy from "clipboard-copy";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 使用防抖 hook 处理文本值
  const debouncedText = useDebounce(text, 1000);

  // 当防抖后的文本变化时执行复制
  useEffect(() => {
    handleCopy(debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered!"))
        .catch((err) =>
          console.error("Service Worker registration failed:", err)
        );
    } else {
      console.log("Service Worker is not supported in this browser.");
    }
  }, []);

  const handleCopy = async (text: string) => {
    if (text === "") {
      setCopied(false);
      return;
    }
    try {
      await copy(text);
      console.log("文本已复制到剪贴板");
      setCopied(true);
    } catch (err) {
      console.error("无法复制文本:", err);
      setCopied(false);
    }
  };

  const handleClear = () => {
    setText("");
    setCopied(false);
    // 清除后自动聚焦到输入框
    textareaRef.current?.focus();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-pink-50 pt-[20vh]">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-pink-700">
          剪贴板同步工具
        </h1>
        <p className="text-center text-gray-700">
          在下方输入框中输入的内容会自动同步到您的剪贴板
        </p>
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            className="w-full p-4 border border-pink-300 rounded-md font-mono shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-500"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此输入文本..."
          />
          <div className="flex justify-between items-center min-h-[40px]">
            {text && copied && (
              <p className="text-sm text-green-600">✓ 文本已复制到剪贴板</p>
            )}
            {text && !copied && (
              <button
                onClick={() => handleCopy(text)}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition duration-200"
              >
                点击复制
              </button>
            )}
            {text && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-200"
              >
                清除
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
