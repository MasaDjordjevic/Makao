import React from 'react';
import HomeHeader from './HomeHeader';
import TimeSpentStats from './TimeSpentStats';
import PointsWonStats from './PointsWonStats';
import {blackColor, redColor} from '../Card/common';
import DefaultTooltip from '../DefaultTooltip/DefaultTooltip';
import Leaderboards from './Leaderboards';
import PlayGame from '../Lobby/PlayGame';

class Home extends React.Component {
    get styles() {
        const centerDiv = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
            borderRadius: '3%',
        };
        const totalPointsSize = 160;
        const gamesLeftSize = 100;
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
                    width: totalPointsSize,
                    height: totalPointsSize,
                    backgroundColor: blackColor,

                }
            },
            gamesLeft: {
                ...centerDiv, ...{
                    width: gamesLeftSize,
                    height: gamesLeftSize,
                    backgroundColor: redColor, //orange500,
                }
            },
            charts: {},
            stats: {
                height: 500,
                marginLeft: '2%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
            },
            text: {
                color: 'white',
                fontSize: 45
            },
            playButton: {
                margin: '240px 0 0 180px',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <HomeHeader socket={this.props.socket}/>
                <div style={this.styles.content}>
                    <div style={this.styles.charts}>
                        <TimeSpentStats style={this.styles.timeStats}/>
                        <PointsWonStats style={this.styles.pointsStats}/>
                    </div>
                    <div style={this.styles.stats}>
                        <DefaultTooltip tooltip="Total points won" tooltipPosition="top-right">
                            <div style={this.styles.totalPoints}>
                                <span style={this.styles.text}>260</span>
                            </div>
                        </DefaultTooltip>
                        <DefaultTooltip tooltip="Games left" tooltipPosition="top-right">
                            <div style={this.styles.gamesLeft}>
                                <span style={this.styles.text}>3</span>
                            </div>
                        </DefaultTooltip>

                    </div>
                    <PlayGame style={this.styles.playButton} />
                    <Leaderboards/>
                </div>
            </div>
        );
    }
}
export default Home;

Home.defaultProps = {};

Home.propTypes = {};