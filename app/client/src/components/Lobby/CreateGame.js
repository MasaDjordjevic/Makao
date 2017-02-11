import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import RulesSetter from './Rules';

class CreateGame extends React.Component {
    constructor() {
        super();
        this.state = {
            stepIndex: 0,
            rules: {},
            friends: [],
        };

        this.handleCreateGame = this.handleCreateGame.bind(this);
        this.handleRuleChange = this.handleRuleChange.bind(this);

    }

    handleCreateGame() {
        console.log(this.state.rules);
    }

    handleRuleChange(rules) {
        this.setState({rules: rules});
    }


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
            </div>
        );
    }
}
export default CreateGame;

CreateGame.defaultProps = {};

CreateGame.propTypes = {};
