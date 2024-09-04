// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Platform {
  address private _token;

  constructor(address token) {
    // deploy for every ERC20 on every chain: matrix nxm
    _token = token;
  }

  function giveAllowance() public {
    // client
    IERC20 tokenContract = IERC20(_token);
    tokenContract.approve(address(this), 10 ** 18);
  }

  function charge(address from, address to, uint256 value) public {
    // !!!! TODO
    // require(msg.sender == owner);
    IERC20 tokenContract = IERC20(_token);
    tokenContract.transferFrom(from, to, value);
  }
}
