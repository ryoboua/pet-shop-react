import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import AdoptionContract from '../build/contracts/Adoption.json'
import dogList from './pets.json'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const Adoption = contract(AdoptionContract);

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      dogList: [],
      adopters: [],
      account: null,
      adoptionInstance: null
    }
    this.instantiateContract = this.instantiateContract.bind(this)
    this.handleAdopt = this.handleAdopt.bind(this)
    this.getAccounts = this.getAccounts.bind(this)
    this.handleReturnPet = this.handleReturnPet.bind(this)
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
        console.log(results)
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


  getAccounts() {
      this.state.web3.eth.getAccounts( (err, accounts) => {
          console.log(accounts)
          this.setState({ account : accounts[0]})
      })
  }
  async instantiateContract() {
    let adoptionInstance;
    Adoption.setProvider(this.state.web3.currentProvider);
    this.getAccounts()
    adoptionInstance = await Adoption.deployed();
    let adopters = await adoptionInstance.getAdopters.call()
    console.log(adopters)
    this.setState({ adopters, dogList, adoptionInstance })

  }

  handleAdopt(index){
    this.state.adoptionInstance.adopt(index, {from: this.state.account})
  }

  handleReturnPet(index) {
    this.state.adoptionInstance.returnPet(index, {from: this.state.account})
  }

  render() {
    return (
      <div className="App">
        <h1>Pet List</h1>
        <ul>
            {this.state.dogList.map( (dog, index) => {
            return (
                <li key={index} >
                    <h2>{ dog.name }</h2>
                    <p>{dog.breed}</p>
                    {
                    (this.state.adopters[index] !== '0x0000000000000000000000000000000000000000')
                    ?
                    <button disabled type="submit" value="Adopt">Success</button>
                    :
                    <button onClick={() => this.handleAdopt(index)} value="Adopt">Adopt</button>
                    }

                    {
                     (this.state.adopters[index] === this.state.account) ?
                          (<button type="submit" onClick={ () => this.handleReturnPet(index) } >Return Pet</button>) :
                          null

                    }
                </li>
            )
        })}
        </ul>
      </div>
    );
  }
}

export default App
