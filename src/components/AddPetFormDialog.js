import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class AddPetFormDialog extends Component {
    state = {
        name: '',
        breed: '',
        price: '',
    }

    onTextChange = (event) => {
        switch (event.target.id) {
            case 'name':
                this.setState({ name: event.target.value })
                break;
            case 'breed':
                this.setState({ breed: event.target.value})
                break;
            case 'price':
                this.setState({ price: event.target.value})
                break;
            default:
                console.log('You broke me');
        }
    }

    handleAddPet = () => {
        this.props.addPet(
            this.state.name,
            this.state.breed,
            this.state.price
        )
        this.props.closeForm()
    }

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
                      type="Input"
                      fullWidth
                      value={this.state.breed}
                      onChange={this.onTextChange}                     
                    />
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
                    <Button onClick={this.handleAddPet} color="primary">
                    Add
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}