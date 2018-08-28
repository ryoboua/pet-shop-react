import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import { toWei, fromWei } from '../node_modules/web3/lib/utils/utils'
import AdoptionContract from '../build/contracts/Adoption.json'
import OwnerComponent from './components/OwnerComponent.js'
import ClientComponent from './components/ClientComponent.js'
import { getPetList, isObjectEmpty as isEventDataEmpty } from './helpers.js';
import LinearBuffer from './components/LinearBuffer.js'
import SnackBarMessage from './components/SnackBarMessage.js'
import  SolidityCoder  from 'web3/lib/solidity/coder.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const Adoption = contract(AdoptionContract);

export const AppContext = React.createContext();

console.log(SolidityCoder)


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
    showApp: true,
    showSnackBarMessage: false,
    eventQueue: [],
    eventData: {
      event: null,
      data: null
    },
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
      .catch(err => console.log('Error during pet adoption', err))    },
    handleReturnPet: petId => {
      this.state.adoptionInstance.returnPet(petId, {from: this.state.account, gas: 4712388, gasPrice: 100000000000})
      .then(this.state.checkTransactionResults)
      .catch(err => console.log('Error during pet return', err))
    },
    checkTransactionResults: async (results) => {
      for (let i = 0; i < results.logs.length; i++) {
        if (results.logs[i].event === "NewPetCreated" || "PetAdopted" || "PetReturned") {
          this.updateStore()
          break;
        }
      }
    },
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
    const hashes = this.getFunctionHashes(AdoptionContract.abi)

    let events = this.state.web3.eth.filter('latest')
    events.watch( (error, blockHash) => {
      //console.log('blockHash', blockHash)
      this.state.web3.eth.getBlock(blockHash, true, (error, logs) => { 
        for(const transaction of logs.transactions){
          console.log('transactions', transaction)

          console.log(this.findFunctionByHash(hashes, transaction.input))
          //console.log(Web3)
          console.log((SolidityCoder.decodeParam('uint265',transaction.input.substring(10))).toString())

        }

      })
    })












    return this.setState({ adoptionInstance, contractOwner, TotalNumberOfPets, petList, storeEtherBalance }, () => {

    //debugger;;
    //adoptionInstance.allEvents(eventFilter).get((err, res) => console.log(res))
    // ((error, result) => {
    //   debugger;;
    //   if(!error) {
    //     this.checkEvents(result)
    //   } else {
    //     console.log(error)
    //   }
    // })

      //Once the App State is set, I run a check to see if active MetaMask account changed - setInterval Method suggested by MetaMask FAQ https://tinyurl.com/ycokp3h6
      setInterval(() => {
        getWeb3.then( obj => {
         if (obj.web3.eth.accounts[0] !== this.state.account) location.reload()
        })
      }, 100); 
    })
  }

  getFunctionHashes = (abi) => {
    var hashes = [];
    for (var i=0; i<abi.length; i++) {
      var item = abi[i];
      if (item.type != "function") continue;
      var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
      var hash = this.state.web3.sha3(signature);
      //console.log(item.name + '=' + hash);
      hashes.push({name: item.name, hash: hash});
    }
    return hashes;
  }

  findFunctionByHash = (hashes, functionHash) => {
    for (var i=0; i<hashes.length; i++) {
      if (hashes[i].hash.substring(0, 10) == functionHash.substring(0, 10))
        return hashes[i].name;
    }
    return null;
  }


  updateStore = async (event, data) => {
    const { adoptionInstance, eventData } = this.state
    const TotalNumberOfPets = await adoptionInstance.getTotalNumberOfPets.call()
                                    .then(result => result.toString())
    const petList = await getPetList(adoptionInstance, TotalNumberOfPets)
    const storeEtherBalance = await adoptionInstance.getStoreBalance.call()
                                    .then(balance => fromWei(balance.toString()))
    // If there is no event just update the store
    if (event) {
      console.log('EventData', eventData)
      if(eventData.event === null) {
        await this.setStateAsync({ 
          petList, TotalNumberOfPets, storeEtherBalance,
          eventData: {...this.state.eventData, event, data },
          showSnackBarMessage: true
        })
      } else {
        this.setState({
          petList, TotalNumberOfPets, storeEtherBalance,
          eventQueue: [...this.state.eventQueue, { event, data }],
        })
      }
      // await this.setStateAsync({ 
      //   petList, TotalNumberOfPets, storeEtherBalance, showSnackBarMessage,
      //   eventQueue: [...this.state.eventQueue, newMessage]
      // })

      //if (this.state.eventQueue.length >= 1 && this.state.showSnackBarMessage ) this.proccessMessageQueue()
      
    } else {
      return this.setState({ petList, TotalNumberOfPets, storeEtherBalance})
    }
  }

  checkEvents = result => {
    console.log(result)
    if(result && (result.event === "NewPetCreated" || "PetAdopted" || "PetReturned")){

      //return this.updateStore(result.event, result.args)
    }
  }

  setStateAsync = state => {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  loadingComplete = () => this.setState({ showApp: true })

  hideSnackBarMessage = () => {
    this.setState({ showSnackBarMessage: false })
  }

  clearEventData = () => {
    this.setState({ eventData: {...this.state.eventData, event: null, data: null} })
  }

  proccessMessageQueue = () => {
    setTimeout(() => {
      if (this.state.eventQueue.length > 0) {
        this.setState({ 
          eventData: {...this.state.eventQueue[0]},
          eventQueue: [...this.state.eventQueue.slice(1)],
          showSnackBarMessage: true
        });
      }
    }, 2000)

  };

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
          <SnackBarMessage 
            showSnackBarMessage={this.state.showSnackBarMessage} 
            hideSnackBarMessage={this.hideSnackBarMessage}
            eventData={this.state.eventData}
            proccessMessageQueue={this.proccessMessageQueue}
            clearEventData={this.clearEventData}
          />
        </div>
      </AppProvider>

    );
  }
}


