/**
 * Created by Masa on 03-Jan-17.
 */

import React from 'react';
import Chat from './Chat';

export default class ChatWrapper extends React.Component{
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