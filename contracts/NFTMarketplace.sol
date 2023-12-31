//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    address payable private _owner;
    //owner is the contract address that created the smart contract
    address payable owner;
    uint256 listPrice = 0.01 ether;

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
        bool isOnAuction;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
    }

    struct eachNFT {
        uint256 tokenId;
        string name;
    }

    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    event AuctionStarted(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 startingPrice,
        uint256 auctionEndTime
    );

    event AuctionEnded(
        uint256 indexed tokenId,
        address owner,
        address winner,
        uint256 winningBid
    );

    event BidPlaced(uint256 indexed tokenId, address bidder, uint256 bidAmount);

    mapping(uint256 => ListedToken) private idToListedToken;
    mapping(uint256 => eachNFT) private idToNFT;
    mapping(uint256 => mapping(address => uint256)) private tokenBids;

    constructor() ERC721("BlueMarket", "BMRK") {
        _owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Only owner can perform this action");
        _;
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    function createToken(
        string memory tokenURI,
        string memory _name
    ) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, tokenURI);

        idToListedToken[newTokenId] = ListedToken(
            newTokenId,
            payable(msg.sender),
            payable(msg.sender),
            0,
            false,
            false,
            0,
            address(0),
            0
        );
        idToNFT[newTokenId] = eachNFT(newTokenId, _name);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) public payable {
        require(msg.value == listPrice, "Hopefully sending the correct price");
        require(price > 0, "Make sure the price isn't negative");

        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true,
            false,
            0,
            address(0),
            0
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        //at the moment currentlyListed is true for all, if it becomes false in the future we will
        //filter out currentlyListed == false over here
        for (uint i = 0; i < nftCount; i++) {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);

        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }

    function cancenSale(uint256 tokenId) public payable {
        address seller = idToListedToken[tokenId].seller;
        require(
            true == idToListedToken[tokenId].currentlyListed,
            "Token is not listed"
        );
        require(msg.sender == seller, "Only the seller can cancel the sale");

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].seller = payable(msg.sender);
        idToListedToken[tokenId].price = 0;

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);

        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }

    function startAuction(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    ) public {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only the owner can start an auction"
        );
        require(
            !idToListedToken[tokenId].isOnAuction,
            "Token is already on auction"
        );
        require(duration > 0, "Auction duration must be greater than zero");

        idToListedToken[tokenId].isOnAuction = true;
        idToListedToken[tokenId].auctionEndTime = block.timestamp + duration;
        idToListedToken[tokenId].seller = payable(msg.sender);
        idToListedToken[tokenId].price = startingPrice;

        _transfer(msg.sender, address(this), tokenId);
        emit AuctionStarted(
            tokenId,
            msg.sender,
            msg.sender,
            startingPrice,
            idToListedToken[tokenId].auctionEndTime
        );
    }

    function placeBid(uint256 tokenId) public payable {
        require(
            idToListedToken[tokenId].isOnAuction,
            "Token is not on auction"
        );
        require(
            block.timestamp < idToListedToken[tokenId].auctionEndTime,
            "Auction has ended"
        );
        require(msg.value > 0, "Bid amount must be greater than zero");

        uint256 currentBid = tokenBids[tokenId][msg.sender];
        require(
            msg.value > currentBid,
            "Bid amount must be greater than current bid"
        );

        if (currentBid > 0) {
            payable(msg.sender).transfer(currentBid);
        }

        tokenBids[tokenId][msg.sender] = msg.value;

        if (msg.value > idToListedToken[tokenId].highestBid) {
            idToListedToken[tokenId].highestBidder = msg.sender;
            idToListedToken[tokenId].highestBid = msg.value;
        }

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function endAuction(uint256 tokenId) public {
        require(
            idToListedToken[tokenId].isOnAuction,
            "Token is not on auction"
        );
        require(
            block.timestamp >= idToListedToken[tokenId].auctionEndTime,
            "Auction has not ended yet"
        );

        address winner = idToListedToken[tokenId].highestBidder;
        uint256 winningBid = idToListedToken[tokenId].highestBid;

        idToListedToken[tokenId].isOnAuction = false;
        idToListedToken[tokenId].seller.transfer(winningBid);

        _transfer(address(this), winner, tokenId);

        emit AuctionEnded(
            tokenId,
            idToListedToken[tokenId].seller,
            winner,
            winningBid
        );
    }

    function getHighestBidder(uint256 tokenId) public view returns (address) {
        return idToListedToken[tokenId].highestBidder;
    }

    function isBided(uint256 tokenId) public view returns (bool) {
        return tokenBids[tokenId][msg.sender] > 0;
    }

    function getHighestBid(uint256 tokenId) public view returns (uint256) {
        return idToListedToken[tokenId].highestBid;
    }

    function getAuctionEndTime(uint256 tokenId) public view returns (uint256) {
        return idToListedToken[tokenId].auctionEndTime;
    }

    function getMyBids() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        for (uint i = 0; i < totalItemCount; i++) {
            if (tokenBids[i + 1][msg.sender] > 0) {
                itemCount += 1;
            }
        }

        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (tokenBids[i + 1][msg.sender] > 0) {
                currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
