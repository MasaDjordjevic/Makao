import React from 'react';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import _ from 'lodash';
import UserStore from '../../stores/UserStore';

class FriendPicker extends React.Component {
    constructor() {
        super();
        this.state = {
            search: '',
            friends: [],
            pickedFriends: [],
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.handlePick = this.handlePick.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentWillMount() {
        this.setState({friends: UserStore.getState().friends});
    }

    handleSearch(text) {
        this.setState({search: text});
    }

    handlePick(username) {
        const picked = [username, ...this.state.pickedFriends];
        this.setState({pickedFriends: picked});
        this.props.onPick(username);
    }

    handleRemove(username) {
        if (!this.props.removable) return;
        let pickedFriends = this.state.pickedFriends.slice();
        pickedFriends = _.without(pickedFriends, username);
        this.setState({pickedFriends: pickedFriends});
    }

    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                padding: '0 16px',
            },
            search: {
                width: '100%'
            },
            list: {
                overflowY: 'auto'
            },
            lists: {
                display: 'flex',
                justifyContent: 'space-between'
            }
        }
    }

    render() {
        const searchText = this.state.search.toLowerCase();
        const picked = this.state.pickedFriends.slice();

        const friends = this.state.friends.filter(function (friend) {
            return picked.indexOf(friend) === -1 &&
                friend.toLowerCase().indexOf(searchText) > -1;
        });
        const pickedFriends = this.state.friends.filter(function (friend) {
            return picked.indexOf(friend) !== -1;
        });
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <TextField
                    key="search"
                    onChange={(e, v) => this.handleSearch(v)}
                    hintText="search"
                    style={this.styles.search}/>
                <div style={this.styles.lists}>
                    <List style={this.styles.list}>
                        <Subheader>Friends</Subheader>
                        { friends.map((username, i) =>
                            <ListItem
                                key={username}
                                primaryText={username}
                                leftAvatar={<Avatar>{username.charAt(0)}</Avatar>}
                                onClick={() => this.handlePick(username)}
                            />
                        )
                        }
                    </List>
                    <List style={this.styles.list}>
                        <Subheader>Invited</Subheader>
                        { pickedFriends.map((username, i) =>
                            <ListItem
                                key={username}
                                primaryText={username}
                                leftAvatar={<Avatar>{username.charAt(0)}</Avatar>}
                                onClick={() => this.handleRemove(username)}
                                disabled={!this.props.removable}
                            />
                        )
                        }
                    </List>
                </div>
            </div>
        );
    }
}
export default FriendPicker;

FriendPicker.defaultProps = {
    removable: false,
};

FriendPicker.propTypes = {
    onPick: React.PropTypes.func,
    removable: React.PropTypes.bool,
};
