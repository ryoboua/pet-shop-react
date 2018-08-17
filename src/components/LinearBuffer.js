import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';


const styles = {
  root: {
    flexGrow: 1,
  },
};

class LinearBuffer extends React.Component {
  timer = null;

  state = {
    completed: 0,
    buffer: 10,
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { completed } = this.state;
    if (completed > 100) {
        this.props.loadingComplete() 
    } else {
      const diff = Math.random() * 50;
      //const diff2 = Math.random() * 10;
      this.setState({ completed: completed + diff});
    }
  };

  render() {
    
    const { classes } = this.props;
    const { completed, buffer } = this.state;
    return (
    <div style={{textAlign: 'center', paddingTop: '150px'}} >
        <h1>Loading Pet Store...</h1>
        <div className={classes.root}>
            <LinearProgress color="secondary" variant="buffer" value={completed} valueBuffer={buffer} />
        </div>  
    </div>
      
    );
  }
}

LinearBuffer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearBuffer);
