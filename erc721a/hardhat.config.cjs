const dotenv = require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: process.env.VITE_APP_SEPOLIA_RPC_URL,
      accounts: [process.env.VITE_APP_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.VITE_APP_ETHERSCAN_API_KEY
  }
};
