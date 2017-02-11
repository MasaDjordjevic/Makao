import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import PublicIcon from 'material-ui/svg-icons/social/public';
import GroupIcon from 'material-ui/svg-icons/social/group';
import {List, ListItem} from 'material-ui/List';
import DefultTooltip from '../DefaultTooltip/DefaultTooltip';
import {grey400,teal800}    from 'material-ui/styles/colors';

class Leaderboards extends React.Component {
    constructor() {
        super();
        this.state = {
            friendsLeaderboard: [
                {firstName: 'Marko', lastname: 'Petrovic'},
                {firstName: 'Darko', lastname: 'Markovic'},
                {firstName: 'Igor', lastname: 'Nikolic'},
                {firstName: 'Petar', lastname: 'Zivic'},
                {firstName: 'Filip', lastname: 'Stojanovic'},
            ],
            globalLeaderboard: [
                {firstName: 'Milica', lastname: 'Petrovic', friend: false},
                {firstName: 'Tijana', lastname: 'Markovic', friend: true},
                {firstName: 'Kristina', lastname: 'Nikolic', friend: false},
                {firstName: 'Ana', lastname: 'Zivic', friend: false},
                {firstName: 'Marina', lastname: 'Stojanovic', friend: true},
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

    getFriendAttributes(user){
        return user.friend ? {
                style: {fontWeight: 600},
                rightIcon: <GroupIcon color={grey400}/>
            } : {};
    }

    renderList(userArray, floatRight) {

        return (
            <List>
                {
                    userArray.map((user, i) =>
                        <ListItem key={i}
                                  primaryText={(i + 1).toString() + ". " + user.firstName + " " + user.lastname}
                                  {...this.getFriendAttributes(user)} />
                    )
                }
            </List>
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
                        {this.renderList(this.state.friendsLeaderboard)}
                    </Tab>
                    <Tab
                        icon={
                            <DefultTooltip tooltip="global" tooltipPosition="top-center">
                                <PublicIcon color={teal800} />
                            </DefultTooltip>}>
                        {this.renderList(this.state.globalLeaderboard, true)}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
export default Leaderboards;

Leaderboards.defaultProps = {};

Leaderboards.propTypes = {};