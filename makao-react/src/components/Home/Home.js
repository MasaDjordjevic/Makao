import React from 'react';
import HomeHeader from './HomeHeader';
import TimeSpentStats from './TimeSpentStats';
import PointsWonStats from './PointsWonStats';
import {blackColor} from '../Card/common';
import {orange500} from 'material-ui/styles/colors';

class Home extends React.Component {
    get styles() {
        const centerDiv = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
        return {
            container: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            },
            content: {
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'space-around',
                justifyContent: 'flex-start',
                margin: '2%',
            },
            timeStats: {
                width: 500,
                height: 300,

            },
            pointsStats: {
                width: 500,
                height: 300,
            },
            totalPoints: {
                ...centerDiv, ...{
                    width: 200,
                    height: 200,
                    backgroundColor: blackColor,
                }
            },
            gamesLeft: {
                ...centerDiv, ...{
                    width: 200,
                    height: 200,
                    backgroundColor: orange500,
                }
            },
            charts: {

            },
            stats: {
                height: 500,
                marginLeft: '2%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around'
            },
            white: {
                color: 'white'
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <HomeHeader />
                <div style={this.styles.content}>
                    <div style={this.styles.charts}>
                        <TimeSpentStats style={this.styles.timeStats}/>
                        <PointsWonStats style={this.styles.pointsStats}/>
                    </div>
                    <div style={this.styles.stats}>
                        <div style={this.styles.totalPoints}>
                            <span style={this.styles.white}>260</span>
                        </div>
                        <div style={this.styles.gamesLeft}>
                            <span style={this.styles.white}>3</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Home;

Home.defaultProps = {};

Home.propTypes = {};