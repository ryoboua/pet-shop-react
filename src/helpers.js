export const getPetList = async (contractInstance, numOfPets) => {
    // fetch Pet List and Rebuild Object Array of Pets
    const promiseArr = [];
  
    for (let i = 0; i < numOfPets; i++ ) 
        { promiseArr[i] = await contractInstance.pets(i) }

    return promiseArr.map( ([ name , breed, price, adopted, owner ]) => ({ name, breed, price: price.toString(), adopted, owner }))
  }