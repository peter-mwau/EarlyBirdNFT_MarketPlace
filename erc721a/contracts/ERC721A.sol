//SPDX-License-Identifier:MIT

pragma solidity ^0.8.24;

import { ERC721A } from "../External Contracts/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 

contract EarlyBirdNFT is ERC721A {
    //max_supply
    uint256 public constant MAX_SUPPLY = 1000;
    //mint rate or nft price
    uint256 public constant MINT_RATE = 0.01 ether;
    //max mint per time
    uint256 public constant MAX_MINT = 5;
    //max mint per wallet
    uint256 public constant MAX_MINT_PER_WALLET = 12;
    //refund period
    uint256 public constant REFUND_PERIOD = 3 minutes;

    address public owner;

    // Token URI
    string public baseTokenURI;
    // bool public revealed = false;

    //onlyowner modifier
    modifier onlyOwner(){
        require(msg.sender == owner, "You are not the owner!!");
        _;
    }

    //mapping to track mint addresses and tokens
    mapping(address => uint256) public mintedAddresses;

    //mapping to track the mintingtime
    mapping(address => uint256) public mintingTimestamp;

    //capture success mint event
    event MintSuccess(address indexed _to, uint256 indexed _value);

    //event to capture successful withdrawal
    event WithdrawSuccess(address indexed _to, uint256 indexed _amount);

    //event to capture successful refund
    event RefundSuccess(address indexed _to, uint256 indexed _valut);

    //constructor
    constructor(string memory _tokenURI) ERC721A("Early Bird", "ERB"){
        owner = msg.sender;
        baseTokenURI = _tokenURI;
    }

    //function to mint NFT token
    function mint(uint256 _quantity) external payable returns(bool){
        require(_quantity + totalSupply() <= MAX_SUPPLY, "Amount too much, exceedes max supply");
        require(_quantity <= MAX_MINT, "Mint limit exceeded");
        require(msg.value >= _quantity * MINT_RATE, "Insufficient balance");
        require(balanceOf(msg.sender) + _quantity <= MAX_MINT_PER_WALLET, "Sorry you have reached your max mint limit!!");

        _safeMint(msg.sender, _quantity);

        mintedAddresses[msg.sender] = _quantity;
        mintingTimestamp[msg.sender] = block.timestamp;

        emit MintSuccess(msg.sender, _quantity);

        return true;
    }

    //withdraw function
    function withdraw() external onlyOwner payable returns(bool){
        uint256 balance = address(this).balance;
        require(balance > 0, "No NFTs minted, so no balance to withdraw!!");
        require(block.timestamp < _getMaxMintTime() + REFUND_PERIOD, "Refund period not yet over!");


        (bool success, ) = payable(owner).call{value: balance}('');

        require(success, "Withdrawal failed!!");

        emit WithdrawSuccess(owner, balance);

        return true;
    }

    //refund function
    function refund(uint256 quantity) external returns(bool){
        require(quantity <= balanceOf(msg.sender), "Invalid quantity");
        require(block.timestamp < mintingTimestamp[msg.sender], "Refund period has already lapsed!!");

        //burnMultiple function
        _burnMultiple(msg.sender, quantity);

        uint256 amount = quantity * MINT_RATE;

        (bool success, ) = payable(msg.sender).call{ value: amount}('');

        require(success, "Refund failed!!");

        emit RefundSuccess(msg.sender, quantity);

        return true;
    }

    // Internal function to burn multiple tokens
    function _burnMultiple(address user, uint256 quantity) internal {
        uint256 tokenId = _startTokenId();  // Start from the first token ID in ERC721A

        uint256 burnedCount = 0;
        while (burnedCount < quantity && tokenId < totalSupply()) {
            if (ownerOf(tokenId) == user) {
                _burn(tokenId);
                burnedCount++;
            }
            tokenId++;
        }
    }

    // Private helper to get the latest minting timestamp
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

     // Override the tokenURI function to add conceal and reveal logic
    // function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    //     require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    //     if (!revealed) {
    //         return baseTokenURI;  // Return the concealed URI before reveal
    //     }

    //     // After reveal, return the token-specific URI
    //     return string(abi.encodePacked(baseTokenURI, "/", tokenId.toString(), ".json"));
    // }

    // // Reveal function
    // function reveal(string memory _revealedBaseURI) external onlyOwner {
    //     baseTokenURI = _revealedBaseURI;
    //     revealed = true;
    // }

    // Base URI override
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    // function to set new base URI
    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

}