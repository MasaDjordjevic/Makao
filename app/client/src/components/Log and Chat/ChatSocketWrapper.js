import React from 'react';
import ReactDOM from 'react-dom';
import UserStore from '../../stores/UserStore';
import io from 'socket.io-client';
import Auth from '../../Auth';
import Chat from './Chat';
import ChatInputField from './ChatInputField';

var socket;

class ChatSocketWrapper extends React.Component {
    constructor() {
        super();

        this.state = {
            me: UserStore.getState(),
            chatMessages: [],
        };

        this.handleSocketInit = this.handleSocketInit.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
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
        const chatMessages = [...this.state.chatMessages, ...messages];
        this.setState({chatMessages: chatMessages});
    }

    componentDidMount() {
        socket = io('/chat');
        socket.emit('authenticate', {token: Auth.getToken()});
        socket.on('authenticated', () => {
            socket.emit('subscribe', this.props.creatorUsername, this.state.me.username);
            socket.on('init', this.handleSocketInit);
            socket.on('send:message', this.handleNewMessage);
        });
        socket.on('unauthorized', () => alert('nope'));
    }

    componentWillUpdate() {
        const node = ReactDOM.findDOMNode(this).parentElement;
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    }

    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this).parentElement;
        node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
    }

    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Chat messages={this.state.chatMessages}
                      />
                <ChatInputField onEnter={(m) => this.onNewChatMessage(m)}/>
            </div>
        );
    }
}
export default ChatSocketWrapper;

ChatSocketWrapper.defaultProps = {};

ChatSocketWrapper.propTypes = {};