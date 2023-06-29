// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CyasInu is ERC20 {
    uint256 constant _initialSupply = 1000000 * (10 ** 18);
    uint256 constant _mintAmount = 10;

    constructor() ERC20("CyasInu", "CYAS") {
        _mint(msg.sender, _initialSupply);
    }

    function mintTokens() external {
        _mint(msg.sender, _mintAmount * (10 ** 18));
    }
}
