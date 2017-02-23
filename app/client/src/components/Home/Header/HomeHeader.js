import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui/svg-icons/action/home';
import {white} from 'material-ui/styles/colors';
import {Link} from 'react-router';
import UserStore from '../../../stores/UserStore';
import RightElements from './RightElements';

class HomeHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            userdata: UserStore.getState(),
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





    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <AppBar
                    title={
                        <Link to={"/home"}>
                            <span style={this.styles.username}>{this.state.userdata.username}</span>
                        </Link>}
                    titleStyle={{overflow: ''}}
                    iconElementLeft={
                        <IconButton>
                            <Link to={"/home"}>
                                <HomeIcon color={white}/>
                            </Link>
                        </IconButton>
                    }
                    iconStyleRight={this.styles.rightIconElement}
                    iconElementRight={
                        <RightElements gameInvites={this.props.gameInvites}
                                       friendRequests={this.state.userdata.friendRequests}
                                       onRequestAccept={this.props.onRequestAccept}
                                       onRequestIgnore={this.props.onRequestIgnore}
                                       onInviteAccept={this.props.onInviteAccept}
                                       onInviteIgnore={this.props.onInviteIgnore}
                                       onFriendSearch={this.props.onFriendSearch}
                                       onSendRequest={this.props.onSendRequest}
                                       searchResults={this.props.searchResults}
                                       searchMessage={this.props.searchMessage}

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
    searchResults: React.PropTypes.string,
    gameInvites: React.PropTypes.array,

};