import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import {blueGrey300} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Log from  './Log';
import ChatSocketWrapper from './ChatSocketWrapper'

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
                    <Log creatorUsername={this.props.creatorUsername}
                         socket={this.props.socket}/>
                    <ChatSocketWrapper style={this.styles.chat}/>
                </SplitterLayout>
            </div>
        );
    }
}
export default LogAndChat;

LogAndChat.defaultProps = {};

LogAndChat.propTypes = {};