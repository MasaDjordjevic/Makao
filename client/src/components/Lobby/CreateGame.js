import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Rules from './Rules';
import Snackbar from 'material-ui/Snackbar';

class CreateGame extends React.Component {
    constructor() {
        super();
        this.state = {
            stepIndex: 0,
            rules: {},
            snackbarMessage: '',
            snackbarOpen: false,
        };

        this.handleCreateGame = this.handleCreateGame.bind(this);
        this.handleRuleChange = this.handleRuleChange.bind(this);
    }

    handleCreateGame() {
        this.props.onCreate(this.state.rules);
    }

    handleRuleChange(rules) {
        this.setState({rules: rules});
    }

    handleSnackbarClosing = () => {
        this.setState({snackbarOpen: false});
    };

    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
            },
            navigation: {
                marginTop: 12,
                display: 'flex',
                justifyContent: 'flex-end'
            },
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Rules onChange={this.handleRuleChange}/>
                <div style={this.styles.navigation}>
                    <RaisedButton
                        label="Create game"
                        onTouchTap={this.handleCreateGame}
                        primary={true}
                    />
                </div>

                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClosing}/>
            </div>
        );
    }
}
export default CreateGame;

CreateGame.defaultProps = {};

CreateGame.propTypes = {};
