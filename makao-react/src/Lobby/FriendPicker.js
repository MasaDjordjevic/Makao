import React from 'react';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import _ from 'lodash';

class FriendPicker extends React.Component {
    constructor() {
        super();
        this.state = {
            search: '',
            friends: [
                {
                    id: 123,
                    firstName: 'Marko',
                    lastName: 'Petrovic'
                },
                {
                    id: 7825,
                    firstName: 'Kristina',
                    lastName: 'Stefanovic'
                },
                {
                    id: 1578,
                    firstName: 'Darko',
                    lastName: 'Jovanovic'
                },
                {
                    id: 456,
                    firstName: 'Filip',
                    lastName: 'Markovic'
                },
                {
                    id: 25,
                    firstName: 'Milica',
                    lastName: 'Nikolic'
                },
            ],
            pickedFriends: [],
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.handlePick = this.handlePick.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleSearch(text) {
        this.setState({search: text});
    }

    handlePick(id) {
        const picked = [id, ...this.state.pickedFriends];
        this.setState({pickedFriends: picked});
        this.props.onPick(picked);
    }

    handleRemove(id) {
        let pickedFriends = this.state.pickedFriends.slice();
        pickedFriends = _.without(pickedFriends, id);
        this.setState({pickedFriends: pickedFriends});
    }

    get styles() {
        return {
            container: {},
            search: {
                marginLeft: 16,
            }
        }
    }

    render() {
        const searchText = this.state.search.toLowerCase();
        const pickedIds = this.state.pickedFriends;

        const friends = this.state.friends.filter(function (friend) {
            return pickedIds.indexOf(friend.id) === -1 &&
                (friend.firstName.toLowerCase().indexOf(searchText) > -1 ||
                friend.lastName.toLowerCase().indexOf(searchText) > -1);
        });
        const pickedFriends = this.state.friends.filter(function (friend) {
            return pickedIds.indexOf(friend.id) !== -1;
        });
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <TextField
                    key="search"
                    onChange={(e, v) => this.handleSearch(v)}
                    hintText="search"
                    style={this.styles.search}/>
                <List>
                    <Subheader>Picked</Subheader>
                    {
                        pickedFriends.map((user, i) =>
                            <ListItem
                                key={user.id}
                                primaryText={user.firstName + " " + user.lastName}
                                leftAvatar={<Avatar>{user.firstName.charAt(0)}</Avatar>}
                                onClick={() => this.handleRemove(user.id)}
                            />
                        )
                    }
                    <Subheader>Friends</Subheader>

                    {
                        friends.map((user, i) =>
                            <ListItem
                                key={user.id}
                                primaryText={user.firstName + " " + user.lastName}
                                leftAvatar={<Avatar>{user.firstName.charAt(0)}</Avatar>}
                                onClick={() => this.handlePick(user.id)}
                            />
                        )
                    }
                </List>
            </div>
        );
    }
}
export default FriendPicker;

FriendPicker.defaultProps = {};

FriendPicker.propTypes = {};