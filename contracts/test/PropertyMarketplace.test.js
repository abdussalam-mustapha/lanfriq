const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyMarketplace", function () {
  let propertyNFT;
  let marketplace;
  let owner;
  let seller;
  let buyer;
  let addr3;

  beforeEach(async function () {
    [owner, seller, buyer, addr3] = await ethers.getSigners();

    // Deploy PropertyNFT
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    propertyNFT = await PropertyNFT.deploy();

    // Deploy PropertyMarketplace
    const PropertyMarketplace = await ethers.getContractFactory("PropertyMarketplace");
    marketplace = await PropertyMarketplace.deploy();
    
    // Set PropertyNFT address in marketplace
    await marketplace.setPropertyNFT(await propertyNFT.getAddress());

    // Mint a property for testing
    await propertyNFT.mintProperty(
      seller.address,
      "123 Main St",
      ethers.parseEther("500000"),
      1000,
      ethers.parseEther("500"),
      "ipfs://QmTest123"
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await marketplace.owner()).to.equal(owner.address);
    });

    it("Should have correct PropertyNFT reference", async function () {
      expect(await marketplace.propertyNFT()).to.equal(await propertyNFT.getAddress());
    });

    it("Should have correct marketplace fee", async function () {
      expect(await marketplace.marketplaceFeePercent()).to.equal(250); // 2.5%
    });
  });

  describe("Listing Creation", function () {
    it("Should create a listing successfully", async function () {
      const tx = await marketplace.connect(seller).createListing(
        1, // tokenId
        ethers.parseEther("500"), // price per share
        100, // shares available
        ethers.ZeroAddress // native payment
      );

      await expect(tx)
        .to.emit(marketplace, "ListingCreated")
        .withArgs(1, seller.address, 1, ethers.parseEther("500"), 100);

      const listing = await marketplace.getListing(1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.propertyTokenId).to.equal(1);
      expect(listing.sharesAvailable).to.equal(100);
      expect(listing.isActive).to.be.true;
    });

    it("Should fail when listing with insufficient shares", async function () {
      await expect(
        marketplace.connect(seller).createListing(
          1,
          ethers.parseEther("500"),
          2000, // more than total shares
          ethers.ZeroAddress
        )
      ).to.be.revertedWith("Insufficient shares available");
    });

    it("Should fail when paused", async function () {
      await marketplace.pause();
      await expect(
        marketplace.connect(seller).createListing(
          1,
          ethers.parseEther("500"),
          100,
          ethers.ZeroAddress
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Listing Management", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).createListing(
        1,
        ethers.parseEther("500"),
        100,
        ethers.ZeroAddress
      );
    });

    it("Should allow seller to cancel listing", async function () {
      await expect(marketplace.connect(seller).cancelListing(1))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(1);

      const listing = await marketplace.getListing(1);
      expect(listing.isActive).to.be.false;
    });

    it("Should fail when non-seller tries to cancel", async function () {
      await expect(marketplace.connect(buyer).cancelListing(1)).to.be.revertedWith(
        "Only listing seller can perform this action"
      );
    });

    it("Should allow seller to update listing", async function () {
      await expect(
        marketplace.connect(seller).updateListing(1, ethers.parseEther("600"), 50)
      )
        .to.emit(marketplace, "ListingUpdated")
        .withArgs(1, ethers.parseEther("600"), 50);

      const listing = await marketplace.getListing(1);
      expect(listing.pricePerShare).to.equal(ethers.parseEther("600"));
      expect(listing.sharesAvailable).to.equal(50);
    });
  });

  describe("Offer System", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).createListing(
        1,
        ethers.parseEther("500"),
        100,
        ethers.ZeroAddress
      );
    });

    it("Should create an offer successfully", async function () {
      const expirationTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

      await expect(
        marketplace.connect(buyer).makeOffer(
          1,
          50, // shares
          ethers.parseEther("450"), // lower price
          expirationTime
        )
      )
        .to.emit(marketplace, "OfferMade")
        .withArgs(1, buyer.address, 1, 50, ethers.parseEther("450"));

      const offer = await marketplace.getOffer(1);
      expect(offer.buyer).to.equal(buyer.address);
      expect(offer.shares).to.equal(50);
      expect(offer.pricePerShare).to.equal(ethers.parseEther("450"));
    });

    it("Should fail when offering more shares than available", async function () {
      const expirationTime = Math.floor(Date.now() / 1000) + 86400;

      await expect(
        marketplace.connect(buyer).makeOffer(
          1,
          200, // more than listed
          ethers.parseEther("500"),
          expirationTime
        )
      ).to.be.revertedWith("Offer exceeds available shares");
    });

    it("Should allow buyer to cancel offer", async function () {
      const expirationTime = Math.floor(Date.now() / 1000) + 86400;
      
      await marketplace.connect(buyer).makeOffer(
        1,
        50,
        ethers.parseEther("450"),
        expirationTime
      );

      await expect(marketplace.connect(buyer).cancelOffer(1))
        .to.emit(marketplace, "OfferCancelled")
        .withArgs(1);
    });
  });

  describe("Direct Purchase", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).createListing(
        1,
        ethers.parseEther("500"),
        100,
        ethers.ZeroAddress
      );
    });

    it("Should allow direct share purchase with native payment", async function () {
      const sharesToBuy = 10n;
      const pricePerShare = ethers.parseEther("500");
      const totalPrice = pricePerShare * sharesToBuy;
      const fee = (totalPrice * 250n) / 10000n; // 2.5% fee
      const totalWithFee = totalPrice + fee;

      await expect(
        marketplace.connect(buyer).buyShares(1, sharesToBuy, {
          value: totalWithFee,
        })
      )
        .to.emit(marketplace, "SharesPurchased")
        .withArgs(1, buyer.address, sharesToBuy, pricePerShare);

      const listing = await marketplace.getListing(1);
      expect(listing.sharesAvailable).to.equal(90); // 100 - 10
    });

    it("Should fail when buying more shares than available", async function () {
      const totalPrice = ethers.parseEther("500") * 150n;
      
      await expect(
        marketplace.connect(buyer).buyShares(1, 150, {
          value: totalPrice,
        })
      ).to.be.revertedWith("Insufficient shares available in listing");
    });

    it("Should fail when not sending enough payment", async function () {
      await expect(
        marketplace.connect(buyer).buyShares(1, 10, {
          value: ethers.parseEther("1000"), // not enough
        })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Fee Management", function () {
    beforeEach(async function () {
      await marketplace.connect(seller).createListing(
        1,
        ethers.parseEther("500"),
        100,
        ethers.ZeroAddress
      );

      // Make a purchase to accumulate fees
      const sharesToBuy = 10n;
      const totalPrice = ethers.parseEther("500") * sharesToBuy;
      const fee = (totalPrice * 250n) / 10000n;
      
      await marketplace.connect(buyer).buyShares(1, sharesToBuy, {
        value: totalPrice + fee,
      });
    });

    it("Should allow owner to withdraw accumulated fees", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await marketplace.withdrawFees(ethers.ZeroAddress);
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should fail when non-owner tries to withdraw fees", async function () {
      await expect(
        marketplace.connect(buyer).withdrawFees(ethers.ZeroAddress)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow owner to pause and unpause", async function () {
      await marketplace.pause();
      expect(await marketplace.paused()).to.be.true;

      await marketplace.unpause();
      expect(await marketplace.paused()).to.be.false;
    });

    it("Should prevent operations when paused", async function () {
      await marketplace.pause();
      
      await expect(
        marketplace.connect(seller).createListing(
          1,
          ethers.parseEther("500"),
          100,
          ethers.ZeroAddress
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });
});
