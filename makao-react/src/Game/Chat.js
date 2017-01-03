/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
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
        }
    }

    get styles(){
        return {
            container: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',

            }
        }
    }

    render(){
        return(
            <div style={this.styles.container}>
                {
                    this.state.messages.map((message, index)=>
                        <ChatMessage key={index} message={message} mine={this.props.userId === message.userId}/>
                    )
                }
                <TextField
                    id="chat-input"
                    hintText=""
                    multiLine={true}
                    fullWidth={true}
                    rows={1}
                    rowsMax={3}/>


            </div>
        );
    }
}

Chat.defaultProps = {

};

Chat.PropTypes = {
    userId: React.PropTypes.number,
};

export default Chat;