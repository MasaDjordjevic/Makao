import React from 'react';
import {Bar} from 'react-chartjs-2';

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
        const data = {
            labels: this.getLabels(),
            datasets: [{
                label: 'Average',
                type:'line',
                data: this.getAverageData(),
                fill: false,
                borderColor: '#EC932F',
                backgroundColor: '#EC932F',
                pointBorderColor: '#EC932F',
                pointBackgroundColor: '#EC932F',
                pointHoverBackgroundColor: '#EC932F',
                pointHoverBorderColor: '#EC932F',
            },{
                type: 'bar',
                label: 'Last week',
                data: this.state.timeSpentLastWeek,
                fill: false,
                backgroundColor: '#71B37C',
                borderColor: '#71B37C',
                hoverBackgroundColor: '#71B37C',
                hoverBorderColor: '#71B37C',
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