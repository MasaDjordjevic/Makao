/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Send from 'material-ui/svg-icons/content/send';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
export default class ChatInputField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }

    handleChange(event, value) {
        if (value.charCodeAt(value.length - 1) === 10) { //enter (znam da je ruzno)
            this.sendMessage(value);
        } else {
            this.setState({value: value,});
        }
    };

    handleClick() {
        this.sendMessage(document.getElementById('chat-input').value);
    };

    sendMessage(value){
        this.setState({value: ''});
        const message = value.slice(0, value.length - 1);
        this.props.onEnter(message);
    }

    get styles() {
        return {
            container: {
               display: 'flex',
                flexDirection:'row',
                justifyContent: 'space-between',
                width: '100%',
            },
            buttonContainer: {
                width: 1,
                height: '100%',
                position: 'relative',
            },
            button: {
                position: 'absolute',
                top: 12,
                right: 0,
            }
        }
    }

    render() {
        return (
            <div style={this.styles.container}>
                <TextField
                    id="chat-input"
                    hintText=""
                    multiLine={true}
                    fullWidth={true}
                    rows={2}
                    rowsMax={2}
                    onChange={(event, value) => this.handleChange(event, value)}
                    value={this.state.value}
                />
                <div style={this.styles.buttonContainer} >
                    <IconButton style={this.styles.button} onClick={(e)=>this.handleClick(e)} iconStyle={{color: 'rgba(0, 0, 0, 0.33)'}}>
                        <Send />
                    </IconButton>
                </div>
            </div>
        );
    }
}
ChatInputField.propTypes = {
    onEnter: React.PropTypes.func,
};
