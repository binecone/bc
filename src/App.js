import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Web3 from "web3";
import logo from "./logo.png";
import "./App.css";
// import { Web3Storage } from "web3.storage";
// JSON containing ABI and Bytecode of compiled smart contracts
import contractJson from "./artifacts/contracts/Binecone.sol/Binecone.json";

function App() {
  const [mmStatus, setMmStatus] = useState("Not connected!");
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState(undefined);
  const [displayMessage, setDisplayMessage] = useState("");
  const [web3, setWeb3] = useState(undefined);
  const [getNetwork, setGetNetwork] = useState(undefined);
  const [contracts, setContracts] = useState(undefined);
  const [contractAddress, setContractAddress] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [txnHash, setTxnHash] = useState(null);

  const tf = require('@tensorflow/tfjs');
  const words = ['I', 'am', 'a', 'developer'];

  useEffect(() => {
    (async () => {
      // Define web3
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
      // get networkId
      const networkId = await web3.eth.getChainId();
      setGetNetwork(networkId);
      // INSERT deployed smart contract address
      const contract = "0xeA35767250a94B22aB54a3D9f9b04F3A28FBd939";
      setContractAddress(contract);
      // Instantiate smart contract instance
      const Binecone = new web3.eth.Contract(contractJson.abi, contract);
      setContracts(Binecone);
      // Set provider
      Binecone.setProvider(window.ethereum);
    })();
  }, []);

  // Connect to Metamask wallet
  async function connectWallet() {
    // Check Metamask status
    if (window.ethereum) {
      setMmStatus("✅ Metamask detected!");
      try {
        // Metamask popup will appear to connect the account
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // Get address of the account
        setAccountAddress(accounts[0]);
        setIsConnected(!isConnected);
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      setMmStatus("⚠️ No wallet detected! Please install Metamask.");
    }
  }

  // Read message from smart contract
  async function receive() {
    // Display message
    var displayMessage = await contracts.methods.read().call();
    setDisplayMessage(displayMessage);
  }

  // Write message to smart contract
  async function send() {
    // Get input value of message
    var getMessage = document.getElementById("message").value;
    setLoading(true);


    const wordIndices = words.reduce((acc, word, index) => {
      acc[word] = index;
      return acc;
    }, {});

    const embeddingLayer = tf.layers.embedding({
      inputDim: words.length,
      outputDim: 10,
    });
    
    const messageIndex = tf.tensor1d([wordIndices[getMessage]], 'int32');
    const messageEmbedding = embeddingLayer.apply(messageIndex);

    // 텐서를 JavaScript 배열로 변환합니다.
    const embeddingArray = messageEmbedding.arraySync();

    // 배열을 사용하여 원하는 형식의 객체를 생성합니다.
    const output = {
      id: getMessage,
      values: embeddingArray[0]
    };

    // 객체를 JSON 문자열로 변환합니다.
    const outputJson = JSON.stringify(output);

    console.log(outputJson);
    
    // Send message to smart contract
    await contracts.methods
      .write(outputJson)
      .send({ from: accountAddress })
      .on("transactionHash", function (hash) {
        setTxnHash(hash);
      });
    setLoading(false);
  }

  return (
    <div className="App">
      {/* Metamask status */}
      <div className="text-center">
        {getNetwork != "3141"
          ? "Filecoin FVM Calibration network."
          : mmStatus}
      </div>
      <hr />
      <h1 className="text-center text-4xl font-bold mt-8">
      🍃 Binecone 🌿
      </h1>
      {/* Connect to Metamask */}
      <center>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-8 mb-6"
          onClick={connectWallet}
        >
          Connect wallet
        </button>
      </center>
      {/* Show account address */}
      <div className="text-center text-sm">{accountAddress}</div>
      {/* Send message */}
      <center className="mt-12">
        <input
          type={"text"}
          placeholder={"Input data"}
          id="message"
          className="w-60 bg-white rounded border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-white focus:border-indigo-500 text-base outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        <button
          className="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ml-3"
          onClick={isConnected && send}
        >
          Store
        </button>
        {/* Receive message */}
        <button
          className="text-center  bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded ml-3"
          onClick={isConnected && receive}
        >
          Search
        </button>
      </center>
      <p className="text-center text-sm mt-6">
        {loading == true ? (
          <>
            Upserting data to Vector database...
            <p className="mt-4 text-xs ">
              Txn hash:{" "}
              <a
                className="text-blue-500"
                href={"https://calibration.filfox.info/en/tx/" + txnHash}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txnHash}
              </a>
            </p>
            <p className="mt-2 text-xs">
              Please wait till the transaction is completed...
            </p>
          </>
        ) : (
          ""
        )}
      </p>
      {/* Display message */}
      <div className="text-center text-3xl mt-10">
        <b>{displayMessage}</b>
      </div>
      {/* Footer FVM content */}
      <footer className="footer">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p className="mt-4 text-xs sm:text-sm text-black">
          Learn more about Binecone {""}
          <a
            className="text-blue-500 no-underline hover:underline hover:text-blue-400"
            href="https://binecone.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
