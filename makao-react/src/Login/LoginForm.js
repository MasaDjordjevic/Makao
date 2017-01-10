import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


class LoginForm extends React.Component {
    get styles() {
        return {
            container: {
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>

                <TextField
                    floatingLabelText="Email"
                /><br />
                <TextField
                    floatingLabelText="Password"
                    type="password"
                /><br />


                <RaisedButton label="log in" fullWidth={true} primary={true}/>

            </div>
        );
    }
}
export default LoginForm;

LoginForm.defaultProps = {};

LoginForm.propTypes = {};