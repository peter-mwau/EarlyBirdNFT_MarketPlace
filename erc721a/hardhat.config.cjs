require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const dotenv = require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/A3Q5Sr76obMkjVPalL6jYzE8fvgunRay",
      accounts: ["28d5ee39126d786720cfd6b9d0e021cdd1856a401bc46da5b2ce9a0ad5bd60f3"]
    }
  },
  etherscan: {
    apiKey: "4JYH48PB2QHD8I9DHTG12VC73NDZER2KBS"
  },
  paths: {
    artifacts: "./src/artifacts",
  }
};
