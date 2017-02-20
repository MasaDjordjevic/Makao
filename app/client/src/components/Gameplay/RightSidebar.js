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
            animate: false,
        };

        this.handleShowHide = this.handleShowHide.bind(this);

    }

    handleShowHide() {
        this.setState({show: !this.state.show, animate: true});
    }

    componentWillUpdate(nextProps, nextState) {
        if (!nextState.show) {
            document.getElementById('right-sidebar').firstChild.style.display = 'none';
        }
    }

    componentWillReceiveProps(){
        this.setState({animate: false});
    }

    componentDidUpdate() {
        if (this.state.animate) {
            document.getElementById('right-sidebar').firstChild.style.display = 'none';
            setTimeout(() => {
                document.getElementById('right-sidebar').firstChild.style.display = 'flex';
            }, 100);
        }
    }

    get styles() {
        return {
            container: {
                marginLeft: '0.5%',
                height: '100%',
                willChange: 'width',
                width: this.state.show ? '20%' : 'calc(1% + 24px)',
                transition: 'width 0.5s',
                padding: '0 .5% 1%',

                boxSizing: 'border-box',
                boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',

                backgroundColor: 'white',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'baseline',
            },
        }
    }


    render() {
        return (
            <div style={this.styles.container} id="right-sidebar">
                {
                     this.state.show &&
                     <LogAndChat creatorUsername={this.props.creatorUsername} socket={this.props.socket} />
                }
                <div>
                    <Checkbox
                        style={{marginTop: '50%'}}
                        iconStyle={{marginRight: 0}}
                        checkedIcon={<Visibility />}
                        uncheckedIcon={<VisibilityOff style={{fill: teal900}}/>}
                        onCheck={this.handleShowHide}
                    />
                </div>

            </div>
        );
    }
}


export default RightSidebar;

RightSidebar.defaultProps = {
};
