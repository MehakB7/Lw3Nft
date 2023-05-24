const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deplayNft() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("LWPunk");
    const metadataURL =
      "https://ipfs.io/ipfs/Qmbygo38DWF1V8GttM1zy89KzyZTPU2FLUzQtiDvB7q6i5/";
    const contract = await Contract.deploy(metadataURL);

    return { contract, owner, otherAccount, metadataURL };
  }

  describe("Deployment", function () {
    it("it should update the baseURI", async function () {
      const { contract, owner } = await deplayNft();
      const cOwner = await contract.owner();
      expect(owner.address).to.be.equal(cOwner);
    });
  });

  describe("Minting", function () {
    it("It should Mint 1nft", async function () {
      const { contract, otherAccount, metadataURL } = await deplayNft();
      await contract
        .connect(otherAccount)
        .mint({ value: ethers.utils.parseEther("0.1") });
      const address = await contract.tokenURI(1);
      expect(address).to.be.equal(`${metadataURL}1.json`);
    });
    it("it should revert when price is low", async function () {
      const { contract, otherAccount } = await deplayNft();

      await expect(
        contract
          .connect(otherAccount)
          .mint({ value: ethers.utils.parseEther("0.001") })
      ).to.be.revertedWith("unsufficeint balance");
    });

    it("it should revert if no more token left", async function () {
      const { contract, otherAccount } = await deplayNft();
      for (let i = 0; i < 10; i++) {
        await contract
          .connect(otherAccount)
          .mint({ value: ethers.utils.parseEther("0.1") });
      }
      await expect(
        contract
          .connect(otherAccount)
          .mint({ value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("Maximum mint limit reached");
    });
  });

  describe("Withdrawals", function () {});
});
