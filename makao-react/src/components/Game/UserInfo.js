import React from 'react';
import GlobalValues from '../Gameplay/GlobalVariables';
import TimerProgress from './TimerProgress';
import {blueGrey300} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import FastForward from 'material-ui/svg-icons/av/fast-forward';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class UserInfo extends React.Component {
    get styles() {
        const nextIconSize = 50;
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
            },
            userName: {
                color: blueGrey300,
                fontFamily: 'Roboto, sans-serif',
                marginTop: '2%',
                fontSize: 25
            },
            timer: {
                marginTop: '5%',
                width: '100%',
            },
            nextButton:{
                alignSelf: 'center',
                width: '100%',
                height: nextIconSize,
                lineHeight: nextIconSize + 'px',
                margin: '1% 0',
            },
            nextLabel: {
                fontSize: 17
            }
        }
    }

    handleTimeExpiration() {
        alert("isteklo ti je vreme");
    }

    handleNext(){
        alert("sledeci");
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <FlatButton
                    label="next"
                    labelPosition="before"
                    primary={true}
                    onClick={this.handleNext}
                    style={this.styles.nextButton}
                    labelStyle={this.styles.nextLabel}
                    icon={<FastForward />}
                />
                {this.props.myMove &&
                <TimerProgress length={GlobalValues.handLength}
                               style={this.styles.timer}
                               onTimeExpiration={this.handleTimeExpiration}/>
                }
                <span style={this.styles.userName}>{GlobalValues.userName}</span>
            </div>
        );
    }
}
export default UserInfo;

UserInfo.defaultProps = {};

UserInfo.propTypes = {
    myMove: React.PropTypes.bool,
};