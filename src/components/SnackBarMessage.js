import React , { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

class SnackBarMessage extends Component {
    render() {
        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.props.showSnackBarMessage}
                    autoHideDuration={4000}
                    onExit={this.props.clearEventData}
                    onExited={this.props.proccessMessageQueue}
                    onClose={this.props.hideSnackBarMessage}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{ this.props.eventData.event }</span>}
                    action={[
                        <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.props.hideSnackBarMessage}
                        >
                        <Close />
                        </IconButton>,
                    ]}
                />
            </div>
        )
    }
}

export default SnackBarMessage;