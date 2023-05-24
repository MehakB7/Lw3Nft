import "./App.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
export const provider = new ethers.BrowserProvider(window.ethereum);
function App() {
  const [, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [isWalletConnected, setConnected] = useState(false);

  async function getAccounts() {
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    setAccount(accounts[0]);
    setSigner(signer);
    setConnected(true);
  }

  useEffect(() => {
    getAccounts();
  }, []);

  const connectWallet = async () => {
    getAccounts();
  };
  if (!signer) {
    return;
  }
  return (
    <div className="App">
      <Home
        connectWallet={connectWallet}
        walletConnected={isWalletConnected}
        signer={signer}
      />
    </div>
  );
}

export default App;
