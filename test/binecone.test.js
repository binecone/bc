const { expect } = require("chai");
const hre = require("hardhat");

describe("Binecone", function () {
  let binecone;

  beforeEach(async () => {
    binecone = await hre.ethers.getContractFactory("Binecone");
  });

  it("Should return the initial message", async () => {
    const result = await binecone.read();
    expect(result).equal("Binecone, testing!");
  });

  it("Should be able to change the message", async () => {
    await binecone.write("Binecone, changed!");
    const result = await binecone.read();
    expect(result).equal("Binecone, chnaged!");
  });
});
