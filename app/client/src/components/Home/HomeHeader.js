import React from 'react';
import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import StyleIcon from 'material-ui/svg-icons/image/style';
import CreateIcon from 'material-ui/svg-icons/content/create';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import {white, green600, grey500} from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import {Link, browserHistory} from 'react-router';
import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';
import AuthActions from '../../actions/AuthActions';
import Dialog from 'material-ui/Dialog';
import FriendAdder from './FriendAdder';
import {red900} from 'material-ui/styles/colors';
import InviteIcon from 'material-ui/svg-icons/maps/local-activity';

class HomeHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            userdata: UserStore.getState(),
            // for add friend dialog
            dialogOpen: false,
        };

        this.onChange = this.onChange.bind(this);

    }


    onChange() {
        let newUsername = UserStore.getState().username;
        if (this.state.userdata.username.length <= 0 && newUsername.length > 0) {
            this.props.onUserLoad();
        }
        this.setState({userdata: UserStore.getState()});
    }

    componentDidMount() {
        UserStore.listen(this.onChange);
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    }

    get notificationsNum() {
        let totalInvites = this.state.userdata.friendRequests.length;
        totalInvites += this.props.gameInvites.length;
        return totalInvites || 0;
    }

    get styles() {
        return {
            container: {
                width: '100%',
            },
            username: {
                cursor: 'pointer',
            },
            notifications: {
                marginRight: 20,
                padding: 6,
                float: 'right',
            },
            rightContainer: {
                height: '100%',
                display: 'flex',
                alignItems: 'center',
            },
            rightIconElement: {
                margin: 0,
            },
            logout: {
                color: white,
            },
            notificationMenuPosition: {
                horizontal: 'left', vertical: 'top'
            },
            addFriendDialogContent: {
                width: 380,
            },
            addFriendDialogBody: {
                paddingRight: 0,
            }
        }
    }

    renderFriendRequest(friendName, i) {
        return (
            <MenuItem key={'friend' + i} primaryText={
                <div>
                    <span>Friend request from&nbsp;
                        <Link to={"/users/" + friendName}>
                            <b>{friendName}</b>
                        </Link>
                    </span>
                    <div>
                        <FlatButton label="Accept" labelStyle={{color: green600}}
                                    onClick={() => this.props.onRequestAccept(friendName)}/>
                        <FlatButton label="Ignore" labelStyle={{color: grey500}}
                                    onClick={() => this.props.onRequestIgnore(friendName)}/>
                    </div>
                </div>

            }
                      rightIcon={<PersonAdd />}
            />
        );
    }

    renderGameRequest(friendName, i) {
        return (
            <MenuItem key={'invite' + i}
                      primaryText={
                          <div>
                    <span style={{color: red900}}>Game invite from&nbsp;
                        <b>{friendName}</b>
                    </span>
                              <div>
                                  <FlatButton label="Accept" labelStyle={{color: green600}}
                                              onClick={() => this.props.onInviteAccept(friendName)}/>
                                  <FlatButton label="Ignore" labelStyle={{color: grey500}}
                                              onClick={() => this.props.onInviteIgnore(friendName)}/>
                              </div>
                          </div>

                      }
                      rightIcon={<InviteIcon />}
            />
        );
    }

    handleLogout() {
        UserActions.clearUser();
        AuthActions.logout();
        browserHistory.push('/');
    }

    handleOpen = () => {
        this.setState({dialogOpen: true});
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
    };


    render() {
        const friendRequests = this.state.userdata.friendRequests;
        const gameInvites = this.props.gameInvites;
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
                <AppBar
                    title={
                        <Link to={"/home"}>
                            <span style={this.styles.username}>{this.state.userdata.username}</span>
                        </Link>}
                    iconElementLeft={
                        <IconMenu
                            iconButtonElement={
                                <IconButton>
                                    <MenuIcon color={white}/>
                                </IconButton>}
                            anchorOrigin={this.styles.notificationMenuPosition}
                            targetOrigin={this.styles.notificationMenuPosition}
                        >
                            <MenuItem primaryText="Change profile"
                                      leftIcon={<CreateIcon />}/>
                            <MenuItem primaryText="Go to lobby"
                                      leftIcon={<StyleIcon />}
                                      containerElement={<Link to="/lobby"/>}/>
                            <MenuItem primaryText="Add a friend"
                                      leftIcon={<PersonAdd />}
                                      onClick={this.handleOpen}/>
                        </IconMenu>
                    }
                    iconStyleRight={this.styles.rightIconElement}
                    iconElementRight={
                        <div style={this.styles.rightContainer}>
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
                                        gameInvites.map((username, i) =>
                                            this.renderGameRequest(username, i)
                                        )
                                    }
                                    {
                                        friendRequests.map((from, i) =>
                                            this.renderFriendRequest(from, i)
                                        )
                                    }
                                </IconMenu>
                            </Badge>

                            <FlatButton style={this.styles.logout}
                                        label="Logout"
                                        onClick={this.handleLogout}/>
                        </div>
                    }
                />



            </div>
        );
    }
}
export default HomeHeader;

HomeHeader.defaultProps = {
    gameInvites: [],
    searchResults: null,
};

HomeHeader.propTypes = {};