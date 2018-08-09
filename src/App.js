import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import AdoptionContract from '../build/contracts/Adoption.json'
import OwnerComponent from './components/OwnerComponent.js'
import ClientComponent from './components/ClientComponent.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const Adoption = contract(AdoptionContract);

const getPetList = async (contractInstance, numOfPets) => {
  // fetch Pet List and Rebuild Object Array of Pets
  const promiseArr = [];
  for (let i = 0; i < numOfPets; i++ ) {
    promiseArr[i] = await contractInstance.pets(i)
  }
    return promiseArr.map( pet => {
      return {
        name: pet[0],
        breed: pet[1],
        price: pet[2].toString()
      }
    })
}


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      petList: [],
      account: null,
      adoptionInstance: null,
      contractOwner: null,
    }
    this.instantiateContract = this.instantiateContract.bind(this)
    this.handleAdopt = this.handleAdopt.bind(this)
    this.handleReturnPet = this.handleReturnPet.bind(this)
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  checkTransactionResults = (results) => {
    for (var i = 0; i < results.logs.length; i++) {
      if (results.logs[i].event === "NewPetCreated") {
        alert('Pet Added')
        break;
      }
    }
  }


  getActiveMetaMaskAccount = () => {
      this.state.web3.eth.getAccounts( (err, accounts) => {
          this.setState({ account : accounts[0]})
      })
  }

  instantiateContract = async () => {
    let adoptionInstance;
    Adoption.setProvider(this.state.web3.currentProvider);
    this.getActiveMetaMaskAccount()

    adoptionInstance = await Adoption.deployed();
    
    const contractOwner = await adoptionInstance.owner.call()
    let TotalNumberOfPets = await adoptionInstance.getTotalNumberOfPets.call()
                                      .then(TotalNumberOfPet => TotalNumberOfPet.toString())

    const petList = await getPetList(adoptionInstance, TotalNumberOfPets)

    this.setState({ petList, adoptionInstance, contractOwner })

  }

  handleAdopt(index){
    this.state.adoptionInstance.adopt(index, {from: this.state.account})
  }

  handleReturnPet(index) {
    this.state.adoptionInstance.returnPet(index, {from: this.state.account, gas: 4712388, gasPrice: 100000000000})
  }

  handleCreatePet = (name, breed, price) => {
    console.log(name, breed, price)
    this.state.adoptionInstance.createPet(name, breed, price, {from: this.state.contractOwner})
      .then(this.checkTransactionResults)
      .catch(err => console.log('Error during pet creation', err))
  }

  render() {
    return (
      <div className="App">
        <div style={{textAlign: 'center'}} >
        <h1 style={{margin: 'auto'}}>Adopt a Pet on the Ethereum Network</h1>
        </div>
        { 
          this.state.account === this.state.contractOwner ?
          <OwnerComponent
            petList={this.state.petList}
            createPet={this.handleCreatePet}
          /> 
          :
          // <ClientComponent
          //   dogList={this.state.dogList}
          //   adopters={this.state.adopters}
          //   account={this.state.account}
          // />
          null
       
        }
      </div>
    );
  }
}

export default App
