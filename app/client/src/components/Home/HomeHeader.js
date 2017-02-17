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
import { Link, browserHistory } from 'react-router';
import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';
import AuthActions from '../../actions/AuthActions';
import Auth from '../../Auth';

var socket;

class HomeHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            username: UserStore.getState().username
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        this.setState({ username: UserStore.getState().username });
    }

    componentDidMount() {
        UserStore.listen(this.onChange);

        socket = io();
        socket.on('connect', () => {
            socket.emit('authenticate', { token: Auth.getToken() });
            socket.on('authenticated', () => {
                // request user info from server
                socket.emit('user:info');
                // update user info when server responds
                socket.on('user:info', (info) => {
                    UserActions.updateUserInfo(info);
                });
                // accept friend request was successful
                socket.on('friend:added', (newFriend) => {
                    UserActions.updateFriendList(newFriend);
                })
                // ignore friend request was successful
                socket.on('friend:ignore', () => {
                    alert('ignored!');
                })
                // when a new invite is received
                socket.on('user:invite', (inviter) => {
                    UserActions.receiveInvite(inviter);
                });
                // when server allows client's accept
                socket.on('invite:accept', (creatorUsername) => {
                    browserHistory.push('/game/' + creatorUsername);
                });
                // when server rejects client's accept because
                // the game is full but it still hasn't started
                socket.on('invite:reject', (creatorUsername) => {
                    alert('The lobby is full.');
                });
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
            }
        }
    }

    handleRequestAccept(friendUsername) {
       socket.emit('friend:accept', friendUsername);
    }

    handleRequestIgnore(friendUsername) {
        socket.emit('friend:ignore', friendUsername);
    }

    renderFriendRequest(friendName) {
        return (
            <MenuItem primaryText={
                <div>
                    <span>Friend request from&nbsp;
                        <Link to={"/users/"+ friendName} >
                            <b>{friendName}</b>
                        </Link>
                    </span>
                    <div>
                        <FlatButton label="Accept" labelStyle={{color: green600}} onClick={() => this.handleRequestAccept(friendName)} />
                        <FlatButton label="Ignore" labelStyle={{color: grey500}} onClick={() => this.handleRequestIgnore(friendName)} />
                    </div>
                </div>

            }
                      rightIcon={<PersonAdd />}
            />
        );
    }

    handleLogout() {
        UserActions.clearUser();
        AuthActions.logout();
        browserHistory.push('/');
    }

    renderGameRequest(friendName, gameId) {

    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <AppBar
                    title={
                        <Link to={"/users/"+ this.state.username}>
                            <span style={this.styles.username}>{this.state.username}</span>
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
                            <MenuItem primaryText="Change profile" leftIcon={<CreateIcon />}/>
                            <MenuItem primaryText="Go to lobby" leftIcon={<StyleIcon />}
                                      containerElement={<Link to="/lobby"/>}/>
                            <MenuItem primaryText="Add a friend" leftIcon={<PersonAdd />}/>
                        </IconMenu>
                    }
                    iconStyleRight={this.styles.rightIconElement}
                    iconElementRight={
                        <div style={this.styles.rightContainer}>
                            <Badge
                                badgeContent={2}
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
                                    {this.renderFriendRequest("Darko")}
                                    <MenuItem primaryText="Send feedback"/>
                                    <MenuItem primaryText="Settings"/>
                                    <MenuItem primaryText="Help"/>
                                    <MenuItem primaryText="Sign out"/>
                                </IconMenu>
                            </Badge>

                            <FlatButton style={this.styles.logout}
                                        label="Logout"
                                        onClick={this.handleLogout} />
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