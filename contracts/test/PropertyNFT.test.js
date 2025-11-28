const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyNFT", function () {
  let propertyNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    propertyNFT = await PropertyNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await propertyNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await propertyNFT.name()).to.equal("Lanfriq Property NFT");
      expect(await propertyNFT.symbol()).to.equal("LPNFT");
    });
  });

  describe("Minting", function () {
    it("Should mint a property NFT successfully", async function () {
      const tx = await propertyNFT.mintProperty(
        addr1.address,
        "123 Main St, City, Country",
        ethers.parseEther("500000"), // $500,000 valuation
        1000, // 1000 total shares
        ethers.parseEther("500"), // $500 per share
        "ipfs://QmTest123"
      );

      await expect(tx)
        .to.emit(propertyNFT, "PropertyMinted")
        .withArgs(1, addr1.address, "123 Main St, City, Country", ethers.parseEther("500000"));

      expect(await propertyNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await propertyNFT.tokenURI(1)).to.equal("ipfs://QmTest123");
    });

    it("Should fail when minting while paused", async function () {
      await propertyNFT.pause();
      await expect(
        propertyNFT.mintProperty(
          addr1.address,
          "123 Main St",
          ethers.parseEther("500000"),
          1000,
          ethers.parseEther("500"),
          "ipfs://QmTest123"
        )
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should increment token IDs correctly", async function () {
      await propertyNFT.mintProperty(
        addr1.address,
        "Property 1",
        ethers.parseEther("500000"),
        1000,
        ethers.parseEther("500"),
        "ipfs://QmTest1"
      );

      await propertyNFT.mintProperty(
        addr2.address,
        "Property 2",
        ethers.parseEther("750000"),
        1500,
        ethers.parseEther("500"),
        "ipfs://QmTest2"
      );

      expect(await propertyNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await propertyNFT.ownerOf(2)).to.equal(addr2.address);
    });
  });

  describe("Property Verification", function () {
    beforeEach(async function () {
      await propertyNFT.mintProperty(
        addr1.address,
        "123 Main St",
        ethers.parseEther("500000"),
        1000,
        ethers.parseEther("500"),
        "ipfs://QmTest123"
      );
    });

    it("Should verify property by owner", async function () {
      const verificationHash = ethers.keccak256(ethers.toUtf8Bytes("verification-doc-123"));
      
      await expect(propertyNFT.verifyProperty(1, verificationHash))
        .to.emit(propertyNFT, "PropertyVerified")
        .withArgs(1, verificationHash);

      const property = await propertyNFT.getProperty(1);
      expect(property.isVerified).to.be.true;
      expect(property.verificationHash).to.equal(verificationHash);
    });

    it("Should fail when non-owner tries to verify", async function () {
      const verificationHash = ethers.keccak256(ethers.toUtf8Bytes("verification-doc-123"));
      
      await expect(
        propertyNFT.connect(addr1).verifyProperty(1, verificationHash)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Share Management", function () {
    beforeEach(async function () {
      await propertyNFT.mintProperty(
        addr1.address,
        "123 Main St",
        ethers.parseEther("500000"),
        1000,
        ethers.parseEther("500"),
        "ipfs://QmTest123"
      );
    });

    it("Should update shares by property owner", async function () {
      await expect(propertyNFT.connect(addr1).updateShares(1, 500))
        .to.emit(propertyNFT, "SharesUpdated")
        .withArgs(1, 500);

      const property = await propertyNFT.getProperty(1);
      expect(property.availableShares).to.equal(500);
    });

    it("Should fail when non-owner tries to update shares", async function () {
      await expect(
        propertyNFT.connect(addr2).updateShares(1, 500)
      ).to.be.revertedWith("Only property owner can update shares");
    });

    it("Should fail when updating shares exceeds total", async function () {
      await expect(
        propertyNFT.connect(addr1).updateShares(1, 1500)
      ).to.be.revertedWith("Cannot exceed total shares");
    });
  });

  describe("Property Data Retrieval", function () {
    it("Should return correct property data", async function () {
      await propertyNFT.mintProperty(
        addr1.address,
        "123 Main St, City, Country",
        ethers.parseEther("500000"),
        1000,
        ethers.parseEther("500"),
        "ipfs://QmTest123"
      );

      const property = await propertyNFT.getProperty(1);
      expect(property.owner).to.equal(addr1.address);
      expect(property.propertyAddress).to.equal("123 Main St, City, Country");
      expect(property.valuation).to.equal(ethers.parseEther("500000"));
      expect(property.totalShares).to.equal(1000);
      expect(property.availableShares).to.equal(1000);
      expect(property.pricePerShare).to.equal(ethers.parseEther("500"));
      expect(property.isVerified).to.be.false;
    });

    it("Should fail when querying non-existent token", async function () {
      await expect(propertyNFT.getProperty(999)).to.be.revertedWith(
        "PropertyNFT: Property does not exist"
      );
    });
  });

  describe("Token Burning", function () {
    beforeEach(async function () {
      await propertyNFT.mintProperty(
        addr1.address,
        "123 Main St",
        ethers.parseEther("500000"),
        1000,
        ethers.parseEther("500"),
        "ipfs://QmTest123"
      );
    });

    it("Should allow owner to burn token", async function () {
      await propertyNFT.connect(addr1).burn(1);
      await expect(propertyNFT.ownerOf(1)).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("Should fail when non-owner tries to burn", async function () {
      await expect(propertyNFT.connect(addr2).burn(1)).to.be.revertedWith(
        "ERC721: caller is not token owner or approved"
      );
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow owner to pause and unpause", async function () {
      await propertyNFT.pause();
      expect(await propertyNFT.paused()).to.be.true;

      await propertyNFT.unpause();
      expect(await propertyNFT.paused()).to.be.false;
    });

    it("Should fail when non-owner tries to pause", async function () {
      await expect(propertyNFT.connect(addr1).pause()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
