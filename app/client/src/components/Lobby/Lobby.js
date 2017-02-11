import React from 'react';

import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import HourglassIcon from 'material-ui/svg-icons/action/hourglass-empty';
import DoneIcon from 'material-ui/svg-icons/action/done';

class Lobby extends React.Component {
    constructor() {
        super();

        this.state = {
            users: [
                {
                    id: 7825,
                    firstName: 'Kristina',
                    lastName: 'Stefanovic',
                    ready: true,
                },
                {
                    id: 1578,
                    firstName: 'Darko',
                    lastName: 'Jovanovic',
                    ready: false,
                },
                {
                    id: 456,
                    firstName: 'Filip',
                    lastName: 'Markovic',
                    ready: true,
                },
            ]
        }
    }

    get styles() {
        return {
            container: {
                display: 'flex',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <List>
                    {
                        this.state.users.map((user, i) =>
                            <ListItem key={user.id}
                                      primaryText={user.firstName + " " + user.lastName}
                                      rightIcon={user.ready ? <DoneIcon /> : <HourglassIcon />}
                                      disabled={true}/>
                        )
                    }
                </List>
            </div>
        );
    }
}
export default Lobby;

Lobby.defaultProps = {};

Lobby.propTypes = {};