import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import PublicIcon from 'material-ui/svg-icons/social/public';
import GroupIcon from 'material-ui/svg-icons/social/group';
import {List, ListItem} from 'material-ui/List';
import DefultTooltip from '../DefaultTooltip/DefaultTooltip';
import UserStore from '../../stores/UserStore';
import {grey400, teal800}    from 'material-ui/styles/colors';
import {Link} from 'react-router';

class Leaderboards extends React.Component {
    constructor() {
        super();
        this.state = {
            username: UserStore.getState().username
        }
    }

    get styles() {
        return {
            container: {
                display: 'flex',
                overflow: 'auto',
                width: 260,
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
                <Link to={"/users/" + this.state.username}>
                    <ListItem
                        primaryText={position + ". " + this.state.username}
                        {...this.myScoreAttributes}/>
                </Link>
            </List>
        )
    }

    renderList(userArray, userPosition) {
        return (
            <div>
                <List style={{height: '100%', overflow: 'auto'}}>
                    {
                        userArray.map((user, i) =>
                            <Link to={"/users/" + user.username} key={i}>
                                <ListItem
                                    primaryText={(i + 1).toString() + ". " + user.username}
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
                        {this.renderList(this.props.leaderboards.friends, this.props.leaderboards.meFriends)}
                    </Tab>
                    <Tab
                        icon={
                            <DefultTooltip tooltip="global" tooltipPosition="top-center">
                                <PublicIcon color={teal800}/>
                            </DefultTooltip>}>
                        {this.renderList(this.props.leaderboards.global, this.props.leaderboards.meGlobal)}
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