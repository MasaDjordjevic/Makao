import React from 'react';
import Radium from 'radium';
import Logo from './Logo';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import {Tabs, Tab} from 'material-ui/Tabs';
import {grey500, teal900} from 'material-ui/styles/colors';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            heights: [220.46, 345], //-88.37
        };

        this.handleChange = this.handleChange.bind(this);
    }

    get styles() {
        return {
            container: {
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            },
            logo: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            tabs: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            form: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                boxSizing: 'border-box',
                height: this.state.heights[this.state.index % 2],
                overflow: 'hidden',
                transition: 'all 0.5s'
            },
            title: {
                fontSize: '63px',
                color: grey500,
                marginLeft: -10,
                fontWeight: 300,
            },
            logoWrapper: {
                height: 100,
                width: 375,
                marginBottom: '7%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            wrapper: {
                backgroundColor: 'rgb(250, 250, 250)',
                border: '1px solid #ebebeb',
                boxShadow: 'rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px',
            }
        }
    }

    handleChange() {
        this.setState({
            index: this.state.index + 1,
        });
    };

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.wrapper}>
                    <div style={this.styles.logoWrapper}>
                        <Logo style={this.styles.logo}/>
                        <span style={this.styles.title}>MAKAO</span>
                    </div>
                    <Tabs contentContainerStyle={{padding: '5% 10% 7% 10%'}}
                          onChange={this.handleChange}
                          style={this.styles.tabs}
                          inkBarStyle={{backgroundColor: teal900}}>
                        <Tab label="LOG IN">
                            <LoginForm style={this.styles.form}/>
                        </Tab>
                        <Tab label="SIGN UP">
                            <SignupForm style={this.styles.form}/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
            ;
    }
}
export default Radium(Login);

Login.defaultProps = {};

Login.propTypes = {};
