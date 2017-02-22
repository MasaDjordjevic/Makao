import React from 'react';
import RequestMenuItem from './RequestMenuItem';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

class FriendRequestMenuItem extends React.Component {
    get styles() {
        return {
            container: {}
        }
    }

    render() {
        return (
            <RequestMenuItem
                             title={'Friend request from'}
                             requester={this.props.requester}
                             onAccept={this.props.onAccept}
                             onIgnore={this.props.onIgnore}
                             rightIcon={<PersonAdd />}
            />
        );
    }
}
export default FriendRequestMenuItem;

FriendRequestMenuItem.defaultProps = {};

FriendRequestMenuItem.propTypes = {
    requester: React.PropTypes.string,
    onAccept: React.PropTypes.func,
    onIgnore: React.PropTypes.func
};