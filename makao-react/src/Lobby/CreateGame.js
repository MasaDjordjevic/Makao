import React from 'react';
import {
    Step,
    Stepper,
    StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import RulesSetter from './RulesSetter';
import FriendPicker from './FriendPicker';

class CreateGame extends React.Component {
    constructor() {
        super();
        this.state = {
            stepIndex: 0,
            rules: {},
            friends: [],
        };

        this.handleGoto = this.handleGoto.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleCreateGame = this.handleCreateGame.bind(this);
        this.handleRuleChange = this.handleRuleChange.bind(this);
        this.handleFriendPick = this.handleFriendPick.bind(this);
        this.handlePlayWithFriends = this.handlePlayWithFriends.bind(this);
    }



    handleCreateGame(){
        console.log(this.state.rules);
    }

    handlePlayWithFriends(){
        console.log(this.state.rules);
        console.log(this.state.friends);
    }



    handleRuleChange(rules){
        this.setState({rules: rules});
    }

    handleFriendPick(picked){
        this.setState({friends:picked});
    }

    handleGoto = (step) => {
        this.setState({stepIndex: step});
    };

    handleNext = () => {
        const stepIndex = this.state.stepIndex;
        if (stepIndex < 2) {
            this.setState({stepIndex: stepIndex + 1});
        }
    };

    handlePrev = () => {
        const stepIndex = this.state.stepIndex;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return 'Rules';
            case 1:
                return 'Friends';
            default:
                return 'You\'re a long way from home sonny jim!';
        }
    }

    getStepOptions(stepIndex) {
        switch (stepIndex) {
            case 0:
                return <div style={this.styles.navigation}>
                    <RaisedButton
                        label="Create game"
                        onTouchTap={this.handleCreateGame}
                        primary={true}
                    />
                    <FlatButton
                        label="Play with friends"
                        onTouchTap={this.handleNext}
                        style={this.styles.buttonMargin}
                    />
                </div>;
            case 1:
                return <div style={this.styles.navigation}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev}
                    />
                    <RaisedButton
                        label="Play with friends"
                        primary={true}
                        onTouchTap={this.handlePlayWithFriends}
                        style={this.styles.buttonMargin}
                    />
                </div>;

        }
    }

    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
            },
            navigation: {
                marginTop: 12,
                display: 'flex',
                justifyContent: 'space-between'

            },
            buttonMargin: {
                marginLeft: 10,
            }
        }
    }

    render() {
        const stepIndex = this.state.stepIndex;

        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Stepper linear={false} activeStep={stepIndex}>
                    <Step>
                        <StepButton onClick={() => this.handleGoto(0)}>
                            Rules
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.handleGoto(1)}>
                            Friends
                        </StepButton>
                    </Step>
                </Stepper>
                <div >
                    <p>{this.getStepContent(stepIndex)}</p>
                    {this.getStepOptions(stepIndex)}
                </div>
            </div>
        );
    }
}
export default CreateGame;

CreateGame.defaultProps = {};

CreateGame.propTypes = {};