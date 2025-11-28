// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PropertyNFT.sol";

/**
 * @title PropertyMarketplace
 * @dev Marketplace for trading property NFT shares
 */
contract PropertyMarketplace is Ownable, ReentrancyGuard, Pausable {
    PropertyNFT public propertyNFT;
    uint256 public marketplaceFeePercent = 250; // 2.5% = 250 basis points
    
    uint256 private listingIdCounter;
    uint256 private offerIdCounter;
    
    struct Listing {
        address seller;
        uint256 propertyTokenId;
        uint256 pricePerShare;
        uint256 sharesAvailable;
        address paymentToken; // address(0) for native token
        bool isActive;
        uint256 timestamp;
    }
    
    struct Offer {
        address buyer;
        uint256 listingId;
        uint256 shares;
        uint256 pricePerShare;
        uint256 expirationTime;
        bool isAccepted;
    }
    
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Offer) public offers;
    mapping(address => uint256) public accumulatedFees;
    mapping(address => uint256[]) public userListings;
    mapping(address => uint256[]) public userOffers;
    
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 indexed propertyTokenId,
        uint256 pricePerShare,
        uint256 sharesAvailable
    );
    
    event ListingCancelled(uint256 indexed listingId);
    event ListingUpdated(uint256 indexed listingId, uint256 pricePerShare, uint256 sharesAvailable);
    event OfferMade(
        uint256 indexed offerId,
        address indexed buyer,
        uint256 indexed listingId,
        uint256 shares,
        uint256 pricePerShare
    );
    event OfferAccepted(uint256 indexed offerId, uint256 indexed listingId);
    event OfferCancelled(uint256 indexed offerId);
    event SharesPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 shares,
        uint256 pricePerShare
    );
    
    constructor() Ownable(msg.sender) {}
    
    function setPropertyNFT(address _propertyNFT) public onlyOwner {
        propertyNFT = PropertyNFT(_propertyNFT);
    }
    
    function createListing(
        uint256 propertyTokenId,
        uint256 pricePerShare,
        uint256 sharesAvailable,
        address paymentToken
    ) public nonReentrant whenNotPaused returns (uint256) {
        PropertyNFT.Property memory property = propertyNFT.getProperty(propertyTokenId);
        require(property.owner == msg.sender, "Only property owner can list");
        require(sharesAvailable <= property.availableShares, "Insufficient shares available");
        
        listingIdCounter++;
        uint256 listingId = listingIdCounter;
        
        listings[listingId] = Listing({
            seller: msg.sender,
            propertyTokenId: propertyTokenId,
            pricePerShare: pricePerShare,
            sharesAvailable: sharesAvailable,
            paymentToken: paymentToken,
            isActive: true,
            timestamp: block.timestamp
        });
        
        userListings[msg.sender].push(listingId);
        emit ListingCreated(listingId, msg.sender, propertyTokenId, pricePerShare, sharesAvailable);
        return listingId;
    }
    
    function cancelListing(uint256 listingId) public {
        require(listings[listingId].seller == msg.sender, "Only listing seller can cancel");
        listings[listingId].isActive = false;
        emit ListingCancelled(listingId);
    }
    
    function updateListing(
        uint256 listingId,
        uint256 newPricePerShare,
        uint256 newSharesAvailable
    ) public {
        require(listings[listingId].seller == msg.sender, "Only listing seller can update");
        require(listings[listingId].isActive, "Listing is not active");
        
        listings[listingId].pricePerShare = newPricePerShare;
        listings[listingId].sharesAvailable = newSharesAvailable;
        emit ListingUpdated(listingId, newPricePerShare, newSharesAvailable);
    }
    
    function makeOffer(
        uint256 listingId,
        uint256 shares,
        uint256 pricePerShare,
        uint256 expirationTime
    ) public nonReentrant whenNotPaused returns (uint256) {
        require(listings[listingId].isActive, "Listing is not active");
        require(shares <= listings[listingId].sharesAvailable, "Offer exceeds available shares");
        require(expirationTime > block.timestamp, "Invalid expiration time");
        
        offerIdCounter++;
        uint256 offerId = offerIdCounter;
        
        offers[offerId] = Offer({
            buyer: msg.sender,
            listingId: listingId,
            shares: shares,
            pricePerShare: pricePerShare,
            expirationTime: expirationTime,
            isAccepted: false
        });
        
        userOffers[msg.sender].push(offerId);
        emit OfferMade(offerId, msg.sender, listingId, shares, pricePerShare);
        return offerId;
    }
    
    function acceptOffer(uint256 offerId) public nonReentrant {
        Offer storage offer = offers[offerId];
        Listing storage listing = listings[offer.listingId];
        
        require(listing.seller == msg.sender, "Only listing seller can accept offer");
        require(listing.isActive, "Listing is not active");
        require(!offer.isAccepted, "Offer already accepted");
        require(block.timestamp < offer.expirationTime, "Offer has expired");
        
        _executeShareTransfer(
            offer.buyer,
            listing.seller,
            offer.listingId,
            offer.shares,
            offer.pricePerShare,
            listing.paymentToken
        );
        
        offer.isAccepted = true;
        listing.sharesAvailable -= offer.shares;
        
        if (listing.sharesAvailable == 0) {
            listing.isActive = false;
        }
        
        emit OfferAccepted(offerId, offer.listingId);
    }
    
    function cancelOffer(uint256 offerId) public {
        require(offers[offerId].buyer == msg.sender, "Only offer buyer can cancel");
        delete offers[offerId];
        emit OfferCancelled(offerId);
    }
    
    function buyShares(uint256 listingId, uint256 shares) public payable nonReentrant whenNotPaused {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(shares <= listing.sharesAvailable, "Insufficient shares available in listing");
        
        _executeShareTransfer(
            msg.sender,
            listing.seller,
            listingId,
            shares,
            listing.pricePerShare,
            listing.paymentToken
        );
        
        listing.sharesAvailable -= shares;
        if (listing.sharesAvailable == 0) {
            listing.isActive = false;
        }
        
        emit SharesPurchased(listingId, msg.sender, shares, listing.pricePerShare);
    }
    
    function _executeShareTransfer(
        address buyer,
        address seller,
        uint256 listingId,
        uint256 shares,
        uint256 pricePerShare,
        address paymentToken
    ) internal {
        uint256 totalPrice = shares * pricePerShare;
        uint256 fee = (totalPrice * marketplaceFeePercent) / 10000;
        uint256 sellerAmount = totalPrice - fee;
        
        if (paymentToken == address(0)) {
            require(msg.value >= totalPrice, "Insufficient payment");
            payable(seller).transfer(sellerAmount);
            accumulatedFees[address(0)] += fee;
            
            if (msg.value > totalPrice) {
                payable(buyer).transfer(msg.value - totalPrice);
            }
        } else {
            IERC20 token = IERC20(paymentToken);
            require(token.transferFrom(buyer, seller, sellerAmount), "Payment transfer failed");
            require(token.transferFrom(buyer, address(this), fee), "Fee transfer failed");
            accumulatedFees[paymentToken] += fee;
        }
        
        Listing memory listing = listings[listingId];
        propertyNFT.transferShares(listing.propertyTokenId, buyer, shares);
    }
    
    function withdrawFees(address paymentToken) public onlyOwner {
        uint256 amount = accumulatedFees[paymentToken];
        require(amount > 0, "No fees to withdraw");
        
        accumulatedFees[paymentToken] = 0;
        
        if (paymentToken == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(paymentToken).transfer(owner(), amount);
        }
    }
    
    function getListing(uint256 listingId) public view returns (Listing memory) {
        return listings[listingId];
    }
    
    function getOffer(uint256 offerId) public view returns (Offer memory) {
        return offers[offerId];
    }
    
    function getUserListings(address user) public view returns (uint256[] memory) {
        return userListings[user];
    }
    
    function getUserOffers(address user) public view returns (uint256[] memory) {
        return userOffers[user];
    }
    
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
}
