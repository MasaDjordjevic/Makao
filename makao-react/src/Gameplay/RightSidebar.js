/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import SplitterLayout from 'react-splitter-layout';


import ChatWrapper from '../Chat/ChatWrapper';
import Log from '../Game/Log'

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

    get styles() {
        return {
            wrapper: {
                width: '20%',
                height: '100%',
                overflow: 'hidden',

            },
            container: {
                marginLeft: '5%',
                height: '100%',
                transform: this.state.show ? '' : 'translateX(calc(94% - 24px))',
                transition: 'transform 0.5s',
                padding: '0 3% 2%',

                boxSizing: 'border-box',
                boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',

                backgroundColor: 'white',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',

            }
        }
    }


    render() {
        return (
            <div style={this.styles.wrapper}>
                <div style={this.styles.container}>

                    {
                        this.state.show ?

                                <SplitterLayout vertical
                                                percentage={true}
                                                primaryMinSize={2} secondaryMinSize={20}>
                                    <Log />
                                    <ChatWrapper userId={this.props.userId}/>
                                </SplitterLayout>

                            : ''
                    }
                    <Checkbox
                        style={{marginTop: '5%'}}
                        checkedIcon={<Visibility />}
                        uncheckedIcon={<VisibilityOff />}
                        onCheck={this.handleShowHide}
                    />

                </div>
            </div>

        );
    }
}


export default RightSidebar;