import React from 'react';
import io from 'socket.io-client';
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
import Auth from '../../Auth';
import Dialog from 'material-ui/Dialog';
import FriendAdder from './FriendAdder';
import {red900} from 'material-ui/styles/colors';
import InviteIcon from 'material-ui/svg-icons/maps/local-activity';

var socket;

class HomeHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            userdata: UserStore.getState(),
            gameInvites: [],
            dialogOpen: false,
            searchResults: null,
        };

        this.onChange = this.onChange.bind(this);
        this.handleFriendFound = this.handleFriendFound.bind(this);
        this.handleFriendSearch = this.handleFriendSearch.bind(this);
        this.handleRequestSend = this.handleRequestSend.bind(this);

        this.handleInviteAccept = this.handleInviteAccept.bind(this);
        this.handleInviteIgnore = this.handleInviteIgnore.bind(this);
        this.handleInviteReceive = this.handleInviteReceive.bind(this);
        this.removeInviteFromList = this.removeInviteFromList.bind(this);
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

        socket = io();
        socket.on('connect', () => {
            socket.emit('authenticate', {token: Auth.getToken()});
            socket.on('authenticated', () => {
                socket.emit('user:data');
                socket.on('user:data', (data) => {
                    UserActions.updateUserData(data);
                });
                socket.on('friend:added', (newFriend) => {
                    UserActions.removeFriendRequest(newFriend);
                    UserActions.updateFriendList(newFriend);
                });
                socket.on('friend:ignore', (requestUsername) => {
                    UserActions.removeFriendRequest(requestUsername);
                });
                socket.on('friend:request:sent', () => {
                    // friend request successfuly sent
                });
                socket.on('friend:request:received', (sender) => {
                    UserActions.addFriendRequest(sender);
                });
                socket.on('user:invite', (inviter) => {
                    this.handleInviteReceive(inviter);
                });
                socket.on('invite:accepted', (creatorUsername) => {
                    this.removeInviteFromList(creatorUsername);
                    browserHistory.push('/game/' + creatorUsername);
                });
                socket.on('invite:rejected', (msg) => {
                    alert(msg);
                });
                socket.on('invite:remove', (creatorUsername) => {
                    this.removeInviteFromList(creatorUsername);
                });
                socket.on('friend:find', this.handleFriendFound)
            });
            socket.on('unauthorized', (msg) => {
                alert(JSON.stringify(msg.data));
            });
        });
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
        socket.disconnect();
    }

    //////////////////// FRIEND SEARCH ////////////////////
    handleFriendFound(friend) {
        this.setState({searchResults: friend});
    }

    handleFriendSearch(searchText) {
        socket.emit('friend:find', searchText);
    }
    ///////////////////////////////////////////////////////

    /////////////////// FRIEND REQUESTS ///////////////////
    handleRequestSend(selectedUsername) {
        socket.emit('friend:request:send', selectedUsername);
    }

    handleRequestAccept(friendUsername) {
        socket.emit('friend:accept', friendUsername);
    }

    handleRequestIgnore(friendUsername) {
        socket.emit('friend:ignore', friendUsername);
    }
    ///////////////////////////////////////////////////////

    //////////////////// GAME INVITES /////////////////////
    handleInviteReceive(inviter) {
        let currInvites = this.state.gameInvites;
        if (currInvites.indexOf(inviter) === -1) {
            currInvites.push(inviter);
            this.setState({ gameInvites: currInvites });
        }
    }

    handleInviteAccept(inviter) {
        socket.emit('invite:accept', inviter);
    }

    handleInviteIgnore (inviter) {
        socket.emit('invite:ignore', inviter);
        this.removeInviteFromList(inviter);
    }

    removeInviteFromList(inviter) {
        let currInvites = this.state.gameInvites;
        let index = currInvites.indexOf(inviter);
        if (index !== -1) {
            currInvites.splice(index, 1);
            this.setState({ gameInvites: currInvites });
        }
    }
    ///////////////////////////////////////////////////////

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
                                    onClick={() => this.handleRequestAccept(friendName)}/>
                        <FlatButton label="Ignore" labelStyle={{color: grey500}}
                                    onClick={() => this.handleRequestIgnore(friendName)}/>
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
                                    onClick={() => this.handleInviteAccept(friendName)}/>
                        <FlatButton label="Ignore" labelStyle={{color: grey500}}
                                    onClick={() => this.handleInviteIgnore(friendName)}/>
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

    get notificationsNum() {
        let totalInvites = this.state.userdata.friendRequests.length;
        totalInvites += this.state.gameInvites.length;
        return totalInvites || 0;
    }

    render() {
        const friendRequests = this.state.userdata.friendRequests;
        const gameInvites = this.state.gameInvites;
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
                        onSearch={this.handleFriendSearch}
                        searchResults={this.state.searchResults}
                        onUserSelect={this.handleRequestSend}
                    />
                </Dialog>
                <AppBar
                    title={
                        <Link to={"/users/" + this.state.userdata.username}>
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

HomeHeader.defaultProps = {};

HomeHeader.propTypes = {};