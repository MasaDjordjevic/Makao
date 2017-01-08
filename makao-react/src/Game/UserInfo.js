import React from 'react';
import GlobalValues from '../Gameplay/GlobalVariables';
import TimerProgress from './TimerProgress';
import {blueGrey300} from 'material-ui/styles/colors'

class UserInfo extends React.Component {
    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column'
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
        }
    }

    handleTimeExpiration() {
        alert("isteklo ti je vreme");
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
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