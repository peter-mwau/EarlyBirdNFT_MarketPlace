require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

const dotenv = require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/A3Q5Sr76obMkjVPalL6jYzE8fvgunRay",
      accounts: ["9c291559b0e3a77cdb5dedfce4d2cce8fe2abe84c5fb527070b4542c1c5d99d7"]
    }
  },
  etherscan: {
    apiKey: "4JYH48PB2QHD8I9DHTG12VC73NDZER2KBS"
  }
};
