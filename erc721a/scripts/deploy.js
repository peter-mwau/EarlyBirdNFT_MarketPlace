import hre from "hardhat";

async function main() {
    const ERC721A = await hre.ethers.getContractFactory("EarlyBirdNFT");

    const tokenURI = "https://example.com/metadata/";

    const erc721a = await ERC721A.deploy(tokenURI);
  
    await erc721a.deployed();
  
    console.log("ERC721A deployed to:", erc721a.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  