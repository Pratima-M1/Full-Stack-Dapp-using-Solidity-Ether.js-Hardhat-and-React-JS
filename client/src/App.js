import "./App.css";
import Buy from "./components/Buy.js";
import Memos from "./components/Memos.js";
import abi from "./contracts/chai.json";
import { useState, useEffect } from "react";
const { ethers } = require("ethers");
//import { ethers } from "ethers";
function App() {
  const [state, setState] = useState({
    provide: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("None");
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0xe04f6F8cFc4B7C5fF4D82D06C3ab554F3f9f9084";
      const contractAbi = abi.abi;
      try {
        const { ethereum } = window;
        console.log(window.ethereum);
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const account = accounts[0];

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  console.log(state);
  return (
    <div style={{ backgroundColor: "#EFEFEF", height: "100%" }}>
      <p
        class="text-muted lead "
        style={{ marginTop: "10px", marginLeft: "5px" }}
      >
        <small>Connected Account - {account}</small>
      </p>
      <div className="container">
        <Buy state={state} />
        <Memos state={state} />
      </div>
    </div>
  );
}

export default App;
