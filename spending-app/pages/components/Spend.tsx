import React, { useState } from "react";
import { useWallet } from "@meshsdk/react";
import {
  applyCborEncoding,
  deserializeDatum,
  Data,
  PlutusScript,
  resolvePlutusScriptAddress,
  UTxO,
} from "@meshsdk/core";

import "@meshsdk/react/styles.css";
import { SetMessageFn, SetMessageTypeFn } from "../index";

import { sendToScript, unlockFromScript } from "../api/spendTx.ts";
import { parseData, initializeBlockchainProvider } from "../api/utils.ts";

const blockchainProvider = initializeBlockchainProvider();

type CustomizedProps = {
  setMessage: SetMessageFn;
  setMessageType: SetMessageTypeFn;
  message: string | null;
  messageType: string | null;
};

const blackList: string[] = [
  "14448cd177575a9f27c3107d84f325d784cd036ab4f87f20490cc10ba925cbb9:0",
  "a29bf0db95db5f048a12d6b630e09d8767581ef25806abdf8e267b191cd3e1d4:0",
  "06536000b97a851f3cec32b0f77001cdbbd9aa3ed512aa02e9be6bb79b9c36c6:0",
  "86703dca6b85987d187f765167afefce1d0e52d571f16971a3e8218ccf2024d9:0",
  "51b31b09efb313bc6def019c7f441efc8c52ab34d31cb43f892f8759787b2144:0",
  "e49c6cb17b78f757c38ee6c292394ee46c43a744825757ad0eafe7ec17615dd5:0",
  "f610387049f91e22df83fe586bc126671ee98cc275ea639a626d8d003d84163e:0",
];

const Customized = ({
  setMessage,
  setMessageType,
  message,
  messageType,
}: CustomizedProps) => {
  const { wallet, connected } = useWallet();
  const [scriptAddress, setAddress] = useState("");
  const [scriptUTxOs, setScriptUTxOs] = useState<UTxO[]>([]);
  const [cbor, setCbor] = useState("");
  const [cborEncoded, setCborEncoded] = useState("");
  const [datum, setDatum] = useState("");
  const [redeemer, setRedeemer] = useState("");
  const [ada, setAda] = useState("");
  const [error, setError] = useState("");

  const setAdaFromInput = async (dat: string) => {
    if (/^\d*$/.test(dat)) {
      const numAda: number = parseInt(dat, 10) * 1000000;
      setAda(numAda.toString());

      if (dat && parseInt(dat, 10) < 2) {
        setError("The ADA amount has to be greater than 2");
      } else {
        setError("");
      }
    } else {
      setError("You have to select an amount in ADA");
    }
  };

  const setRedeemerFromInput = async (dat: string) => {
    setRedeemer(dat);
  };
  const setDatumFromInput = async (dat: string) => {
    setDatum(dat);
  };

  const unlock = async (txHash: string, index: number) => {
    setMessage("Sending transaction");
    setMessageType("warning");
    if (redeemer != "") {
      if (redeemer.includes("{")) {
        const red = parseData(JSON.parse(redeemer));
        const resultTxHash = await unlockFromScript(
          wallet,
          cborEncoded,
          txHash,
          index,
          red,
        );
        if (!resultTxHash.includes("error")) {
          setMessage("Transaction sent: " + resultTxHash);
          setMessageType("success");
        } else {
          setMessage(resultTxHash);
          setMessageType("error");
        }
      } else {
        const resultTxHash = await unlockFromScript(
          wallet,
          cborEncoded,
          txHash,
          index,
          redeemer,
        );
        if (!resultTxHash.includes("error")) {
          setMessage("Transaction sent: " + resultTxHash);
          setMessageType("success");
        } else {
          setMessage(resultTxHash);
          setMessageType("error");
        }
      }
    } else {
      setMessage("Write a Redeemer");
      setMessageType("error");
    }
  };

  const lock = async () => {
    setMessage("Sending Transaction");
    setMessageType("warning");
    if (ada !== "" && error === "" && datum !== "") {
      try {
        if (datum.includes("{")) {
          const parsed: Data = parseData(JSON.parse(datum));
          const resultTxHash = await sendToScript(
            wallet,
            scriptAddress,
            ada,
            parsed,
          );
          if (!resultTxHash.includes("error")) {
            setMessage("Transaction sent: " + resultTxHash);
            setMessageType("success");
          } else {
            setMessage(resultTxHash);
            setMessageType("error");
          }
        } else {
          const resultTxHash = await sendToScript(
            wallet,
            scriptAddress,
            ada,
            datum,
          );
          if (!resultTxHash.includes("error")) {
            setMessage("Transaction sent: " + resultTxHash);
            setMessageType("success");
          } else {
            setMessage(resultTxHash);
            setMessageType("error");
          }
        }
      } catch (err) {
        setMessage("Select a valid Datum: " + err);
        setMessageType("error");
      }
    } else {
      setMessage("Error in Datum or Redeemer");
      setMessageType("error");
    }
  };

  const setCborFromTextarea = async (
    event: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text");
    event.currentTarget.value += pastedData;
    await obtenerAddress(pastedData);
  };
  const reload = async () => {
    if (cbor != "") {
      obtenerAddress(cbor);
    } else {
      setMessage("Paste the CBOR code");
      setMessageType("error");
    }
  };
  const obtenerAddress = async (cborParameter: string) => {
    const encoded = applyCborEncoding(cborParameter);

    const script: PlutusScript = {
      version: "V3",
      code: encoded,
    };

    const scriptAddr = resolvePlutusScriptAddress(script, 0);
    const UTxOs = await blockchainProvider.fetchAddressUTxOs(scriptAddr);
    const utxosFiltered = UTxOs.filter(
      (utxo) =>
        !blackList.includes(utxo.input.txHash + ":" + utxo.input.outputIndex),
    );

    setAddress(scriptAddr);
    setScriptUTxOs(utxosFiltered);
    setCborEncoded(encoded);
    setCbor(cborParameter);
  };

  return (
    <div className="flex flex-col items-center w-full bg-gray-900 min-h-screen">
      <div className="w-full bg-gray-800 flex flex-col items-center py-4 px-4">
        <div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-4 w-full">
          <p className="text-sm font-bold text-center text-white mb-2">
            {scriptAddress !== ""
              ? scriptAddress
              : "Write the code below to get the address"}
          </p>
          <div className="flex flex-col space-y-2">
            <textarea
              className="w-full bg-[#2c2c2c] text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#c80e22] focus:border-transparent"
              placeholder="Write the CBOR here"
              onPaste={setCborFromTextarea}
              style={{ minHeight: "10px" }}
            />
            {message && (
              <div
                className={`relative w-full text-sm text-white mt-2 px-4 py-2 rounded border text-center ${
                  messageType === "success"
                    ? "bg-green-600 border-green-400"
                    : messageType === "error"
                      ? "bg-red-600 border-red-400"
                      : "bg-yellow-600 border-yellow-400"
                }`}
              >
                <button
                  onClick={() => {
                    setMessage(null);
                    setMessageType(null);
                  }}
                  className="absolute top-1 right-2 text-white text-lg leading-none focus:outline-none"
                >
                  ×
                </button>
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between w-full p-4 space-x-4">
          <div className="flex flex-col w-1/2 p-4 space-y-4">
            <div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-4">
              <p className="text-sm font-bold text-center text-white mb-2">
                Lock ADAs
              </p>
              <div className="flex flex-col space-y-6">
                <input
                  type="text"
                  placeholder="Ada"
                  className="border border-gray-300 rounded px-3 py-1 bg-transparent text-white"
                  onChange={(e) => setAdaFromInput(e.target.value)}
                />
                {error && <span className="text-red-500 text-sm">{error}</span>}

                <input
                  type="text"
                  placeholder="Datum"
                  className="border border-gray-300 rounded px-3 py-1 bg-transparent text-white"
                  onChange={(e) => setDatumFromInput(e.target.value)}
                />
                <button
                  disabled={!connected}
                  className="bg-[#c80e22] text-white font-semibold py-1 px-3 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={lock}
                >
                  Lock ADAs
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-4 w-1/2">
            <p className="text-sm font-bold text-center text-white mb-4">
              {scriptAddress !== ""
                ? "UTxOs in " + scriptAddress
                : "Update or paste the CBOR to see the address"}
            </p>
            <button
              className="bg-[#c80e22] text-white font-semibold py-1 px-3 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={reload}
            >
              Reload
            </button>
            <div className="list space-y-2 mt-4">
              {scriptUTxOs.map((item) => (
                <button
                  key={item.input.txHash + "#" + item.input.outputIndex}
                  className="list-item bg-white text-black rounded-lg p-2 text-center"
                  onClick={() =>
                    unlock(item.input.txHash, item.input.outputIndex)
                  }
                  disabled={!connected}
                >
                  {item.output.amount.map((asset) =>
                    asset.unit === "lovelace"
                      ? `Spend ${asset.quantity} lovelaces ${
                          item.output.plutusData
                            ? JSON.stringify(
                                deserializeDatum(item.output.plutusData),
                                (_key, value) =>
                                  typeof value === "bigint"
                                    ? value.toString()
                                    : value,
                              )
                            : "No data"
                        }`
                      : "",
                  )}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Redeemer"
              className="border border-gray-300 rounded px-3 py-1 pl-32 bg-transparent relative w-full text-white caret-white mt-4"
              onChange={(e) => setRedeemerFromInput(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customized;
