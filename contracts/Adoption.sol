pragma solidity ^0.4.17;

import './Migrations.sol';

contract Adoption is Migrations {
    address[16] public adopters;
    address public constant STORE_WALLET = 0x0000000000000000000000000000000000000000;

    function adopt(uint petId) public returns (uint) {
        require( petId >= 0 && petId <= 15 );
        adopters[petId] = msg.sender;
        return petId;
    }

    function getAdopters() public view returns (address[16]) {
        return adopters;
    }

    function getPetOwnerAddress( uint _petId) public view returns (address) {
        return adopters[_petId];
    }

    function returnPet(uint petId) public returns (uint) {
        require( petId >= 0 && petId <= 15 );
        require( adopters[petId] == msg.sender );
        adopters[petId] = STORE_WALLET;
        return petId;
    }
}
