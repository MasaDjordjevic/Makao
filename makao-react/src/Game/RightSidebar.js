/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import SplitterLayout from 'react-splitter-layout';


import ChatWrapper from './ChatWrapper';

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
                boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',

            },
            container: {
                width: '100%',
                height: '100%',
                transform: this.state.show ? '' : 'translate(75%, 0)',
                transition: 'transform 0.5s',
                padding: '0 3% 2%',

                boxSizing: 'border-box',

                backgroundColor: 'white',

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
                            <div style={{
                                width: '100%',
                                height: '100%',
                                flexGrow: 1,
                            }}>
                                <SplitterLayout vertical
                                                percentage={true}
                                                primaryMinSize={2} secondaryMinSize={20}>
                                    <div style={{height: '100%'}}>
                                        <Checkbox
                                            label="proba"

                                        />
                                    </div>

                                    <ChatWrapper userId={this.props.userId}/>
                                </SplitterLayout>

                            </div>
                            : ''
                    }
                    <Checkbox
                        style={{marginTop: '5%', marginLeft: 'auto'}}
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