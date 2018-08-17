import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import styles from '../styles.js';


class ClientComponent extends Component {
    render() {
        const { petList, adopt, returnPet, account  } = this.props;
        
        return (
            <Paper style={styles.paperStyle} >
                <h1>Client View</h1>
                <GridList cellHeight={200} cols={3} >
                    {petList.map( (pet, index) => (
                        <GridListTile key={index} cols={1}>
                            <h2>{ pet.name }</h2>
                            <p>{ pet.breed }</p>
                            <p>${ pet.price }</p>
                            {
                            pet.adopted ?
                            <Button disabled type="submit" value="Adopt">Pet Adopted</Button>
                            :
                            <Button onClick={() => adopt(index)} color="primary" value="Adopt">Adopt</Button>
                            }
                            {
                            (pet.owner === account) ?
                                (<Button
                                  onClick={() => returnPet(index)} 
                                  color="secondary" type="submit"
                                >Return Pet
                                </Button>) 
                                :
                                null
                            }
                        </GridListTile>
                ))}
                </GridList>
        </Paper>
        )
    }
}

export default ClientComponent;

