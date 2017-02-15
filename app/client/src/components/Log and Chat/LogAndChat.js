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
    constructor(){
        super();

        this.state= {
            me: AuthStore.getState().user,
            chatMessages: [
                {
                    username: "Nemanja",
                    time: "2:45",
                    message: "zdravo"
                },
                {
                    username: "Darko",
                    time: "1:50",
                    message: "poz"
                },
                {
                    username: "Nikolica",
                    time: "2:35",
                    message: "poruka"
                },
                {
                    username: "Jajac",
                    time: "2:38",
                    message: "13"
                },
            ]
        }

        this.handleSocketMessageReceived = this.handleSocketMessageReceived.bind(this);
    }

    onNewChatMessage(message){
        this.handleNewMessage(message, this.state.me.username);
        socket.emit('send:message', {
            message: message,
            username: this.state.me.username,
        })
    }

    handleNewMessage(message, name) {
        const time = new Date();
        const newMessage = {
            username: name ? name : this.state.me.username,
            time: time.getHours() + ":" + time.getMinutes(),
            message: message,
        };
        const chatMessages = [...this.state.chatMessages, newMessage];
        this.setState({chatMessages: chatMessages});
        document.getElementById('chat-input').value = null;
    }

    handleSocketMessageReceived(data){
        this.handleNewMessage(data.message, data.username);
    }

    componentDidMount(){
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

LogAndChat.propTypes = {
};