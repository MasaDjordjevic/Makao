/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import ReactTooltip from 'react-tooltip'

class ChatMessage extends React.Component {
    get styles() {
        return {
            container: {
                alignSelf: this.props.mine ? 'flex-end' : 'flex-start'
            },
        }

    }

    render() {
        return (
            <div style={this.styles.container}>
                {
                    this.props.mine ? "" : <label>{this.props.message.userName}: </label>
                }
                <label>{this.props.message.message}</label>
            </div>
        );
    }
}
export default ChatMessage;

