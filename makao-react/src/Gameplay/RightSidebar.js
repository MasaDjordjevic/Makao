/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import SplitterLayout from 'react-splitter-layout';


import {blueGrey300} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Chat from '../Chat/Chat';
import Log from  '../Game/Log';
import ChatInputField from '../Chat/ChatInputField';

class RightSidebar extends React.Component {
    constructor() {
        super();
        this.state = {
            show: true,
            messages: [
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
        this.handleShowHide = this.handleShowHide.bind(this);

    }

    handleShowHide() {
        this.setState({show: !this.state.show});
    }

    handleNewMessage(message) {

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

    get styles() {
        return {
            wrapper: {
                width: '20%',
                height: '100%',
                overflow: 'hidden',

            },
            container: {
                marginLeft: '5%',
                height: '100%',
                transform: this.state.show ? '' : 'translateX(calc(94% - 24px))',
                transition: 'transform 0.5s',
                padding: '0 3% 2%',

                boxSizing: 'border-box',
                boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',

                backgroundColor: 'white',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',

            },
            contentContainer: {
                height: '100%',
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
            <div style={this.styles.wrapper}>
                <div style={this.styles.container}>

                    {
                        this.state.show &&
                        <div style={this.styles.contentContainer}>
                            <span style={this.styles.title}>LOG</span>
                            <Divider />

                            <SplitterLayout vertical
                                            percentage={true}
                                            primaryMinSize={2} secondaryMinSize={20}>
                                <Log />
                                <Chat userId={this.props.userId}
                                      messages={this.state.messages}
                                      style={this.styles.chat}/>
                            </SplitterLayout>

                            <ChatInputField onEnter={(m) => this.handleNewMessage(m)}/>
                        </div>
                    }
                    <Checkbox
                        style={{marginTop: '5%'}}
                        checkedIcon={<Visibility />}
                        uncheckedIcon={<VisibilityOff />}
                        onCheck={this.handleShowHide}
                    />

                </div>
            </div>

        );
    }
}


export default RightSidebar;