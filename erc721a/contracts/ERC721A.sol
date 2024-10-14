//SPDX-License-Identifier:MIT

pragma solidity ^0.8.24;

import { ERC721A } from "../External Contracts/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 

contract EarlyBirdNFT is ERC721A {
    // Maximum supply of NFTs
    uint256 public constant MAX_SUPPLY = 1000;
    // Price for each NFT
    uint256 public constant MINT_RATE = 0.0001 ether;
    // Maximum NFTs minted in a single transaction
    uint256 public constant MAX_MINT = 5;
    // Maximum NFTs a wallet can hold
    uint256 public constant MAX_MINT_PER_WALLET = 12;
    // Refund period
    uint256 public constant REFUND_PERIOD = 3 minutes;

    // Owner of the contract
    address public owner;

    // Base Token URI for metadata
    string public baseTokenURI;

    // Modifier to restrict access to contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner!");
        _;
    }

    // Mapping to track mints and the mint timestamp
    mapping(address => uint256) public mintedAddresses;
    mapping(address => uint256) public mintingTimestamp;

    // Events to log minting, withdrawals, and refunds
    event MintSuccess(address indexed _to, uint256 indexed _value);
    event WithdrawSuccess(address indexed _to, uint256 indexed _amount);
    event RefundSuccess(address indexed _to, uint256 indexed _value);

    // Constructor to set initial values
    constructor(string memory _tokenURI) ERC721A("Early Bird", "ERB") {
        owner = msg.sender;
        baseTokenURI = _tokenURI;
    }

    // Function to mint new NFTs
    function mint(uint256 _quantity) external payable returns (bool) {
        require(_quantity + totalSupply() <= MAX_SUPPLY, "Exceeds max supply");
        require(_quantity <= MAX_MINT, "Exceeds max mint per transaction");
        require(msg.value >= _quantity * MINT_RATE, "Insufficient funds");
        require(balanceOf(msg.sender) + _quantity <= MAX_MINT_PER_WALLET, "Exceeds max mint per wallet");

        _safeMint(msg.sender, _quantity);

        mintedAddresses[msg.sender] += _quantity;
        mintingTimestamp[msg.sender] = block.timestamp;

        emit MintSuccess(msg.sender, _quantity);
        return true;
    }

    // Function for contract owner to withdraw balance
    function withdraw() external onlyOwner returns (bool) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        require(block.timestamp > _getMaxMintTime() + REFUND_PERIOD, "Refund period not over");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit WithdrawSuccess(owner, balance);
        return true;
    }

    // Refund function allowing users to burn NFTs and get refunded
    function refund(uint256 quantity) external returns (bool) {
        require(quantity <= balanceOf(msg.sender), "Invalid quantity");
        require(block.timestamp < mintingTimestamp[msg.sender] + REFUND_PERIOD, "Refund period has expired");

        _burnMultiple(msg.sender, quantity);

        uint256 refundAmount = quantity * MINT_RATE;
        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RefundSuccess(msg.sender, refundAmount);
        return true;
    }

    // Internal function to burn multiple NFTs
    function _burnMultiple(address user, uint256 quantity) internal {
        uint256 burnedCount = 0;
        uint256 tokenId = _startTokenId();

        while (burnedCount < quantity && tokenId < totalSupply()) {
            if (ownerOf(tokenId) == user) {
                _burn(tokenId);
                burnedCount++;
            }
            tokenId++;
        }
    }

    // Private helper function to get the most recent mint timestamp
    function _getMaxMintTime() private view returns (uint256) {
        uint256 maxTime = 0;
        for (uint256 i = 0; i < totalSupply(); i++) {
            address nftOwner = ownerOf(i);
            if (mintingTimestamp[nftOwner] > maxTime) {
                maxTime = mintingTimestamp[nftOwner];
            }
        }
        return maxTime;
    }

    // Override the base URI function for metadata
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    // Function to update the base URI
    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }
}
