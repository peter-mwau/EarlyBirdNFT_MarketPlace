import { useState, useEffect, useContext } from "react";
import WalletContext from "../contexts/WalletContext";
import EarlyBirdNFT from "../artifacts/contracts/ERC721A.sol/EarlyBirdNFT.json";

const Home = () => {
  const [amount, setAmount] = useState(1);
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [success, setSuccess] = useState('');

  const { account, isWalletConnected, connectWallet, web3 } = useContext(WalletContext);

  const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;
  const contractABI = EarlyBirdNFT.abi;

  useEffect(() => {
    if (account && isWalletConnected && web3) {
      const contractInstance = new web3.eth.Contract(contractABI, contractAddress, {
        from: account,
      });
      setContract(contractInstance);

      const fetchTotalSupply = async () => {
        try {
          const totalSupply = await contractInstance.methods.totalSupply().call();
          setTotalSupply(totalSupply);
        } catch (error) {
          console.error("Error fetching total supply:", error);
        }
      };

      fetchTotalSupply();
    }
  }, [isWalletConnected, web3]);

  const handleMint = async () => {
    if (!isWalletConnected || !account) {
      connectWallet();
      return;
    }

    try {
      const tx = await contract.methods.mint(account, amount).send({
        value: web3.utils.toWei((0.01 * amount).toString(), "ether"),
      });
      setSuccess("Minting successful!");
      console.log("Transaction Hash: ", tx);

      const newTotalSupply = await contract.methods.totalSupply().call();
      setTotalSupply(newTotalSupply);
    } catch (error) {
      console.error("Minting error:", error);
      // alert("There was an error with the minting process.");
    }
  };

  // Increment and decrement amount
  const handleIncrement = () => {
    setAmount(amount + 1);
  };

  const handleDecrement = () => {
    if (amount >= 2) {
      setAmount(amount - 1);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-t from-gray-900 to-gray-700 dark:bg-gradient-to-t dark:from-slate-800 dark:to-blue-900 pt-[140px] transition-all duration-1000">
        <h1 className="text-4xl text-center font-bold italic text-white neon-effect mb-10">
          Early Bird NFT Marketplace
        </h1>
        <div className="flex flex-col items-center justify-center">
          {success && <div className="text-center py-2 text-green-500 font-semibold">{success}</div>}
          <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-2xl max-w-md">
            <img
              src="/EarlyBirdNFT.jpg"
              alt="random"
              className="w-96 h-96 object-cover rounded-lg shadow-lg transition-all hover:scale-105 duration-500"
            />
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <h2 className="text-2xl font-semibold italic text-white mb-2">EarlyBird NFT</h2>
              <p className="text-sm text-gray-300 mb-4">
                Experience the mystery and allure of this limited-edition NFT. Only a few collectors will have the privilege of owning this digital art piece.
              </p>
            </div>
            <h3 className="text-lg font-semibold italic text-white mb-4">Price: 0.0001 ETH</h3>
            <div className="flex flex-row items-center justify-center mb-4">
              <button
                onClick={handleDecrement}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-l-md p-3 font-bold transition-all duration-300"
              >
                -
              </button>
              <input
                type="number"
                value={amount}
                readOnly
                className="text-center p-3 w-14 bg-gray-200 text-gray-900 font-bold"
              />
              <button
                onClick={handleIncrement}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-md p-3 font-bold transition-all duration-300"
              >
                +
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <button
                onClick={handleMint}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white dark:text-gray-950 font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 rounded-lg p-3"
              >
                Buy NFT
              </button>
            </div>
            <p className="text-gray-300 text-sm mt-4">
              Total Minted: {totalSupply}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
