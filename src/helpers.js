export const getPetList = async (contractInstance, numOfPets) => {
    // fetch Pet List and Rebuild Object Array of Pets
    const promiseArr = [];
  
    for (let i = 0; i < numOfPets; i++ ) 
        { promiseArr[i] = await contractInstance.pets(i) }

    return promiseArr.map( ([ name , breed, price, imageURL, adopted, owner ]) => ({ name, breed, price: price.toString(), imageURL, adopted, owner }))
  }

  export const fetchPet = async () => {
    const newPet = await fetch('https://dog.ceo/api/breeds/image/random').then(result => result.json()).catch(err => console.log(err))
    
    if (newPet && newPet.status === 'success') {
        const breed = newPet.message.split('/')[4]
        const image = newPet.message
        return { breed, image  }
    } else {
        return null;
    }
}