import React from 'react';
import Radium from 'radium';

import Logo from './Logo';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import {Tabs, Tab} from 'material-ui/Tabs';
import {grey400, grey500} from 'material-ui/styles/colors';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            heights: [220.46, 406.46], //-88.37
        };
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
                background: '#fafafa',
                border: '1px solid #ebebeb',
                boxShadow: 'rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px',
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
                fontSize: '70px',
                color: grey500,
                marginLeft: 90,
                fontWeight: 300,
                fontFamily: 'Roboto Condensed'
            },
            logoWrapper: {
                height: 100,
                width: 309.13,
                marginBottom: '1%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }
        }
    }

    handleChange = (value) => {
        this.setState({
            index: this.state.index + 1,
        });
    };

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.logoWrapper}>
                    <Logo style={this.styles.logo}/>
                    <label style={this.styles.title}>MAKAO</label>
                </div>
                <Tabs contentContainerStyle={{padding: '5% 10% 7% 10%'}}
                      onChange={this.handleChange}
                      style={this.styles.tabs}>
                    <Tab label="LOG IN">
                        <LoginForm style={this.styles.form}/>
                    </Tab>
                    <Tab label="SIGN UP">
                        <SignupForm style={this.styles.form}/>
                    </Tab>
                </Tabs>
            </div>
        )
            ;
    }
}
export default Radium(Login);

Login.defaultProps = {};

Login.propTypes = {};