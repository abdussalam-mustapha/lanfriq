// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title PropertyNFT
 * @dev ERC721 token representing tokenized real estate properties on Camp Network
 */
contract PropertyNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, Pausable {
    uint256 private _tokenIdCounter;
    
    struct Property {
        address owner;
        string propertyAddress;
        uint256 valuation;
        uint256 totalShares;
        uint256 availableShares;
        uint256 pricePerShare;
        bool isVerified;
        bytes32 verificationHash;
    }
    
    mapping(uint256 => Property) private _properties;
    
    event PropertyMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string propertyAddress,
        uint256 valuation
    );
    
    event PropertyVerified(uint256 indexed tokenId, bytes32 verificationHash);
    event SharesUpdated(uint256 indexed tokenId, uint256 availableShares);
    event PropertySold(uint256 indexed tokenId, address from, address to, uint256 shares);
    
    constructor() ERC721("Lanfriq Property NFT", "LPNFT") Ownable(msg.sender) {}
    
    function mintProperty(
        address to,
        string memory propertyAddress,
        uint256 valuation,
        uint256 totalShares,
        uint256 pricePerShare,
        string memory uri
    ) public whenNotPaused returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(valuation > 0, "Valuation must be greater than 0");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        _properties[tokenId] = Property({
            owner: to,
            propertyAddress: propertyAddress,
            valuation: valuation,
            totalShares: totalShares,
            availableShares: totalShares,
            pricePerShare: pricePerShare,
            isVerified: false,
            verificationHash: bytes32(0)
        });
        
        emit PropertyMinted(tokenId, to, propertyAddress, valuation);
        return tokenId;
    }
    
    function verifyProperty(uint256 tokenId, bytes32 verificationHash) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "PropertyNFT: Property does not exist");
        _properties[tokenId].isVerified = true;
        _properties[tokenId].verificationHash = verificationHash;
        emit PropertyVerified(tokenId, verificationHash);
    }
    
    function updateShares(uint256 tokenId, uint256 newAvailableShares) public {
        require(_ownerOf(tokenId) != address(0), "PropertyNFT: Property does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only property owner can update shares");
        require(newAvailableShares <= _properties[tokenId].totalShares, "Cannot exceed total shares");
        
        _properties[tokenId].availableShares = newAvailableShares;
        emit SharesUpdated(tokenId, newAvailableShares);
    }
    
    function transferShares(
        uint256 tokenId,
        address to,
        uint256 shares
    ) public {
        require(_ownerOf(tokenId) != address(0), "PropertyNFT: Property does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only property owner can transfer shares");
        require(shares <= _properties[tokenId].availableShares, "Insufficient shares available");
        
        _properties[tokenId].availableShares -= shares;
        emit PropertySold(tokenId, msg.sender, to, shares);
    }
    
    function getProperty(uint256 tokenId) public view returns (Property memory) {
        require(_ownerOf(tokenId) != address(0), "PropertyNFT: Property does not exist");
        return _properties[tokenId];
    }
    
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
