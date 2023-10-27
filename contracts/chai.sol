// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract chai {
    address payable owner;
    struct Memo {
        string name;
        string message;
        uint timestamp;
        address from;
    }
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }

    function buyChai(string memory name, string memory message) public payable {
        require(msg.value > 0, "Please pay more than zero ether");
        owner.transfer(msg.value);
        memos.push(Memo(name, message, block.timestamp, msg.sender));
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
