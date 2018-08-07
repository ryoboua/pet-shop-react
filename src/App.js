import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import AdoptionContract from '../build/contracts/Adoption.json'
import dogList from './pets.json'
import OwnerComponent from './components/OwnerComponent.js'
import ClientComponent from './components/ClientComponent.js'

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
      web3: null,
      dogList: [],
      adopters: [],
      account: null,
      adoptionInstance: null,
      contractOwner: null,
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
    let contractOwner = await adoptionInstance.owner.call()
    console.log('contractOwner', contractOwner)
    console.log('Adopter List', adopters)
    this.setState({ adopters, dogList, adoptionInstance, contractOwner })

  }

  handleAdopt(index){
    this.state.adoptionInstance.adopt(index, {from: this.state.account})
  }

  handleReturnPet(index) {
    this.state.adoptionInstance.returnPet(index, {from: this.state.account, gas: 4712388, gasPrice: 100000000000})
  }

  render() {
    return (
      <div className="App">
        <div style={{textAlign: 'center'}} >
        <h1 style={{margin: 'auto'}}>Adopt a Pet on the Ethereum Network</h1>
        </div>
        { this.state.account === this.state.contractOwner ?
          <OwnerComponent /> 
          :
          <ClientComponent dogList={this.state.dogList} adopters={this.state.adopters} account={this.state.account} />
        // <Paper style={styles.paperStyle} >
        //   <GridList cellHeight={160} cols={3} >
        //     {this.state.dogList.map( (dog, index) => (
        //           <GridListTile key={index} cols={1}>
        //             <h2>{ dog.name }</h2>
        //             <p>{ dog.breed }</p>
        //             {
        //             (this.state.adopters[index] !== '0x0000000000000000000000000000000000000000')
        //             ?
        //             <Button disabled type="submit" value="Adopt">Pet Adopted</Button>
        //             :
        //             <Button color="primary" onClick={() => this.handleAdopt(index)} value="Adopt">Adopt</Button>
        //             }

        //             {
        //             (this.state.adopters[index] === this.state.account) ?
        //                   (<Button color="secondary" type="submit" onClick={ () => this.handleReturnPet(index) } >Return Pet</Button>) 
        //                   :
        //                   null

        //             }
        //           </GridListTile>
        //   ))}
        //   </GridList>
        // </Paper>
        }
      </div>
    );
  }
}

export default App
