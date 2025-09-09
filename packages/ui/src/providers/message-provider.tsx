"use client"

import { createContext, type ReactNode, useState } from "react";

interface MessageContextType {
  errors: string[];
  success: string[];
  setErrors: (msg: string[]) => void;
  setSuccess: (msg: string[]) => void;
}

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

  return (
    <MessageContext.Provider value={{ errors, success, setErrors, setSuccess }}>
      {children}
    </MessageContext.Provider>
  );
};
