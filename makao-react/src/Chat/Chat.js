/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import ChatInputField from './ChatInputField';
import ChatMessage from './ChatMessage';

class Chat extends React.Component{
    constructor(){
        super();
        this.state = {
            messages:[
                {
                    userId: 3,
                    userName: "Nemanja",
                    time: "2:45",
                    message: "zdravo"
                },
                {
                    userId: 2,
                    userName: "Darko",
                    time: "1:50",
                    message: "poz"
                },
                {
                    userId: 1,
                    userName: "Nikolica",
                    time: "2:35",
                    message: "poruka"
                },
                {
                    userId: 4,
                    userName: "Jajac",
                    time: "2:38",
                    message: "13"
                },
            ]
        };

        this.handleNewMessage = this.handleNewMessage.bind(this);
    }

    get styles(){
        return {
            container: {
                width: '100%',
                overflowY: 'visible',
                display: 'flex',
                flexDirection: 'column',

            }
        }
    }

    handleNewMessage(message){

        const time = new Date();
        const newMessage = {
            userId: this.props.userId,
            userName: this.props.userName,
            time: time.getHours() + ":" + time.getMinutes(),
            message: message,
        };
        const messages = [...this.state.messages, newMessage];
        this.setState({messages: messages});
        document.getElementById('chat-input').value = null;


    }

    render(){
        return(
            <div style={this.styles.container}>
                {
                    this.state.messages.map((message, index)=>
                        <ChatMessage key={index} message={message} mine={this.props.userId === message.userId}/>
                    )
                }
             <ChatInputField onEnter={(m) => this.handleNewMessage(m)}/>
            </div>
        );
    }
}

Chat.defaultProps = {
    userName: "masa"
};

Chat.PropTypes = {
    userId: React.PropTypes.number,
    userName: React.PropTypes.string,
};

export default Chat;