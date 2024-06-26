const hre = require("hardhat");

async function main() {
  const Binecone = await hre.ethers.getContractFactory("Binecone");

  // "HardhatError: HH303: Unrecognized task callRPC"
  // const priorityFee = await hre.run('callRPC', {
  //   method: 'eth_maxPriorityFeePerGas',
  //   params: [],
  // });

  const binecone = await Binecone.deploy({
    maxPriorityFeePerGas: 199992,
  });

  await binecone.deployed();

  console.log("Contract deployed to:", binecone.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
