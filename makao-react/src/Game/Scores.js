import React from 'react';
import DefaultTooltip from '../DefaultTooltip';
import {
    Table,
    TableBody,
    TableHeader,
    TableFooter,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import {grey400, teal900} from 'material-ui/styles/colors'
import _ from 'lodash';
import {getScrollbarWidth} from "../util/util";

class Scores extends React.Component {
    constructor() {
        super();

        this.state = {
            addMode: true,
        };
    }

    get styles() {
        const columnWidth = 20;
        const columnPadding = 5;
        const col = {
            paddingTop: 1,
            paddingBottom: 1,
            paddingLeft: columnPadding,
            paddingRight: columnPadding,
            width: columnWidth,
            height: '',
            textAlign: 'center',
            textOverflow: 'clip'
        };
        return {
            container: {
                width: (this.props.scores[0].length + 1) * (columnWidth + 2 * columnPadding) * 1.2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
                borderRadius: '2px',
                backgroundColor: 'white',
            },
            tableWrapper: {
                overflow: 'visible',
            }
            ,
            tr: {
                height: 25,
            }
            ,
            th: {
                ...
                    col,
                ...
                    {}
            }
            ,
            td: {
                ...
                    col,
                ...
                    {}
            }
            ,
            colNarrow: {
                ...
                    col,
                ...
                    {
                        width: 5,
                        color: grey400
                    }
            }
            ,
            footer: {
                height: 15,
            }
            ,
            scores: {
                color: teal900,
            }
            ,
            superHeader: {
                height: this.headerHeight,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '6px 8px',
                boxSizing: 'border-box',
            }
        }
    }

    get headerHeight() {
        return 25 + 12;
    }



    componentDidMount() {
        //scroll to bottom
        var tableElement = document.getElementsByClassName('table')[1].parentElement;
        tableElement.scrollTop = tableElement.scrollHeight;

        //adds margin to header where there is a scroll
        if (tableElement.scrollHeight > tableElement.clientHeight) {
            tableElement.parentElement.firstChild.style.marginRight = getScrollbarWidth() + 'px';
        }
    }

    handleAddChange() {
        this.setState({addMode: !this.state.addMode});
    }

    getScores() {
        //score are given for each round
        //return them if addMode is off
        let scrs = [...this.props.scores];
        if (!this.state.addMode) {
            return scrs;
        }

        //nije mi jasno zasto moram da pravim novi niz
        //tj. kad menjam scrs menjam i this.props.scores a nzm zasto
        /* let retVal = [];
         scrs.map((round, i) => {
         let r = [];
         round.map((s, j) => {
         let prevScore = i == 0 ? 0 : _.find(retVal[i - 1], {id: s.id}).score;
         r.push({id: s.id, score: s.score + prevScore});
         });
         retVal.push(r);
         });
         return retVal;
         */

        //if addMode add score to previous round
        let retVal = [];
        _.forEach(scrs, function (round, i) {
            let r = [];
            _.forEach(round, function (s, j) {
                let prevScore = i === 0 ? 0 : _.find(retVal[i - 1], {id: s.id}).score;
                let newS = {id: s.id, score: s.score + prevScore};
                r.push(newS);
            });
            retVal.push(r);
        });
        return retVal;
        /*
         const scr =  scrs.slice().map((round, i) => {
         let r = round.slice().map((s, j)=> {
         let prevScore = i==0 ? 0 : _.find(scrs[i-1], {id: s.id}).score;
         s.score += prevScore;
         return s;
         } );
         console.log(r);
         return r;
         });
         return scr;
         */
    }

    render() {
        const players = this.props.scores.slice().map((round, i) => round.map((a, b) => a.name))[0];
        const scores = this.getScores();
        //26.67 je visina hedera tabele, mng mi je zao zbog ovoga :'(
        const tableHeight = this.props.height - this.headerHeight - 26.67;
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.superHeader}>
                    <span style={this.styles.scores}>Scores</span>
                    <DefaultTooltip tooltip="Add scores through rounds" tooltipPosition="bottom-left"
                                    style={{width: ''}}>
                        <Toggle
                            defaultToggled={true}
                            onToggle={() => this.handleAddChange()}
                        />
                    </DefaultTooltip>
                </div>
                <Table className="table"
                       style={this.styles.table}
                       fixedFooter={false}
                       wrapperStyle={this.styles.tableWrapper}
                       height={tableHeight + 'px'}>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}>
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
                            scores.map((round, i) =>
                                <TableRow key={i} style={this.styles.tr}>
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
                    <TableFooter adjustForCheckbox={false}>
                        <TableRow style={this.styles.footer}>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    }
}
export default Scores;

Scores.defaultProps = {};

Scores.propTypes = {};