"use client";

import { Bounce, ToastContainer } from "react-toastify";
import ErrorMessage from "#components/error-message";
import { useContext } from "react";
import { MessageContext } from "@repo/ui/providers/message-provider";
import SuccessMessage from "#components/success-message";

export default function MyToastContainer() {
  const { errors, success } = useContext(MessageContext)!;
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Bounce}
      ></ToastContainer>
      <ErrorMessage errors={errors} />
      <SuccessMessage success={success} />
    </>
  );
}
