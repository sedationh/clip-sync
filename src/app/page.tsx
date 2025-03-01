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

  const handleCopy = async (text: string) => {
    if (text === "") {
      setCopied(false);
      return;
    }
    try {
      // 保存当前焦点元素
      const activeElement = document.activeElement;

      await copy(text);
      console.log("文本已复制到剪贴板");
      setCopied(true);

      // 如果之前焦点在文本框，则恢复焦点
      if (activeElement === textareaRef.current) {
        textareaRef.current?.focus();
      }
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">剪贴板同步工具</h1>
        <p className="text-center text-gray-600">
          在下方输入框中输入的内容会自动同步到您的剪贴板
        </p>
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            className="w-full p-3 border border-gray-300 rounded-md font-mono"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此输入文本..."
          />
          <div className="flex justify-between items-center">
            {text && copied && (
              <p className="text-sm text-green-600">✓ 文本已复制到剪贴板</p>
            )}
            {text && !copied && (
              <button
                onClick={() => handleCopy(text)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                点击复制
              </button>
            )}
            {text && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
