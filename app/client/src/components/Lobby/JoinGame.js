import React from 'react';
import {
    Table, TableBody, TableHeader, TableHeaderColumn,
    TableRow, TableRowColumn
}  from 'material-ui/Table';
import {browserHistory} from 'react-router';

class JoinGame extends React.Component {
    constructor() {
        super();

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(selectedRow) {
        if (!this.props.games[selectedRow]) return;
        browserHistory.push('/game/' + this.props.games[selectedRow].creator);
    }

    get styles() {
        return {
            container: {}
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Table height='500px'
                       fixedFooter={false}
                       fixedHeader={false}
                       selectable={true}
                       onRowSelection={this.joinGame}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Host</TableHeaderColumn>
                            <TableHeaderColumn>Current</TableHeaderColumn>
                            <TableHeaderColumn>Min - Max</TableHeaderColumn>
                            <TableHeaderColumn>Rules</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.props.games.map((game, i) =>
                                <TableRow key={game.creator}>
                                    <TableRowColumn>{game.creator}</TableRowColumn>
                                    <TableRowColumn>{game.current}</TableRowColumn>
                                    <TableRowColumn>{game.rules.playerNumberMin}
                                        - {game.rules.playerNumberMax}</TableRowColumn>
                                    <TableRowColumn><span>rules</span></TableRowColumn>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}
export default JoinGame;

JoinGame.defaultProps = {};

JoinGame.propTypes = {};