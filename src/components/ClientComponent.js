import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import styles from '../styles.js'

class ClientComponent extends Component {
    render() {
        return (
            <Paper style={styles.paperStyle} >
                <GridList cellHeight={160} cols={3} >
                    {this.props.dogList.map( (dog, index) => (
                        <GridListTile key={index} cols={1}>
                            <h2>{ dog.name }</h2>
                            <p>{ dog.breed }</p>
                            {
                            (this.props.adopters[index] !== '0x0000000000000000000000000000000000000000')
                            ?
                            <Button disabled type="submit" value="Adopt">Pet Adopted</Button>
                            :
                            <Button color="primary" value="Adopt">Adopt</Button>
                            }

                            {
                            (this.props.adopters[index] === this.props.account) ?
                                (<Button color="secondary" type="submit" >Return Pet</Button>) 
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

