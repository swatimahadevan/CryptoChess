// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;
contract Chess {
    struct Move {
        string oldCoord;
        string newCoord;
    }

    address[] private admins = [0xD5342e25cB392b5FF20E0BdaDE80335bD771CfAE, 0xDeB6559DCD9e3051a04aee760d83779463Eb8402, 0x42ca8504AB565a6918c366A31246d1974Ce366b8];
    uint MAX_BET_AMOUNT = 10;

    mapping(address => uint) private bets;
    mapping(address => Move[]) private moves;
    mapping(address => bool) private hasEnded;


    function start() public payable {
        require (msg.value <= MAX_BET_AMOUNT, "Bet amount too high");
        require (msg.value <= address(this).balance * 2, "Contract has insufficient balance");

        bets[msg.sender] = msg.value;
        hasEnded[msg.sender] = false;
        delete moves[msg.sender];
    }

    function move(string[] memory moveStringFrom, string[] memory moveStringTo) public {
        require(!hasEnded[msg.sender], "Session has already ended");
        require(moveStringFrom.length == moveStringTo.length, "Moves should have equal length");
        
        for(uint i = 0; i < moveStringFrom.length; i++) {
            moves[msg.sender].push(Move(moveStringFrom[i], moveStringTo[i]));
        }
    }

    function restart() public {
        hasEnded[msg.sender] = false;
        bets[msg.sender] = 0;
        delete moves[msg.sender];
    }

    function getHistoryMoves() public view returns(string memory) {
        string memory text = "";
        for(uint i = 0; i < moves[msg.sender].length; i++) {
          string memory coord = string.concat(moves[msg.sender][i].oldCoord, moves[msg.sender][i].newCoord);
          text = string.concat(text, coord);
        }

        return text;
    }

    function getBetAmount() public view returns(uint) {
        return bets[msg.sender];
    }

    function getBalance() public view returns (uint) {
        require(isAdmin(msg.sender), "Only authorized admin can call getBalance()");
        return address(this).balance;
    }

    function deposit() public payable {
        require(isAdmin(msg.sender), "Only authorized admin can call deposit()");
    }

    function withdraw(uint amount) public payable {
        require(isAdmin(msg.sender), "Only authorized admin can call withdraw()");
        payable(msg.sender).transfer(amount);
    }

    function ends(address playerAddress, bool playerWin) public payable  {
        require(isAdmin(msg.sender), "Only authorized admin can call ends()");
        require(!hasEnded[playerAddress], "Session has already ended for this player");

        if (playerWin) {
            payable(playerAddress).transfer(bets[playerAddress] * 2);
        }

        hasEnded[playerAddress] = true;
    }

    function isAdmin(address person) private view returns(bool) {
        for(uint i = 0; i < admins.length; i++) {
            if (admins[i] == person) {
                return true;
            }
        }

        return false;
    }
}