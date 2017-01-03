/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import TextField from 'material-ui/TextField';

class Chat extends React.Component{

    render(){
        return(
            <div>
                <TextField
                    hintText="Type message"
                    multiLine={true}
                    rows={2}
                    rowsMax={4}/>
                <br />
            </div>
        );
    }
}

export default Chat;