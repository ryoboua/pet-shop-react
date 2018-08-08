import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import styles from '../styles.js'



class OwnerComponent extends Component {
    constructor(props){
        super(props)
        this.createPet = this.createPet.bind(this)
    }

    createPet() {
        this.props.createPet('Test', 'Dummy', 100)
    }

    render(){
        return (
            <div>
                <h1>You are the store Owner</h1>
                <Paper style={styles.paperStyle} >
                    <GridList cellHeight={160} cols={3} >
                        {this.props.petList.map( (pet, index) => (
                            <GridListTile key={index} cols={1}>
                                <h2>{ pet.name }</h2>
                                <p>{ pet.breed }</p>
                                <p>{ pet.price }</p>
                            </GridListTile>
                    ))}
                    </GridList>
                    <Button onClick={this.createPet} color='primary'> Add Pet </Button>
                </Paper>
            </div>
        )
    }
}

export default OwnerComponent;