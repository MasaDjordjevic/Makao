/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import TextField from 'material-ui/TextField';


class Chat extends React.Component{

    get styles(){
        return {
            container: {
                width: '100%'
            }
        }
    }

    render(){
        return(
            <div style={this.styles.container}>

                <TextField
                    hintText="Type message"
                    multiLine={true}
                    fullWidth={true}
                    rows={1}
                    rowsMax={3}/>


            </div>
        );
    }
}

export default Chat;