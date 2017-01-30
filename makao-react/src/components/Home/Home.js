import React from 'react';
import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import StyleIcon from 'material-ui/svg-icons/Image/style';
import CreateIcon from 'material-ui/svg-icons/content/create';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import {white, teal700, teal800, teal900} from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import GlobalVariables from '../Gameplay/GlobalVariables';

class Home extends React.Component {
    get styles() {
        return {
            container: {
                width: '100%',
            },
            userName: {
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

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <AppBar
                    title={<span style={this.styles.userName}>{GlobalVariables.userName}</span>}
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
                            <MenuItem primaryText="Go to lobby" leftIcon={<StyleIcon />}/>
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
                                >
                                    <MenuItem primaryText="Refresh"/>
                                    <MenuItem primaryText="Send feedback"/>
                                    <MenuItem primaryText="Settings"/>
                                    <MenuItem primaryText="Help"/>
                                    <MenuItem primaryText="Sign out"/>
                                </IconMenu>
                            </Badge>
                            <FlatButton style={this.styles.logout} label="Logout"/>
                        </div>
                    }
                />


            </div>
        );
    }
}
export default Home;

Home.defaultProps = {};

Home.propTypes = {};