import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import styles from '../styles.js'
import AddPetFormDialog from './AddPetFormDialog'



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
                <h1>You are the store Owner</h1>
                <Paper style={styles.paperStyle} >
                    <GridList cellHeight={160} cols={3}>
                        {this.props.petList.map( (pet, index) => (
                            <GridListTile key={index} cols={1}>
                                <h2>{ pet.name }</h2>
                                <p>{ pet.breed }</p>
                                <p>{ pet.price }</p>
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
