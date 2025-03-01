import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  // 使用 useState 保存防抖后的值，初始值为传入的 value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // 使用 useEffect 管理防抖逻辑
  useEffect(() => {
    // 设置一个定时器，在 delay 时间后更新 debouncedValue
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：在组件更新或卸载时清除定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // 依赖项：value 或 delay 变化时重新执行

  // 返回防抖后的值
  return debouncedValue;
}

export { useDebounce };
