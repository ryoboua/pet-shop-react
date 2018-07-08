import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import AdoptionContract from '../build/contracts/Adoption.json'
import dogList from './pets.json'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      dogList: [],
      adopters: []
    }
    this.instantiateContract = this.instantiateContract.bind(this)
    this.handleAdopt = this.handleAdopt.bind(this)
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



  async instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const Adoption = contract(AdoptionContract);
    Adoption.setProvider(this.state.web3.currentProvider);
    this.setState({ dogList })
    var adoptionInstance;
    // Get accounts.

    this.state.web3.eth.getAccounts( async (err, account) => {
        console.log(account)
        adoptionInstance = await Adoption.at('0xdd2cbda74abc54bbf27955c34b215098372f8906');
        let adopters = await adoptionInstance.getAdopters.call()
        this.setState({ adopters })
        console.log(adopters)
    } );
  }

  handleAdopt(index){
      console.log(index)
    var adoptionInstance;
    const contract = require('truffle-contract')
    const Adoption = contract(AdoptionContract);
    Adoption.setProvider(this.state.web3.currentProvider);
    this.state.web3.eth.getAccounts( async (err, account) => {
        console.log(account)
        adoptionInstance = await Adoption.at('0xdd2cbda74abc54bbf27955c34b215098372f8906');
        await adoptionInstance.adopt(index, {from: account[0]})
        this.instantiateContract()

    } );
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
                </li>
            )
        })}
        </ul>
      </div>
    );
  }
}

export default App
