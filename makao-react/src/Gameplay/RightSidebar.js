/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import {teal900} from 'material-ui/styles/colors';

import LogAndChat from '../Log and Chat/LogAndChat';

class RightSidebar extends React.Component {
    constructor() {
        super();
        this.state = {
            show: true,
        };

        this.handleShowHide = this.handleShowHide.bind(this);

    }

    handleShowHide() {
        this.setState({show: !this.state.show});
    }

    componentWillUpdate(nextProps, nextState) {
       if (!nextState.show) {
           document.getElementById('right-sidebar').firstChild.style.display = 'none';
        }
    }
    componentDidUpdate() {
        if (this.state.show) {
            document.getElementById('right-sidebar').firstChild.style.display = 'none';
            setTimeout(() => {
                document.getElementById('right-sidebar').firstChild.style.display = 'flex';
            }, 50);
        }
    }

    get styles() {
        return {
            container: {
                marginLeft: '0.5%',
                height: '100%',
                willChange: 'transform',
                //transform: this.state.show ? 'translateX(0)' : 'translateX(calc(80% - 24px))',
                width: this.state.show ? '20%' : 'calc(1% + 24px)',
                //transition: this.state.show ? 'transform 0.5s' : "",
                transition: 'width 0.5s',
                padding: '0 .5% 1%',

                boxSizing: 'border-box',
                boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',

                backgroundColor: 'white',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
        }
    }


    render() {
        return (
            <div style={this.styles.container} id="right-sidebar">
                    {
                        this.state.show &&
                        <LogAndChat
                            chatMessages={this.props.chatMessages}
                            onNewChatMessage={(m) => this.props.onNewChatMessage(m)}/>
                    }
                    <Checkbox
                        style={{marginTop: '5%'}}
                        checkedIcon={<Visibility />}
                        uncheckedIcon={<VisibilityOff style={{fill: teal900}}/>}
                        onCheck={this.handleShowHide}
                    />

            </div>
        );
    }
}


export default RightSidebar;

RightSidebar.defaultProps = {
    chatMessages: React.PropTypes.array,
    onNewChatMessage: React.PropTypes.func,
};