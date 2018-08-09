pragma solidity ^0.4.17;

import './Migrations.sol';

contract Adoption is Migrations {

    event NewPetCreated(string name, string breed, uint price);
    event PetAdopted(string name, address newOwner);
    event PetReturned(string name);

    struct Pet {
        string name;
        string breed;
        uint price;
    }

    Pet[] public pets;
    mapping (uint => address) public petToOwner;
    mapping (address => uint) public ownerPetCount;

    constructor() public {
        //Populate Pet Store
        createPet('Jackie', 'Dog', 100);
        createPet('Taco', 'Cat', 200);
        createPet('Jim', 'Snake', 300);

    }

    function getPetOwnerAddress( uint _petId) public view returns (address) {
        return petToOwner[_petId];
    }

    function createPet(string _name, string _breed, uint _price) public onlyOwner returns (uint) {
        uint _petId = pets.push(Pet(_name, _breed, _price)) - 1;
        petToOwner[_petId] = owner;
        ownerPetCount[owner]++;
        emit NewPetCreated(_name, _breed, _price);
        return _petId;
    }

    function adopt(uint _petId) public returns (uint) {
        require(_petId >= 0);
        require(petToOwner[_petId] == owner);

        petToOwner[_petId] = msg.sender;
        ownerPetCount[msg.sender]++;
        ownerPetCount[owner]--;
        emit PetAdopted(pets[_petId].name, msg.sender);
        return _petId;
    }

    function returnPet(uint _petId) public returns (uint) {
        require( _petId >= 0);
        require( petToOwner[_petId] == msg.sender );
        petToOwner[_petId] = owner;
        emit PetReturned(pets[_petId].name);
        return _petId;
    }

    function getTotalNumberOfPets() public view returns (uint) {
        return pets.length;
    }

    function getPet(uint _index) public view returns (string, string, uint) {
        Pet memory pet = pets[_index];
        return (pet.name, pet.breed, pet.price);
    }
}
