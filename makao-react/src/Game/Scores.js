import React from 'react';

class Scores extends React.Component {
    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            },
            thead:{
                borderBottom: '1px solid rgb(224, 224, 224)',
            },
            th:{
                fontWeight: 'normal',
                color: 'rgb(158, 158, 158)'
            },
            tbody: {

            },
            tr: {

            }
        }
    }

    render() {
        const players = this.props.scores.map((round, i)  => round.map((a, b) => a.name))[0];

        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <table>
                    <thead style={this.styles.thead}>
                    <tr>
                        {
                            players.map((p, i) =>
                                <th  key={i}
                                     style={this.styles.th}>
                                    {p}
                                </th >
                            )
                        }
                    </tr>
                    </thead>
                    <tbody style={this.styles.tbody}>
                        {
                            this.props.scores.map((round, i) =>
                            <tr key={i}>
                                {
                                    round.map((s, j) =>
                                        <td key={j}
                                            style={this.styles.td}>
                                            {s.score}
                                        </td>
                                    )
                                }


                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}
export default Scores;

Scores.defaultProps = {};

Scores.propTypes = {};