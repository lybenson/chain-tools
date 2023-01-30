// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BatchTransfer is AccessControl, Ownable {
  bytes32 public constant REWARD_GIVER_ROLE = keccak256('REWARD_GIVER_ROLE');

  struct ReceiveForm {
    address payable recipient;
    uint256 amount;
  }

  constructor () {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function grantRewardGiverRole(address account) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 'you are not admin');
    _grantRole(REWARD_GIVER_ROLE, account);
  }

  function revokeRewardGiverRole(address account) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 'you are not admin');
    _revokeRole(REWARD_GIVER_ROLE, account);
  }

  function distribute(ReceiveForm[] calldata receives, address _token) payable external {
    require(hasRole(REWARD_GIVER_ROLE, msg.sender), 'without permission');
    require(receives.length > 0, 'No recipient');

    if (_token == address(0) && msg.value > 0) {
      _distributeNCLT(receives);
    } else {
      _distributeToken(receives, _token);
    }
  }

  function _distributeToken(ReceiveForm[] memory receives, address _token) private {
    IERC20 transferToken = IERC20(_token);
    for (uint i = 0; i < receives.length; i++) {
      address to = receives[i].recipient;
      uint amount = receives[i].amount;
      transferToken.transferFrom(msg.sender, to, amount);
    }
  }

  function _distributeNCLT(ReceiveForm[] memory receives) private {
    for (uint i = 0; i < receives.length; i++) {
      address payable to = receives[i].recipient;
      uint amount = receives[i].amount;
      to.transfer(amount);
    }
  }

  function withdraw() external onlyOwner {
    payable(msg.sender).transfer(address(this).balance);
  }

  receive() external payable {}
}
