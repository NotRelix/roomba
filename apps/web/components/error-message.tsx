"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Bounce, toast } from "react-toastify";

interface ErrorMessageType {
  errors: string[];
}

interface CustomErrorProps {
  data: string;
}

export default function ErrorMessage({ errors }: ErrorMessageType) {
  const { resolvedTheme } = useTheme();
  const toastIds = useRef<string[]>([]);
  useEffect(() => {
    errors.map((error, index) => {
      setTimeout(() => {
        const id = toast.error(CustomError, {
          data: error,
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
  }, [errors]);

  useEffect(() => {
    toastIds.current.map((id) => {
      toast.update(id, {
        theme: resolvedTheme === "dark" ? "dark" : "light",
      });
    });
  }, [resolvedTheme]);

  return null;
}

function CustomError({ data }: CustomErrorProps) {
  return <div className="pl-1 pr-4">{data}</div>;
}
