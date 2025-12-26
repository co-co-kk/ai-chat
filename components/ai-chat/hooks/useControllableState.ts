import { useCallback, useState, SetStateAction, Dispatch } from "react";

// 🎣 可控状态Hook
// 用于处理受控和非受控组件的状态管理

interface UseControllableStateProps<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

/**
 * 可控状态Hook
 * @param props - 配置对象
 * @returns [当前值, 设置值函数]
 * 
 * @example
 * const [value, setValue] = useControllableState({
 *   value: props.value,
 *   defaultValue: 'default',
 *   onChange: props.onChange
 * });
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [T, Dispatch<SetStateAction<T>>] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as T) : internalValue;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(currentValue)
          : next;
      
      if (!isControlled) {
        setInternalValue(resolved);
      }
      
      onChange?.(resolved);
    },
    [currentValue, isControlled, onChange]
  );

  return [currentValue, setValue] as const;
}