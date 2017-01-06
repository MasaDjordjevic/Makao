/**
 * Created by Masa on 03-Jan-17.
 */

import React from 'react';
import ReactDOM from 'react-dom'

import Chat from './Chat';

export default class ChatWrapper extends React.Component{
    componentWillUpdate(){
        const node = ReactDOM.findDOMNode(this);
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    }

    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this);
        node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
        ReactDOM.findDOMNode(this).scrollTop = 0;

    }
    render(){
        return(
            <div style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'column'}}>
                <Chat userId={this.props.userId} />
             </div>
        );
    }
}