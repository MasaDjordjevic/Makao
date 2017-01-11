import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class SignupForm extends React.Component {

    constructor() {
        super();
        //Ovde se podesavaju svi inputi (key, text, notRequired)
        const inputs = [
            {key: 'username', text: 'Username'},
            {key: 'email', text: 'Email'},
            {key: 'password', text: 'Password'},
            {key: 'confirmPassword', text:'Confirm password'}
        ];

        let keys =  {};
        inputs.map((input, _) => keys[input.key] = "");
        let texts = [];
        inputs.map((input, i) => texts[i] = input.text);
        let notRequired = {};
        inputs.map((input, i) => {input.notRequired && (notRequired[input.key] = true)});
        this.state = {
            inputs: keys,
            texts: texts,
            errors: {...keys},
            notRequired: notRequired,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSignupClick = this.handleSignupClick.bind(this);
    }

    handleInputChange(prop, val) {
        let inputs= this.state.inputs;
        inputs[prop] = val;
        let errors = this.state.errors;
        if (val) {
            errors[prop] = "";
        }
        this.setState({inputs: inputs, errors: errors});
    }

    handleSignupClick() {
        let inputs = this.state.inputs;
        let notRequired = this.state.notRequired;
        let errors = this.state.errors;
        Object.keys(inputs).forEach(function(key,index) {
            if (!inputs[key] && !notRequired[key]) {
                errors[key] = "This field is required.";
            }
        });
        this.setState({errors: errors});
    }

    get styles() {
        return {
            container: {}
        }
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
            </div>
        );
    }
}
export default SignupForm;

SignupForm.defaultProps = {};

SignupForm.propTypes = {};