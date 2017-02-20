import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn,
        TableRow, TableRowColumn}  from 'material-ui/Table';
import { browserHistory } from 'react-router';

class JoinGame extends React.Component {
    constructor() {
        super();

        this.state = {
            games: [
                {
                    id: 1,
                    creator: 'Darko',
                    current: 3,
                    rules: {
                        gameLimit: 300,
                        timeLimit: 10,
                        playerNumberMin: 3,
                        playerNumberMax: 8,
                        deckNumber: 2,
                        rankFilter: 2
                    }
                },
                {
                    id: 2,
                    creator: 'Marko',
                    current: 2,
                    rules: {
                        gameLimit: 200,
                        timeLimit: 15,
                        playerNumberMin: 5,
                        playerNumberMax: 5,
                        deckNumber: 2,
                        rankFilter: 2
                    }
                },
                {
                    id: 3,
                    creator: 'Nikola',
                    current: 3,
                    rules: {
                        gameLimit: 150,
                        timeLimit: 30,
                        playerNumberMin: 2,
                        playerNumberMax: 6,
                        deckNumber: 1,
                        rankFilter: 15
                    }
                },
            ]
        };

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(selectedRow){
        if(!this.state.games[selectedRow]) return;
        browserHistory.push('/game/' + this.state.games[selectedRow].creator);
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
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Host</TableHeaderColumn>
                            <TableHeaderColumn>Current</TableHeaderColumn>
                            <TableHeaderColumn>Min - Max</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                    {
                        this.state.games.map((game, i) =>
                            <TableRow key={game.creator} >
                                <TableRowColumn>{game.creator}</TableRowColumn>
                                <TableRowColumn>{game.current}</TableRowColumn>
                                <TableRowColumn>{game.rules.playerNumberMin} - {game.rules.playerNumberMax}</TableRowColumn>
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