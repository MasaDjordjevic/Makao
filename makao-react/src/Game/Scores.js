import React from 'react';
import DefaultTooltip from '../DefaultTooltip';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';

class Scores extends React.Component {
    get styles() {
        const columnWidth = 20;
        const columnHeight = 2;
        const columnPadding = 5;
        const col = {
            paddingTop: 1,
            paddingBottom: 1,
            paddingLeft: columnPadding,
            paddingRight: columnPadding,
            width: columnWidth,
            height: '',
            textAlign: 'center'
        };
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundColor: 'white',
            },
            table: {},
            thead: {
                // borderBottom: '1px solid rgb(224, 224, 224)',
            },
            th: {
                ...col, ...{
                    // overflow: 'visible',
                }
            },
            tbody: {},
            tr: {
                height: 25
            },
            td: {
                ...col, ...{}
            },
            toggleCol: {
                ...col, ...{
                    width: 5
                }
            },
            toggle: {},
            textLeft: {
                textAlign: 'left'
            },
            scoresRow: {
                height: 30,
            },
            colNarrow: {
                ...col, ...{
                    width: 5,
                }
            }
        }
    }

    handleAddChange() {
        //alert("change");
    }

    render() {
        const players = this.props.scores.map((round, i) => round.map((a, b) => a.name))[0];

        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Table style={this.styles.table}
                       fixedHeader={true}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}>
                        <TableRow style={this.styles.scoresRow}>
                            <TableHeaderColumn colSpan={players.length}
                                               style={{...this.styles.th, ...this.styles.textLeft}}>
                                Scores
                            </TableHeaderColumn>
                            <TableHeaderColumn style={this.styles.toggleCol}>
                                <DefaultTooltip tooltip="Add scores through rounds" tooltipPosition="bottom-left">
                                    <Toggle
                                        defaultToggled={true}
                                        style={this.styles.toggle}
                                        onToggle={() => this.handleAddChange()}
                                    />
                                </DefaultTooltip>
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow style={this.styles.tr}>
                            <TableHeaderColumn
                                style={{...this.styles.th, ...this.styles.colNarrow}}>
                                &nbsp;
                            </TableHeaderColumn>
                            {
                                players.map((p, i) =>
                                    <TableHeaderColumn key={i}
                                                       style={this.styles.th}>
                                        <DefaultTooltip tooltip={p} tooltipPosition="top-left">
                                            {p.charAt(0)}
                                        </DefaultTooltip>
                                    </TableHeaderColumn >
                                )
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}
                               deselectOnClickaway={false}
                               showRowHover={false}
                               stripedRows={false}>
                        {
                            this.props.scores.map((round, i) =>
                                <TableRow key={i} style={{...this.styles.tr, ...this.styles.textLeft}}>
                                    <TableRowColumn style={{...this.styles.td, ...this.styles.colNarrow}}>
                                        {i}
                                    </TableRowColumn>
                                    {
                                        round.map((s, j) =>
                                            <TableRowColumn key={j}
                                                            style={this.styles.td}>
                                                {s.score}
                                            </TableRowColumn>
                                        )
                                    }


                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}
export default Scores;

Scores.defaultProps = {};

Scores.propTypes = {};