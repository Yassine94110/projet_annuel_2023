const hre = require("hardhat");

async function main() {
  const CyasInu = await hre.ethers.deployContract("CyasInu");
  const cyasInu = await CyasInu.waitForDeployment();
  console.log("l'adresse du token CyasInu:", cyasInu.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});