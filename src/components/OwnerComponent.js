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
        console.log(dog)
        this.setState({ showForm: true, dog });
    };

    handleClose = () => {
        this.setState({ showForm: false });
    };

    render(){

        return (
            <div>
                <Paper style={styles.paperStyle}>
                <h1>Owner View</h1>
                    <GridList cellHeight={200} cols={3}>
                        {this.props.petList.map( (pet, index) => (
                            <GridListTile key={index} cols={1}>
                                <h2>{ pet.name }</h2>
                                <p>{ pet.breed }</p>
                                <p>${ pet.price }</p>
                                <p>Adoption Status: {pet.adopted ? 'True': 'False'}</p>
                                <img src={pet.imageURL} alt={`Picture of ${pet.breed}`} />

                            </GridListTile>
                    ))}
                    </GridList>
                    <Button onClick={this.handleClickOpen} variant="contained" color='secondary'> Add Pet </Button>
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