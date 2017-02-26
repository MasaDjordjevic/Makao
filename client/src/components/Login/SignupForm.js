import _ from 'lodash';
import React from 'react';
import {browserHistory} from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AuthActions from '../../actions/AuthActions';
import AuthStore from '../../stores/AuthStore';
import Snackbar from 'material-ui/Snackbar';

class SignupForm extends React.Component {

    constructor() {
        super();
        //Ovde se podesavaju svi inputi (key, text, required)
        const inputs = [
            {key: 'username', text: 'Username', required: true},
            {key: 'email', text: 'Email', required: true},
            {key: 'password', text: 'Password', required: true},
            {key: 'confirmPassword', text: 'Confirm password', required: true}
        ];

        let keys = {};
        _.forEach(inputs, (input) => keys[input.key] = "");
        let texts = [];
        _.forEach(inputs, (input, i) => texts[i] = input.text);
        let required = {};
        _.forEach(inputs, (input) => {
            input.required && (required[input.key] = true)
        });
        this.state = {
            inputs: keys,
            texts: texts,
            errors: {...keys},
            required: required,
            signupResponse: AuthStore.getState(),
            showResponse: false
        };

        this.onChange = this.onChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSignupClick = this.handleSignupClick.bind(this);
        this.handleSnackbarClosing = this.handleSnackbarClosing.bind(this);
    }

    onChange() {
        this.setState({signupResponse: AuthStore.getState()});
        if (!this.state.signupResponse.success) {
            this.setState({showResponse: true});
        } else {
            browserHistory.push('/home');
        }
    }

    componentDidMount() {
        AuthStore.listen(this.onChange);
    }

    componentWillUnmount() {
        AuthStore.unlisten(this.onChange);
    }

    handleInputChange(prop, val) {
        let inputs = this.state.inputs;
        inputs[prop] = val;
        let errors = this.state.errors;
        if (val) {
            errors[prop] = "";
        }
        this.setState({inputs: inputs, errors: errors});
    }

    handleSignupClick() {
        let inputs = this.state.inputs;
        let required = this.state.required;
        let errors = this.state.errors;
        let errNo = 0;
        Object.keys(inputs).forEach(function (key, index) {
            if (!inputs[key] && required[key]) {
                errNo++;
                errors[key] = "This field is required.";
            }
        });
        if (inputs.confirmPassword && inputs.password !== inputs.confirmPassword) {
            errNo++;
            errors.confirmPassword = "Must be same as password."
        }
        this.setState({errors: errors});

        if (errNo === 0) {
            AuthActions.trySignup(this.state.inputs);
        }
    }

    get styles() {
        return {
            container: {}
        }
    }

    handleSnackbarClosing() {
        this.setState({showResponse: false});
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                {
                    Object.keys(this.state.inputs).map((key, i) =>
                        <TextField
                            key={key}
                            onChange={(e, v) => this.handleInputChange(key, v)}
                            errorText={this.state.errors[key]}
                            floatingLabelText={this.state.texts[i]}/>
                    )
                }
                <br/>
                <RaisedButton label="sign up"
                              fullWidth={true}
                              primary={true}
                              onClick={this.handleSignupClick}/>

                <Snackbar
                    open={this.state.showResponse}
                    message={this.state.signupResponse.message}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClosing}/>
            </div>
        );
    }
}
export default SignupForm;

SignupForm.defaultProps = {};

SignupForm.propTypes = {};