import React from 'react';
import {Bar} from 'react-chartjs-2';
import {redColor} from '../Card/common';

class PointsWonStats extends React.Component {
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

    render() {
        const mainColor = redColor;// '#EC932F';
        const data = {
            labels: this.getLabels(),
            datasets: [{
                label: 'Points won last week',
                type:'line',
                data: this.props.scoresArray,
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

PointsWonStats.defaultProps = {
    scoresAverage: [0]
};

PointsWonStats.propTypes = {};