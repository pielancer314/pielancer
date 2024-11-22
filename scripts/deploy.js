const hre = require("hardhat");

async function main() {
  // Set base URI for metadata
  const baseURI = "ipfs://Qmdo1zVc243HfmGnb9bb7egNer1nddk2wtwz9XxAMtpuFi/";

  const DigitalRevolution = await hre.ethers.getContractFactory("DigitalRevolution");
  const digitalRevolution = await DigitalRevolution.deploy(baseURI);

  await digitalRevolution.deployed();

  console.log("Digital Revolution NFT deployed to:", digitalRevolution.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
