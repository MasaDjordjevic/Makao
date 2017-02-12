import React from 'react';
import {Bar} from 'react-chartjs-2';
import {redColor} from '../Card/common';

class PointsWonStats extends React.Component {
    constructor() {
        super();

        this.state = {
            pointsWonLastWeek: [100, 250, 240, 10, 800, 410, 170],
        }
    }

    get styles() {
        return {
            container: {}
        }
    }

    getLabels() {
        let today = (new Date()).getDay() || 7; //danasnji dan, ako je nedelja vrati 7 a ne 0
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; //TODO izvuci dane u neki config/translate fajl
        return days.slice(today).concat(days.slice(0, today));
    }

    getAverageData() {
        return Array(7).fill(null).map((_, i) => this.state.timeSpentAverage);
    }

    render() {
        const mainColor = redColor;// '#EC932F';
        const data = {
            labels: this.getLabels(),
            datasets: [{
                label: 'Points won last week',
                type:'line',
                data: this.state.pointsWonLastWeek,
                fill: false,
                backgroundColor: mainColor,
                pointBorderColor: mainColor,
                pointBackgroundColor: mainColor,
                pointHoverBackgroundColor: mainColor,
                pointHoverBorderColor: mainColor,
                yAxisID: 'y-axis'
            }]
        };

        const options = {
            responsive: true,
            tooltips: {
                mode: 'label'
            },
            elements: {
                line: {
                    fill: false
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        labels: {
                            show: true
                        }
                    }
                ],
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis',
                        gridLines: {
                            display: false
                        },
                        labels: {
                            show: true
                        }
                    }]
            }
        };


        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Bar
                    data={data}
                    options={options}
                />


            </div>
        );
    }
}
export default PointsWonStats;

PointsWonStats.defaultProps = {};

PointsWonStats.propTypes = {};