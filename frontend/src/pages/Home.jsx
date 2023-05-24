import React, { useState, useEffect, useRef } from "react";
import styles from "./home.module.css";
import { ethers } from "ethers";
import { abi, address } from "./constant";

const Home = ({ walletConnected, connectWallet, signer }) => {
  const [contract, setContract] = useState();
  const [tokenIdsMinted, setTokenIdMinted] = useState();
  const [loading, setLoading] = useState();
  const [url, setUrl] = useState();
  const userBalance = useRef(0);

  useEffect(() => {
    const getContract = async () => {
      const contract = await new ethers.Contract(address, abi, signer);
      setContract(contract);
    };

    getContract();
  }, [signer]);

  useEffect(() => {
    const interval = setInterval(() => {
      getTokenMined();
    }, 500);

    return () => clearInterval(interval);
  }, [contract]);

  const getTokenMined = async () => {
    try {
      const tokens = await contract.tokenIds();
      setTokenIdMinted(tokens.toString());
      // console.log("inside this tokens", tokens);
      getURL();
    } catch (e) {
      console.log("inside this e", e);
    }
  };

  const mintToken = async () => {
    try {
      const tx = await contract.mint({ value: ethers.parseEther("0.1") });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("You successfully minted a LW3Punk!");
    } catch (e) {
      console.log("inside this error", e);
    }
  };

  const getURL = async () => {
    try {
      const balance = await contract.balanceOf(signer.address);

      if (userBalance.current == balance) {
        return;
      }

      userBalance.current = balance;
      console.log("balance", balance, userBalance);
      //https://ipfs.io/ipfs/QmQBHarz2WFczTjz5GnhjHrbUPDnB48W5BM2v2h6HbE1rZ/1.png

      if (balance > 0) {
        const tokenId = await contract.tokenByIndex(parseInt(balance) - 1);
        const url = await contract.tokenURI(tokenId);

        if (url) {
          try {
            const second = url.split("//")[1];
            const res = await fetch(`https://ipfs.io/ipfs/${second}`);

            const data = await res.json();

            if (data) {
              const second = data.image.split("//")[1];
              const url = `https://ipfs.io/ipfs/${second}`;
              setUrl(url);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    } catch (e) {
      console.log("error is", e);
    }
  };

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wallet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    return (
      <button className={styles.button} onClick={mintToken}>
        Public Mint 🚀
      </button>
    );
  };
  return (
    <div>
      <header>
        <title>LW3Punks</title>
        <meta name="description" content="LW3Punks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </header>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to LW3Punks!</h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            It&#39;s an NFT collection for LearnWeb3 students.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/10 have been minted
          </div>
          <img className={styles.image} src={url} alt="imageFor" />
          {renderButton()}
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by LW3Punks</footer>
    </div>
  );
};

export default Home;
