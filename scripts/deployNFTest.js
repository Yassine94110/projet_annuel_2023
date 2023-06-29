const hre = require("hardhat");

async function main() {
  const NFTest = await hre.ethers.deployContract("NFTest");
  const nFTest = await NFTest.waitForDeployment();
  console.log("l'adresse du NFTest", nFTest.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});