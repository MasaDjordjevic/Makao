/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import ChatMessage from './ChatMessage';
import ReactDOM from 'react-dom';
import UserStore from '../../stores/UserStore';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            me: UserStore.getState(),
        }
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
                height: '100%',
                justifyContent: 'flex-end',

            },
            messagesContainer: {
                display: 'flex',
                flexDirection: 'column',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.messagesContainer}>
                    {
                        this.props.messages.map((message, index) =>
                            <ChatMessage key={index} message={message}
                                         mine={this.state.me.username === message.username}/>
                        )
                    }
                </div>
            </div>
        );
    }
}

Chat.defaultProps = {};

Chat.PropTypes = {
    messages: React.PropTypes.array.isRequired,
};

export default Chat;