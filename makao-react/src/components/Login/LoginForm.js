import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


class LoginForm extends React.Component {
    constructor(){
        super();
        this.state= {
            emailError: "",
            passwordError: "",
            email: "",
            password: "",
        };

        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    handleLoginClick() {
        let errNo = 0;
        if(!this.state.email){
            errNo++;
            this.setState({emailError: "This field is required."})
        }
        if(!this.state.password){
            errNo++;
            this.setState({passwordError: "This field is required."})
        }

        let params = {email: this.state.email, password: this.state.password};
        if(errNo === 0){
            console.log(params);
        }

        fetch('/test', {
            method: 'get'
        }).then(function(response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
        }).catch(function(err) {
            // Error :(
        });

        fetch('/test2', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
        }).catch(function(err) {
            // Error :(
        });

    }

    handleInputChange(prop, val){
        let obj = {};
        obj[prop] = val;
        if(val){
            obj[prop+"Error"] = "";
        }
        this.setState(obj);
    }

    get styles() {
        return {
            container: {}
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <TextField
                    value={this.state.email}
                    floatingLabelText="Email"
                    errorText={this.state.emailError}
                    autoFocus
                    onChange={(e, v) => this.handleInputChange('email', v)}/>
                <br />
                <TextField
                    value={this.state.password}
                    floatingLabelText="Password"
                    type="password"
                    errorText={this.state.passwordError}
                    onChange={(e, v) => this.handleInputChange('password', v)}/>
                <br />

                <RaisedButton label="log in"
                              fullWidth={true}
                              primary={true}
                              onClick={this.handleLoginClick}/>
            </div>
        );
    }
}
export default LoginForm;

LoginForm.defaultProps = {};

LoginForm.propTypes = {};