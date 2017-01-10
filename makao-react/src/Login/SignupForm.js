import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class SignupForm extends React.Component {
    get styles() {
        return {
            container: {}
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <TextField
                    floatingLabelText="Username"
                /><br />
                <TextField
                    floatingLabelText="Email"
                /><br />
                <TextField
                    floatingLabelText="Password"
                    type="password"
                /><br />
                <TextField
                    floatingLabelText="Confirm password"
                    type="password"
                /><br />

                <RaisedButton label="sign up" fullWidth={true} primary={true}/>
            </div>
        );
    }
}
export default SignupForm;

SignupForm.defaultProps = {};

SignupForm.propTypes = {};