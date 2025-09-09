"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Bounce, toast } from "react-toastify";

interface SuccessMessageType {
  success: string[];
}

interface CustomSuccessProps {
  data: string;
}

export default function SuccessMessage({ success }: SuccessMessageType) {
  const { resolvedTheme } = useTheme();
  const toastIds = useRef<string[]>([]);
  useEffect(() => {
    success.map((msg, index) => {
      setTimeout(() => {
        const id = toast.success(CustomSuccess, {
          data: msg,
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: resolvedTheme === "dark" ? "dark" : "light",
          transition: Bounce,
        });
        toastIds.current.push(id.toString());
      }, index * 50);
    });
  }, [success]);

  useEffect(() => {
    toastIds.current.map((id) => {
      toast.update(id, {
        theme: resolvedTheme === "dark" ? "dark" : "light",
      });
    });
  }, [resolvedTheme]);

  return null;
}

function CustomSuccess({ data }: CustomSuccessProps) {
  return <div className="pl-1 pr-4">{data}</div>;
}
