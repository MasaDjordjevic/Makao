import React from 'react';
import {
    Table, TableBody, TableHeader, TableHeaderColumn,
    TableRow, TableRowColumn
}  from 'material-ui/Table';

class JoinGame extends React.Component {
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
                       onRowSelection={this.props.onJoin}>
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
                            this.props.gameList.map((game, i) =>
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