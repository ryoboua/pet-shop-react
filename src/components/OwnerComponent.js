import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import styles from '../styles.js'
import AddPetFormDialog from './AddPetFormDialog'
//import getPetList from '../helpers.js';

const getPetList = async (contractInstance, numOfPets) => {
    // fetch Pet List and Rebuild Object Array of Pets
    const promiseArr = [];
  
    if (typeof numOfPets !== 'object') {
      for (let i = 0; i < numOfPets; i++ ) {
        promiseArr[i] = await contractInstance.pets(i)
      }
    } else {
  
    }
  
    return promiseArr.map( pet => {
      return {
        name: pet[0],
        breed: pet[1],
        price: pet[2].toString()
      }
    })
  }

export default class OwnerComponent extends Component {
    state = {
        showForm: false,
    };

    handleClickOpen = () => {
        this.setState({ showForm: true });
    };

    handleClose = () => {
        this.setState({ showForm: false });
    };

    addPet = (name, breed, price) => {
        this.props.createPet(name, breed, price)
    }
    render(){

        return (
            <div>
                <Paper style={styles.paperStyle}>
                <h1>You are the store Owner</h1>
                    <GridList cellHeight={200} cols={3}>
                        {this.props.petList.map( (pet, index) => (
                            <GridListTile key={index} cols={1}>
                                <h2>{ pet.name }</h2>
                                <p>{ pet.breed }</p>
                                <p>{ pet.price }</p>
                                <p>Adoption Status: {pet.adopted ? 'True': 'False'}</p>
                            </GridListTile>
                    ))}
                    </GridList>
                    <Button onClick={this.handleClickOpen} color='primary'> Add Pet </Button>
                    <AddPetFormDialog
                      showForm={this.state.showForm}
                      closeForm={this.handleClose}
                      addPet={this.addPet}
                    />
                </Paper>
            </div>
        )
    }
}
