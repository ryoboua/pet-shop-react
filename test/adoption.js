var Adoption = artifacts.require("./Adoption.sol")

contract('Adoption', accounts => {

    it("... should return 8", async () => {
        let adoptionInstance = await Adoption.deployed();
        await adoptionInstance.adopt(8, {from: accounts[0]})
        let data = await adoptionInstance.getPetOwnerAddress(8)
        assert.equal(data, accounts[0], "The value 8 was not stored")
  })

  it("Can return Pet", async () => {
    let adoptionInstance = await Adoption.deployed();
    await adoptionInstance.returnPet(8);
    let data = await adoptionInstance.getPetOwnerAddress(8)
    assert.equal(data, '0x0000000000000000000000000000000000000000', "sdasdasd")

  })
})
