import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import styles from '../styles.js'
import AddPetFormDialog from './AddPetFormDialog'
import { fetchPet } from '../helpers.js'


export default class OwnerComponent extends Component {
    state = {
        showForm: false,
        dog: {},

    };

    handleClickOpen = async () => {
        const dog = await fetchPet()
        this.setState({ showForm: true, dog });
    };

    handleClose = () => {
        this.setState({ showForm: false });
    };

    render(){
        return (
            <div>
                <Paper style={styles.paperStyle}>
                <h1>Owner View - Store Ether Balance {this.props.storeEtherBalance}</h1>

                <Button style={{marginBottom: '2em'}} onClick={this.handleClickOpen} variant="contained" color='secondary'> Add Pet </Button>

                    <GridList cellHeight={300} cols={2}>
                        {this.props.petList.map( (pet, index) => (
                            <GridListTile key={index} cols={1}>
                                <div style={{display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-evenly'}} >
                                    <img style={{height: '250px', width: '300px'}} src={pet.imageURL} alt={pet.breed} />
                                    <div>
                                        <h2>{ pet.name }</h2>
                                        <p>{ pet.breed }</p>
                                        <p>{ pet.price } Ether</p>
                                        <p>Adoption Status: {pet.adopted ? 'True': 'False'}</p>
                                    </div>
                                </div>
                            </GridListTile>
                    ))}
                    </GridList>
                    <AddPetFormDialog
                      showForm={this.state.showForm}
                      closeForm={this.handleClose}
                      dog={this.state.dog}
                    />
                </Paper>
            </div>
        )
    }
}