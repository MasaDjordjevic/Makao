import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import StyleIcon from 'material-ui/svg-icons/image/style';
import CreateIcon from 'material-ui/svg-icons/content/create';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import {white} from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router';
import UserStore from '../../../stores/UserStore';
import Dialog from 'material-ui/Dialog';
import FriendAdder from '../FriendAdder';
import RightElements from './RightElements';

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



    get styles() {
        return {
            container: {
                width: '100%',
            },
            username: {
                cursor: 'pointer',
            },
            rightIconElement: {
                margin: 0,
                width: '100%',
                paddingLeft: '3%',
            },
            addFriendDialogContent: {
                width: 380,
            },
            addFriendDialogBody: {
                paddingRight: 0,
            }
        }
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
                <AppBar
                    title={
                        <Link to={"/home"}>
                            <span style={this.styles.username}>{this.state.userdata.username}</span>
                        </Link>}
                    titleStyle={{overflow: ''}}
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
                        <RightElements gameInvites={this.props.gameInvites}
                                       friendRequests={this.state.userdata.friendRequests}
                                       onRequestAccept={this.props.onRequestAccept}
                                       onRequestIgnore={this.props.onRequestIgnore}
                                       onInviteAccept={this.props.onInviteAccept}
                                       onInviteIgnore={this.props.onInviteIgnore}
                        />
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

HomeHeader.propTypes = {
    onUserLoad: React.PropTypes.func,
    onFriendSearch: React.PropTypes.func,
    onSendRequest: React.PropTypes.func,
    onRequestAccept: React.PropTypes.func,
    onRequestIgnore: React.PropTypes.func,
    onInviteAccept: React.PropTypes.func,
    onInviteIgnore: React.PropTypes.func,
    searchResults: React.PropTypes.object,
    gameInvites: React.PropTypes.array,

};