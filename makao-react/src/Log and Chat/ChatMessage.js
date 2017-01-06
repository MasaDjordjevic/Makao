/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';

import DefaultTooltip from '../DefaultTooltip';
import {blueGrey300, teal800} from 'material-ui/styles/colors';

class ChatMessage extends React.Component {
    get styles() {
        return {
            container: {
                alignSelf: this.props.mine ? 'flex-end' : 'flex-start',
                textAlign: this.props.mine ? 'right' : 'left',
                color: this.props.mine ? teal800 : 'black',
                marginTop: '3%'
            },
            userName: {
                color: blueGrey300,
            }

        }

    }

    render() {
        return (
            <div style={this.styles.container}>
                <DefaultTooltip tooltip={this.props.message.time} tooltipPosition={this.props.mine ? 'top-left' : 'top-center'}>

                        {
                            !this.props.mine &&
                                <label style={this.styles.userName}>{this.props.message.userName}: </label>
                        }
                        <label>{this.props.message.message}</label>

                </DefaultTooltip>
            </div>
        );
    }
}
export default ChatMessage;

ChatMessage.propTypes = {
    mine: React.PropTypes.bool,
    message: React.PropTypes.object.isRequired,
};