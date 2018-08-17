import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AppContext } from '../App.js'


export default class AddPetFormDialog extends Component {
    state = {
        name: '',
        price: '',
    }

    onTextChange = event => {
        switch (event.target.id) {
            case 'name':
                this.setState({ name: event.target.value })
                break;
            case 'price':
                this.setState({ price: event.target.value})
                break;
            default:
                console.log('You broke me');
        }
    }

    AddPetButton = () => (
        <AppContext.Consumer>
            {appState => {
                const { name, price } = this.state;
                const { breed, image } = this.props.dog
                return (
                    <Button 
                        color="primary"
                        onClick={() => {
                            appState.handleCreatePet(name, breed, price, image)
                            return this.props.closeForm()
                            }
                        }
                    >
                     Add
                    </Button>
                    )
                } 
            }
        </AppContext.Consumer>

    )
    render() {
        return (
            <Dialog
             open={this.props.showForm}
             onClose={this.props.closeForm}
            >
                <DialogTitle>Add Pet to Store</DialogTitle>
                <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Name"
                      type="Input"
                      fullWidth
                      value={this.state.name}
                      onChange={this.onTextChange}
                    />
                    <TextField
                      margin="dense"
                      id="breed"
                      label="Breed"
                      disabled={true}
                      type="Input"
                      fullWidth
                      value={this.props.dog.breed}
                    />
                    <div style={{textAlign: 'center'}} >
                        <img style={{height: '250px', width: '300px'}} src={this.props.dog.image} alt={this.props.dog.breed} />
                    </div>
                    <TextField
                      margin="dense"
                      id="price"
                      label="Price to adopt"
                      type="Input"
                      fullWidth
                      value={this.state.price}
                      onChange={this.onTextChange}                     
                    />                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.closeForm} color="primary">
                    Cancel
                    </Button>
                    {this.AddPetButton()}
                </DialogActions>
            </Dialog>
        )
    }
}