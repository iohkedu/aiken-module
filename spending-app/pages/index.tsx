import React, { useState } from "react";
import type { NextPage } from "next";
import "@meshsdk/react/styles.css";
import { Navbar } from "./components/Navbar";
import Spend from "./components/Spend";

export type SetMessageFn = (msg: string | null) => void;
export type SetMessageTypeFn = (
  msg: "success" | "error" | "warning" | null,
) => void;

const Home: NextPage = () => {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mensajeType, setMensajeType] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <Navbar setMensaje={setMensaje} setMensajeType={setMensajeType} />
      <Spend
        message={mensaje}
        messageType={mensajeType}
        setMessage={setMensaje}
        setMessageType={setMensajeType}
      />
    </div>
  );
};

export default Home;
