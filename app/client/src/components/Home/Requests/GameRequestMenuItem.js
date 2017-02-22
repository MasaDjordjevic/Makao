import React from 'react';
import {red900} from 'material-ui/styles/colors';
import InviteIcon from 'material-ui/svg-icons/maps/local-activity';
import RequestMenuItem from './RequestMenuItem';

class GameRequestMenuItem extends React.Component {
    render() {
        return (
            <RequestMenuItem
                             title={'Game invite from'}
                             titleStyle={{color: red900}}
                             requester={this.props.requester}
                             onAccept={this.props.onAccept}
                             onIgnore={this.props.onIgnore}
                             rightIcon={<InviteIcon />}
            />
        );
    }
}
export default GameRequestMenuItem;

GameRequestMenuItem.defaultProps = {};

GameRequestMenuItem.propTypes = {
    requester: React.PropTypes.string,
    onAccept: React.PropTypes.func,
    onIgnore: React.PropTypes.func
};