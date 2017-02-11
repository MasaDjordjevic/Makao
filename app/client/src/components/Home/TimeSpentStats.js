import React from 'react';
import {Bar} from 'react-chartjs-2';
import {blackColor} from '../Card/common';
import {orange500} from 'material-ui/styles/colors';

class TimeSpentStats extends React.Component {
    constructor() {
        super();

        this.state = {
            timeSpentLastWeek: [15, 20, 25, 17, 12, 20, 5],
            timeSpentAverage: 18,
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
        const barColor = blackColor; //'#71B37C';
        const lineColor = orange500; //'#EC932F';
        const data = {
            labels: this.getLabels(),
            datasets: [{
                label: 'Average time spent',
                type:'line',
                data: this.getAverageData(),
                fill: false,
                borderColor: lineColor,
                backgroundColor: lineColor,
                pointBorderColor: lineColor,
                pointBackgroundColor: lineColor,
                pointHoverBackgroundColor: lineColor,
                pointHoverBorderColor: lineColor,
            },{
                type: 'bar',
                label: 'Time spent last week',
                data: this.state.timeSpentLastWeek,
                fill: false,
                backgroundColor: barColor,
                //borderColor: '#71B37C',
                borderWidth: 1,
                hoverBackgroundColor: barColor,
                hoverBorderColor: barColor,
                yAxisID: 'y-axis'
            }]
        };

        const options = {
            responsive: true,
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
                    },

                ]
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
export default TimeSpentStats;

TimeSpentStats.defaultProps = {};

TimeSpentStats.propTypes = {};