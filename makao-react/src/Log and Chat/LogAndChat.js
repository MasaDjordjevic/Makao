import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import {blueGrey300} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Chat from '../Log and Chat/Chat';
import Log from  '../Log and Chat/Log';
import ChatInputField from '../Log and Chat/ChatInputField';

class LogAndChat extends React.Component {
    get styles() {
        return {
            container: {
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            },
            title: {
                margin: '5% 0',
                textAlign: 'center',
                fontSize: 14,
                color: blueGrey300,
            },
            chat: {
                alignSelf: 'flex-end',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                    <span style={this.styles.title}>LOG</span>
                    <Divider />

                    <SplitterLayout vertical
                                    percentage={true}
                                    primaryMinSize={2} secondaryMinSize={20}>
                        <Log />
                        <Chat messages={this.props.chatMessages}
                              style={this.styles.chat}/>
                    </SplitterLayout>

                    <ChatInputField onEnter={(m) => this.props.onNewChatMessage(m)}/>
            </div>
        );
    }
}
export default LogAndChat;

LogAndChat.defaultProps = {};

LogAndChat.propTypes = {
    chatMessages: React.PropTypes.array.isRequired,
    onNewChatMessage: React.PropTypes.func,
};