const hre = require("hardhat");

async function main(){

    const EarlyBirdNFT = await ethers.getContractsFactory("EarlyBirdNFT");

    const earlybirdnft = EarlyBirdNFT.deploy();

    console.log("Contract Address: ", earlybirdnft.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
        });
    