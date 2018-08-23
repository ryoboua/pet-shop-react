import { toWei, fromWei } from '../node_modules/web3/lib/utils/utils'
import {BigNumber} from 'bignumber.js';


export const getPetList = async (contractInstance, numOfPets, activeAccount) => {
    // fetch Pet List and Rebuild Object Array of Pets
    const promiseArr = [];
    const gasPriceArr = []
    
    if (activeAccount === 'owner') {
        for (let i = 0; i < numOfPets; i++ ) 
        { promiseArr[i] = await contractInstance.pets(i) }
    } else {
        for (let i = 0; i < numOfPets; i++ ) { 
            promiseArr[i] = await contractInstance.pets(i)
            console.log(BigNumber(promiseArr[i][2]).toNumber())
            const petPrice = BigNumber(promiseArr[i][2]).toNumber()
            gasPriceArr[i] = await contractInstance.adopt.estimateGas(i, { from: activeAccount, value: toWei(petPrice, "ether") })
            console.log(fromWei(gasPriceArr[i]))
 
        }
    }
    return promiseArr.map(([ name , breed, price, imageURL, adopted, owner ], index) => {
        return { 
            name, 
            breed, 
            price: price.toString(),
            imageURL, 
            adopted, 
            owner,
            gasPrice: activeAccount === 'owner' ? 'N/A' : gasPriceArr[index]
        }
    })
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