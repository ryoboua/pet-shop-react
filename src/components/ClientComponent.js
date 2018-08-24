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
                <GridList cellHeight={300} cols={2} >
                    {petList.map( (pet, index) => (
                        <GridListTile key={index} cols={1}>
                            <div style={{display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-evenly'}} >
                                <img style={{height: '250px', width: '300px'}} src={pet.imageURL} alt={pet.breed} />
                                <div>
                                    <h2>{ pet.name }</h2>
                                    <p>{ pet.breed }</p>
                                    { !pet.adopted ? <p>{ pet.price } Ether + Gas</p> : null }
                                    {
                                    pet.adopted ?
                                    <Button disabled type="submit" value="Adopt">Pet Adopted</Button>
                                    :
                                    <Button onClick={() => adopt(index, pet.price)} color="primary" value="Adopt">Adopt</Button>
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
                                </div>
                            </div>                            
                        </GridListTile>
                ))}
                </GridList>
        </Paper>
        )
    }
}

export default ClientComponent;

