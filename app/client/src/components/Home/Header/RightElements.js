import React from 'react';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import FlatButton from 'material-ui/FlatButton';
import GameRequestMenuItem from './Requests/GameRequestMenuItem';
import FriendRequestMenuItem from './Requests/FriendRequestMenuItem';
import {browserHistory} from 'react-router';
import UserActions from '../../../actions/UserActions';
import AuthActions from '../../../actions/AuthActions';
import {white} from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import PlaySocketWrapper from '../../Lobby/PlaySocketWrapper';
import Dialog from 'material-ui/Dialog';
import FriendAdder from '../FriendAdder';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';



class RightElements extends React.Component {
    constructor(){
        super();
        this.state={
            dialogOpen: false,
        }
    }


    get styles() {
        return {
            container: {
                height: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
            notifications: {
                marginRight: 15,
                marginLeft: 15 + 16,
                padding: 6,
                float: 'right',
            },
            logout: {
                color: white,
            },
            notificationMenuPosition: {
                horizontal: 'left', vertical: 'top'
            },
            playButton: {
                marginRight: 'auto',
            }
        }
    }

    handleLogout() {
        UserActions.clearUser();
        AuthActions.logout();
        browserHistory.push('/');
    }

    get notificationsNum() {
        let totalInvites = this.props.friendRequests.length;
        totalInvites += this.props.gameInvites.length;
        return totalInvites || 0;
    }

    handleOpen = () => {
        this.setState({dialogOpen: true});
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
    };

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Dialog
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}
                    contentStyle={this.styles.addFriendDialogContent}
                    bodyStyle={this.styles.addFriendDialogBody}

                >
                    <FriendAdder
                        onSearch={this.props.onFriendSearch}
                        searchResults={this.props.searchResults}
                        onUserSelect={this.props.onSendRequest}
                    />
                </Dialog>
                <PlaySocketWrapper style={this.styles.playButton}/>
                <IconButton tooltip="Add friend" onClick={this.handleOpen}>
                    <PersonAddIcon color={white}/>
                </IconButton>
                <Badge
                    badgeContent={this.notificationsNum}
                    badgeStyle={{display: this.notificationsNum ? 'flex' : 'none'}}
                    secondary={true}
                    style={this.styles.notifications}>

                    <IconMenu
                        iconButtonElement={
                            <IconButton tooltip="Notifications">
                                <NotificationsIcon color={white}/>
                            </IconButton>}
                        anchorOrigin={this.styles.notificationMenuPosition}
                        targetOrigin={this.styles.notificationMenuPosition}
                        width={300}
                    >
                        {
                            this.props.gameInvites.map((username, i) =>
                                <GameRequestMenuItem key={'game' + i}
                                                     requester={username}
                                                     onAccept={this.props.onInviteAccept}
                                                     onIgnore={this.props.onInviteIgnore}/>
                            )
                        }
                        {
                            this.props.friendRequests.map((from, i) =>
                                <FriendRequestMenuItem key={'friend' + i}
                                                       requester={from}
                                                       onAccept={this.props.onRequestAccept}
                                                       onIgnore={this.props.onRequestIgnore}/>
                            )
                        }
                    </IconMenu>
                </Badge>

                <FlatButton style={this.styles.logout}
                            label="Logout"
                            onClick={this.handleLogout}/>
            </div>
        );
    }
}
export default RightElements;

RightElements.defaultProps = {
    gameInvites: [],
    friendRequests: [],
};

RightElements.propTypes = {
    gameInvites: React.PropTypes.array,
    friendRequests: React.PropTypes.array,
    onRequestAccept: React.PropTypes.func,
    onRequestIgnore: React.PropTypes.func,
    onInviteAccept: React.PropTypes.func,
    onInviteIgnore: React.PropTypes.func,
};