import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

class Leaderboards extends React.Component {
    get styles() {
        return {
            container: {
                width: 450,
                marginLeft: 'auto'
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Tabs>
                    <Tab label="Friends" >
                    </Tab>
                    <Tab label="All players">
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
export default Leaderboards;

Leaderboards.defaultProps = {};

Leaderboards.propTypes = {};