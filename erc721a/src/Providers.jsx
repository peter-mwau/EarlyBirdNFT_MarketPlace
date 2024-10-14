import { useState, useEffect, useMemo } from "react";
import WalletContext from "../src/contexts/WalletContext";
import Web3 from "web3";
import PropTypes from "prop-types";
import EarlyBirdNFT from "./artifacts/contracts/ERC721A.sol/EarlyBirdNFT.json";

export default function Providers({ children }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [web3, setWeb3] = useState(null);  // Add web3 to state

  const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;
  const contractABI = EarlyBirdNFT.abi;

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const web3Instance = new Web3(window.ethereum);  // Create a Web3 instance
        setWeb3(web3Instance);  // Set Web3 instance to state

        const weiBalance = await web3Instance.eth.getBalance(accounts[0]);
        const balance = web3Instance.utils.fromWei(weiBalance, "ether");
        setBalance(balance);
        setAccount(accounts[0]);
        setIsWalletConnected(true);

        // Fetch custom token balance
        const tokenContract = new web3Instance.eth.Contract(
          contractABI,
          contractAddress
        );
        const tokenBalanceRaw = await tokenContract.methods
          .balanceOf(accounts[0])
          .call();
        console.log("Raw Token Balance: ", tokenBalanceRaw);

        const tokenDecimalsRaw  = await tokenContract.methods.decimals().call();
        console.log("Token Decimals: ", tokenDecimalsRaw );

        const tokenDecimals = Number(tokenDecimalsRaw);
        const divisor = BigInt(10 ** tokenDecimals);
        const formattedTokenBalance = Number(tokenBalanceRaw) / Number(divisor);
        setTokenBalance(formattedTokenBalance);

      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  useEffect(() => {
    console.log(
      "Account: ",
      account,
      "Balance: ",
      balance,
      "Token Balance: ",
      tokenBalance,
      "Connection Status: ",
      isWalletConnected
    );
  }, [account, balance, tokenBalance, isWalletConnected]);

  const disconnectWallet = () => {
    setAccount(null);
    setIsWalletConnected(false);
  };

  const walletContextValue = useMemo(
    () => ({
      account,
      balance,
      tokenBalance,
      isWalletConnected,
      connectWallet,
      disconnectWallet,
      web3,  // Expose Web3 instance to the context
    }),
    [account, balance, tokenBalance, isWalletConnected, connectWallet, disconnectWallet, web3]
  );

  return (
    <WalletContext.Provider value={walletContextValue}>
      {children}
    </WalletContext.Provider>
  );
}

Providers.propTypes = {
  children: PropTypes.node.isRequired,
};
