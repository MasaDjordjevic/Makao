import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import RulesSetter from './Rules';
import Snackbar from 'material-ui/Snackbar';
import GameActions from '../../actions/GameActions';
import AuthStore from '../../stores/AuthStore';
import { browserHistory } from 'react-router';


class CreateGame extends React.Component {
    constructor() {
        super();
        this.state = {
            stepIndex: 0,
            rules: {},
            friends: [],

            snackbarMessage: '',
            snackbarOpen: false,
        };

        this.handleCreateGame = this.handleCreateGame.bind(this);
        this.handleRuleChange = this.handleRuleChange.bind(this);

    }

    handleCreateGame() {
        GameActions.createGame(this.state.rules, (status)=> {
            if(status){
                browserHistory.push('/game:' + AuthStore.getState().getUsername());
            }else{
                this.setState({snackbarMessage: 'Kreiranje igre nije uspelo', snackbarOpen: true});
            }
        });
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
                <RulesSetter onChange={this.handleRuleChange}/>
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
