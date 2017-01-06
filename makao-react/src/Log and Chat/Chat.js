/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import ChatMessage from './ChatMessage';
import ReactDOM from 'react-dom'
import GlobalVariables from '../Gameplay/GlobalVariables';

class Chat extends React.Component{
    componentWillUpdate(){
        const node = ReactDOM.findDOMNode(this).parentElement;
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    }

    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this).parentElement;
        node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
    }

    get styles(){
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'flex-end',

            },
            messagesContainer: {
                display: 'flex',
                flexDirection: 'column',
            }
        }
    }

    render(){
        return(
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.messagesContainer}>
                {
                    this.props.messages.map((message, index)=>
                        <ChatMessage key={index} message={message} mine={GlobalVariables.userId === message.userId}/>
                    )
                }
                </div>
            </div>
        );
    }
}

Chat.defaultProps = {
    userName: "masa"
};

Chat.PropTypes = {
    userName: React.PropTypes.string,
};

export default Chat;