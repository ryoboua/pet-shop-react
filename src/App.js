import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { toWei, fromWei } from '../node_modules/web3/lib/utils/utils'
import AdoptionContract from '../build/contracts/Adoption.json'
import OwnerComponent from './components/OwnerComponent.js'
import ClientComponent from './components/ClientComponent.js'
import { getPetList } from './helpers.js';
import LinearBuffer from './components/LinearBuffer.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const Adoption = contract(AdoptionContract);

export const AppContext = React.createContext();

class AppProvider extends Component {
  render() {
    return (
      <AppContext.Provider value={this.props.appState} >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export class App extends Component {
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
    //State Variables
    web3: null,
    account: null,
    adoptionInstance: null,
    contractOwner: null,
    TotalNumberOfPets: null,
    petList: [],
    showApp: false,
    storeEtherBalance: 0,

    //App Methods
    handleCreatePet: (name='David', breed, price=100, imageURL) => {
      this.state.adoptionInstance.createPet(name, breed, price, imageURL, {from: this.state.contractOwner})
      .then(this.state.checkTransactionResults)
      .catch(err => console.log('Error during pet creation', err))
    },
    handleAdopt: (petId, petPrice) => {
      this.state.adoptionInstance.adopt(petId, {from: this.state.account, value: toWei(petPrice, "ether")})
      .then(this.state.checkTransactionResults)
      .catch(err => console.log('Error during pet creation', err))    },
    handleReturnPet: petId => {
      this.state.adoptionInstance.returnPet(petId, {from: this.state.account, gas: 4712388, gasPrice: 100000000000})
      .then(this.state.checkTransactionResults)
      .catch(err => console.log('Error during pet creation', err))
    },
    checkTransactionResults: async (results) => {
      for (var i = 0; i < results.logs.length; i++) {
        if (results.logs[i].event === "NewPetCreated" || "PetAdopted" || "PetReturned") {
          this.state.updateStore()
          break;
        } 
      }
    },
    updateStore: async () => {
      const { adoptionInstance } = this.state
      const TotalNumberOfPets = await adoptionInstance.getTotalNumberOfPets.call()
                                      .then(result => result.toString())
      const petList = await getPetList(adoptionInstance, TotalNumberOfPets)
      const storeEtherBalance = await adoptionInstance.getStoreBalance.call()
                                      .then(balance => fromWei(balance.toString()))
      this.setState({ petList, TotalNumberOfPets, storeEtherBalance }) 
    }
  }
  
  getActiveMetaMaskAccount = () => {
      this.state.web3.eth.getAccounts( (err, accounts) => {
          this.setState({ account : accounts[0]})
      })
  }

  instantiateContract = async () => {
    // Getting deployed contract and setting up App state
    this.getActiveMetaMaskAccount()

    Adoption.setProvider(this.state.web3.currentProvider);
    const adoptionInstance = await Adoption.deployed();
    const contractOwner = await adoptionInstance.owner.call()

    const TotalNumberOfPets = await adoptionInstance.getTotalNumberOfPets.call()
                                      .then(result => result.toString())

    const petList = await getPetList(adoptionInstance, TotalNumberOfPets)

    const storeEtherBalance = await adoptionInstance.getStoreBalance.call()
                                      .then(balance => fromWei(balance.toString()))

    return this.setState({ adoptionInstance, contractOwner, TotalNumberOfPets, petList, storeEtherBalance }, () => {
      //Once the App State is set, I run a check to see if active MetaMask account changed - setInterval Method suggested by MetaMask FAQ https://tinyurl.com/ycokp3h6
      setInterval(() => {
        getWeb3.then( obj => {
         if (obj.web3.eth.accounts[0] !== this.state.account) location.reload()
        })
      }, 100); 
    })
  }



  loadingComplete = () => {
    this.setState({ showApp: true })
  }

  renderOwnerOrClientComponent = () => { 
    return this.state.account === this.state.contractOwner ?
            <OwnerComponent
              petList={this.state.petList}
              storeEtherBalance={this.state.storeEtherBalance}
            /> 
            :
            <ClientComponent
              account={this.state.account}
              petList={this.state.petList}
              adopt={this.state.handleAdopt}
              returnPet={this.state.handleReturnPet}
            />
  }

  render() {
    return (
      <AppProvider appState={this.state} >
        <div className="App">
          <div style={{textAlign: 'center'}} >
          <h1 style={{margin: 'auto'}}>Adopt a Pet on the Ethereum Network</h1>
          </div>
          {
            this.state.showApp ? this.renderOwnerOrClientComponent() : <LinearBuffer loadingComplete={this.loadingComplete} /> 
          }
          
        </div>
      </AppProvider>

    );
  }
}


