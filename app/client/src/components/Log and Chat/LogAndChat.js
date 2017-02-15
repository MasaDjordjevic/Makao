import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import {blueGrey300} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Chat from '../Log and Chat/Chat';
import Log from  '../Log and Chat/Log';
import ChatInputField from '../Log and Chat/ChatInputField';
import AuthStore from '../../stores/AuthStore';

import io from 'socket.io-client';
var socket = io('http://localhost:3001/chat');
class LogAndChat extends React.Component {
    constructor() {
        super();

        this.state = {
            me: AuthStore.getState().user,
            chatMessages: [],
        };

        this.handleSocketMessageReceived = this.handleSocketMessageReceived.bind(this);
        this.handleSocketInit = this.handleSocketInit.bind(this);
    }

    padLeft(txt, padLen = 2) {
        let pad = new Array(1 + padLen).join('0');
        return (pad + txt).slice(-padLen);
    }

    onNewChatMessage(message) {
        const time = new Date();
        let newMessage = {
            message: message,
            username: this.state.me.username,
            time: this.padLeft(time.getHours()) + ":" + this.padLeft(time.getMinutes()),
        };
        this.handleNewMessage(newMessage);
        document.getElementById('chat-input').value = null;

        socket.emit('send:message', newMessage);
    }

    handleNewMessage(newMessage) {
        const chatMessages = [...this.state.chatMessages, newMessage];
        this.setState({chatMessages: chatMessages});
    }

    handleSocketInit(messages) {
        debugger;
        const chatMessages = [...this.state.chatMessages, ...messages];
        this.setState({chatMessages: chatMessages});
    }

    handleSocketMessageReceived(data) {
        this.handleNewMessage(data.message);
    }

    componentDidMount() {
        socket.emit('subscribe', this.props.creatorUsername, this.state.me.username);
        socket.on('init', this.handleSocketInit);
        socket.on('send:message', this.handleSocketMessageReceived);
    }


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
                    <Chat messages={this.state.chatMessages}
                          style={this.styles.chat}/>
                </SplitterLayout>

                <ChatInputField onEnter={(m) => this.onNewChatMessage(m)}/>
            </div>
        );
    }
}
export default LogAndChat;

LogAndChat.defaultProps = {};

LogAndChat.propTypes = {};