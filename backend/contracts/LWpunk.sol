// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LWPunk is Ownable, ERC721Enumerable{

    string _baseTokenURI; 

    uint _price= 0.01 ether;
    uint  public  maxTokenIds =10;
    uint public tokenIds;
    bool public _paused;

    constructor(string memory baseURL) ERC721("Learn Web3 Punks","LW3" ){
        _baseTokenURI = baseURL;
    }

    modifier notPaused{
        require(!_paused, "Minting is paused");
        _;
    }

    function mint() public  payable notPaused{

        require(msg.value >= _price, "unsufficeint balance");
        require(tokenIds < maxTokenIds, "Maximum mint limit reached");
        tokenIds++;
        _safeMint(msg.sender, tokenIds);

        

    

    }




    function withdraw() public onlyOwner{
        address _owner = owner();
        uint balance = address(this).balance;
        (bool s,) =  _owner.call{value:balance}("");
        require(s,"Error while transfering balance");
    }

    
    receive() external payable{}

    fallback() external payable{}

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

   function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json")) : "";
    }

    function setPaused(bool isPaused) public onlyOwner (){
        _paused = isPaused;
    }



}