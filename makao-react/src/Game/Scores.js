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
                justifyContent: 'center',
            },
            table: {
                // borderCollapse: 'collapse',
                // borderSpacing: 0,
            },
            thead: {
                // borderBottom: '1px solid rgb(224, 224, 224)',
            },
            th: {
                ...col, ...{
                    overflow: 'visible',
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
                    width: 6,
                }
            },
            toggle: {},
            textLeft: {
                textAlign: 'left'
            },
            scoresRow: {
                height: 30,
            }
        }
    }
    handleAddChange(){
        //alert("change");
    }
    render() {
        const players = this.props.scores.map((round, i) => round.map((a, b) => a.name))[0];

        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Table style={this.styles.table}>
                    <TableHeader style={this.styles.thead}
                                 displaySelectAll={false}
                                 adjustForCheckbox={false}
                                 enableSelectAll={false}>
                        <TableRow style={this.styles.scoresRow}>
                            <TableHeaderColumn colSpan={players.length - 1}
                                               style={{...this.styles.th, ...this.styles.textLeft}}>
                                Scores
                            </TableHeaderColumn>
                            <TableHeaderColumn colSpan={2}
                                               style={this.styles.toggleCol}>
                                <DefaultTooltip tooltip="Add scores through rounds" tooltipPosition="bottom-left">
                                    <Toggle
                                        defaultToggled={true}
                                        style={this.styles.toggle}
                                        onToggle={()=>this.handleAddChange()}
                                    />
                                </DefaultTooltip>
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow style={this.styles.tr}>
                            <TableHeaderColumn
                                style={this.styles.th}>
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
                    <TableBody style={this.styles.tbody}
                               displayRowCheckbox={false}
                               deselectOnClickaway={false}
                               showRowHover={false}
                               stripedRows={false}>
                        {
                            this.props.scores.map((round, i) =>
                                <TableRow key={i} style={{...this.styles.tr, ...this.styles.textLeft}}>
                                    <TableRowColumn style={this.styles.td}>{i}</TableRowColumn>
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