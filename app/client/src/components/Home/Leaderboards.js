import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import PublicIcon from 'material-ui/svg-icons/social/public';
import GroupIcon from 'material-ui/svg-icons/social/group';
import {List, ListItem} from 'material-ui/List';
import DefultTooltip from '../DefaultTooltip/DefaultTooltip';
import {grey400, teal800}    from 'material-ui/styles/colors';
import GlobalVariables from '../Gameplay/GlobalVariables';
import {Link} from 'react-router';

class Leaderboards extends React.Component {
    constructor() {
        super();
        this.state = {
            myPosition: {
                friends: 3,
                global: 39,
            },
            friendsLeaderboard: [
                {id: '1', firstName: 'Marko', lastname: 'Petrovic'},
                {id: '2', firstName: 'Darko', lastname: 'Markovic'},
                {id: '3', firstName: 'Igor', lastname: 'Nikolic'},
                {id: '4', firstName: 'Petar', lastname: 'Zivic'},
                {id: '5', firstName: 'Filip', lastname: 'Stojanovic'},
                {id: '6', firstName: 'Marko', lastname: 'Petrovic'},
                {id: '7', firstName: 'Darko', lastname: 'Markovic'},
                {id: '8', firstName: 'Igor', lastname: 'Nikolic'},
                {id: '9', firstName: 'Petar', lastname: 'Zivic'},
                {id: '10', firstName: 'Filip', lastname: 'Stojanovic'},
            ],
            globalLeaderboard: [
                {id: '21', firstName: 'Milica', lastname: 'Petrovic', friend: false},
                {id: '22', firstName: 'Tijana', lastname: 'Markovic', friend: true},
                {id: '23', firstName: 'Kristina', lastname: 'Nikolic', friend: false},
                {id: '24', firstName: 'Ana', lastname: 'Zivic', friend: false},
                {id: '25', firstName: 'Marina', lastname: 'Stojanovic', friend: true},
            ],
        }
    }

    get styles() {
        return {
            container: {
                width: 250,
                marginLeft: 'auto'
            }
        }
    }

    //return object with props for users that have friend attribute (friends of the user)
    getFriendAttributes(user) {
        return user.friend ? {
                style: {fontWeight: 600},
                rightIcon: <GroupIcon color={grey400}/>
            } : {};
    }

    get myScoreAttributes() {
        return {
            style: {
                fontWeight: 600,
                color: teal800
            }
        }
    }

    renderMyScoreAttributes(i, userPosition) {
        return i === userPosition ? this.myScoreAttributes : {};
    }

    renderMyPosition(position) {
        if (position <= this.props.numberOfUsersInBoards) return;
        return (
            <List>
                <Link to={"/users:" + GlobalVariables.userId}>
                    <ListItem
                        primaryText={position + ". " + GlobalVariables.username}
                        {...this.myScoreAttributes}/>
                </Link>
            </List>
        )
    }

    renderList(userArray, userPosition) {
        return (
            <div>
                <List style={{height: 240, overflow: 'auto'}}>
                    {
                        userArray.map((user, i) =>
                            <Link to={"/users:" + user.id} key={user.id}>
                                <ListItem
                                    primaryText={(i + 1).toString() + ". " + user.firstName + " " + user.lastname}
                                    {...this.getFriendAttributes(user)}
                                    {...this.renderMyScoreAttributes(i, userPosition)}/>
                            </Link>
                        )
                    }
                </List>
                {this.renderMyPosition(userPosition)}
            </div>
        )
    }


    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Tabs>
                    <Tab
                        icon={
                            <DefultTooltip tooltip="friends" tooltipPosition="top-center">
                                <GroupIcon color={teal800}/>
                            </DefultTooltip>}>
                        {this.renderList(this.state.friendsLeaderboard, this.state.myPosition.friends)}
                    </Tab>
                    <Tab
                        icon={
                            <DefultTooltip tooltip="global" tooltipPosition="top-center">
                                <PublicIcon color={teal800}/>
                            </DefultTooltip>}>
                        {this.renderList(this.state.globalLeaderboard, this.state.myPosition.global)}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
export default Leaderboards;

Leaderboards.defaultProps = {
    numberOfUsersInBoards: 10
};

Leaderboards.propTypes = {
    numberOfUsersInBoards: React.PropTypes.number,
};