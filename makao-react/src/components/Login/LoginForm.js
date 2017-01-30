import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import LoginActions from '../../actions/LoginActions';
import LoginStore from '../../stores/LoginStore';
import Snackbar from 'material-ui/Snackbar';

class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            emailError: "",
            passwordError: "",
            email: "",
            password: "",
            loginResponse: LoginStore.getState().response,
            showResponse: false,
        };

        this.onChange = this.onChange.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleSnackbarClosing = this.handleSnackbarClosing.bind(this);
    }

    onChange(res) {
        this.setState({loginResponse: res.response, showResponse: true});
    }

    componentDidMount() {
        LoginStore.listen(this.onChange);
    }

    componentWillUnmount() {
        LoginStore.unlisten(this.onChange());
    }

    handleLoginClick() {
        let errNo = 0;
        if (!this.state.email) {
            errNo++;
            this.setState({emailError: "This field is required."})
        }
        if (!this.state.password) {
            errNo++;
            this.setState({passwordError: "This field is required."})
        }

        let params = {email: this.state.email, password: this.state.password};
        if (errNo === 0) {
            console.log(params);
        }

        LoginActions.login(params);
    }

    handleInputChange(prop, val) {
        let obj = {};
        obj[prop] = val;
        if (val) {
            obj[prop + "Error"] = "";
        }
        this.setState(obj);
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


                <Snackbar
                    open={this.state.showResponse}
                    message={this.state.loginResponse}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClosing}
                />


            </div>
        );
    }
}
export default LoginForm;

LoginForm.defaultProps = {};

LoginForm.propTypes = {};