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
        string imageURL;
        bool adopted;
        address owner;
    }

    Pet[] public pets;
    mapping (uint => address) public petToOwner;
    mapping (address => uint) public ownerPetCount;

    constructor() public {
        //Populate Pet Store
        createPet('Jackie', 'germanshepherd', 100, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4059.jpg');
        createPet('Taco', 'germanshepherd', 200, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4059.jpg');
        createPet('Jim', 'germanshepherd', 300, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4059.jpg');
    }

    function getPetOwnerAddress( uint _petId) public view returns (address) {
        return petToOwner[_petId];
    }

    function createPet(string _name, string _breed, uint _price, string _imageURL) public onlyOwner returns (uint) {
        uint _petId = pets.push(Pet(_name, _breed, _price, _imageURL, false, msg.sender)) - 1;
        petToOwner[_petId] = owner;
        ownerPetCount[owner]++;
        emit NewPetCreated(_name, _breed, _price);
        return _petId;
    }

    function adopt(uint _petId) public returns (uint) {
        require(_petId >= 0);
        require(petToOwner[_petId] == owner);

        pets[_petId].adopted = true;
        pets[_petId].owner = msg.sender;

        petToOwner[_petId] = msg.sender;
        ownerPetCount[msg.sender]++;
        ownerPetCount[owner]--;

        emit PetAdopted(pets[_petId].name, msg.sender);
        return _petId;
    }

    function returnPet(uint _petId) public returns (uint) {
        require( _petId >= 0);
        require( petToOwner[_petId] == msg.sender );

        pets[_petId].adopted = false;
        pets[_petId].owner = owner;

        petToOwner[_petId] = owner;
        ownerPetCount[owner]++;
        ownerPetCount[msg.sender]--;

        emit PetReturned(pets[_petId].name);
        return _petId;
    }

    function getTotalNumberOfPets() public view returns (uint) {
        return pets.length;
    }

    function getPet(uint _index) public view returns (string, string, uint, string, bool, address) {
        Pet memory pet = pets[_index];
        return (pet.name, pet.breed, pet.price, pet.imageURL, pet.adopted, pet.owner);
    }

    function getPetsOwnnedByContractOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerPetCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < pets.length; i++) {
        if (petToOwner[i] == _owner) {
            result[counter] = i;
            counter++;
        }
        }
        return result;
    }
}
