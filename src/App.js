import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import AdoptionContract from '../build/contracts/Adoption.json'
import OwnerComponent from './components/OwnerComponent.js'
import ClientComponent from './components/ClientComponent.js'
import { getPetList } from './helpers.js';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const Adoption = contract(AdoptionContract);

export default class App extends Component {
  constructor(props) {
    super(props)
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

  state = {
    web3: null,
    account: 'null',
    adoptionInstance: null,
    contractOwner: null,
    TotalNumberOfPets: null,
    petList: []
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
    // Getting deployed contract and stating up App state
    this.getActiveMetaMaskAccount()

    Adoption.setProvider(this.state.web3.currentProvider);
    const adoptionInstance = await Adoption.deployed();
    
    const contractOwner = await adoptionInstance.owner.call()
    const TotalNumberOfPets = await adoptionInstance.getTotalNumberOfPets.call()
                                      .then(result => result.toString())
    const petList = await getPetList(adoptionInstance, TotalNumberOfPets)

    return this.setState({ adoptionInstance, contractOwner, TotalNumberOfPets, petList })
  }

  handleAdopt = petId => {
    this.state.adoptionInstance.adopt(petId, {from: this.state.account})
  }

  handleReturnPet = petId => {
    this.state.adoptionInstance.returnPet(petId, {from: this.state.account, gas: 4712388, gasPrice: 100000000000})
  }

  handleCreatePet = (name, breed, price) => {
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
            //Check if active account is store owner or client
            this.state.account === this.state.contractOwner ?
            <OwnerComponent
              createPet={this.handleCreatePet}
              petList={this.state.petList}
            /> 
            : this.state.account !== null ?
            <ClientComponent
            account={this.state.account}
            petList={this.state.petList}
            adopt={this.handleAdopt}
            returnPet={this.handleReturnPet}
            />
            :
            null
          }
      </div>
    );
  }
}


