
var Adoption = artifacts.require("./Adoption.sol")


contract('Adoption', async accounts => {

  // it("Can return Pet", async () => {
  //   let adoptionInstance = await Adoption.deployed();
  //   await adoptionInstance.returnPet(8);
  //   let data = await adoptionInstance.getPetOwnerAddress(8)
  //   assert.equal(data, '0x0000000000000000000000000000000000000000', "sdasdasd")

  // })

  // it('Contract Owner can create a Pet', async () => {
  //   const instance = await Adoption.deployed()
  //   const contractOwner = accounts[0]
  //   let { logs } = await instance.createPet('TestPet1', 'Robot', 25, 'https://robotpic.com', { from: contractOwner})
  //   let result = logs[0]
  //   let event = result.event
  //   let { name, breed, price } = result.args

  //   assert.equal(event, 'NewPetCreated', 'Event created should be: NewPetCreated')
  //   assert.equal(name, 'TestPet1','Pet name should be: TestPet1')
  //   assert.equal(breed,'Robot','Pet breed should be: Robot')
  //   assert.equal(price.toString(), 25, 'Price should be 25 ')
  // })

  it('If msg.sender is not the contract owner, pet creation should fail', async () => {
    const instance = await Adoption.deployed()
    expect(async () => {
      return await instance.createPet('TestPet1', 'Robot', 25, 'https://robotpic.com', { from: accounts[1]})
    }).to.throw(Error,  )
    // let result = logs[0]
    // let event = result.event
    // let { name, breed, price } = result.args

    // assert.equal(event, 'NewPetCreated', 'Event created should be: NewPetCreated')
    // assert.equal(name, 'TestPet1','Pet name should be: TestPet1')
    // assert.equal(breed,'Robot','Pet breed should be: Robot')
    // assert.equal(price.toString(), 25, 'Price should be 25 ')
  })
})
