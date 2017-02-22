import React from 'react';
import TimeSpentStats from './TimeSpentStats';
import PointsWonStats from './PointsWonStats';
import {blackColor, redColor} from '../Card/common';
import DefaultTooltip from '../DefaultTooltip/DefaultTooltip';
import Leaderboards from './Leaderboards';
import Logo from '../Login/Logo';

class Home extends React.Component {
    get styles() {
        const centerDiv = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
            borderRadius: '3%',
        };
        const scoreSize = 150;
        const leftSize = 40;
        return {
            container: {
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                overflow: 'hidden',
                boxSizing: 'border-box',
                padding: '3% 0 2% 2%',
            },
            timeStats: {
                width: 500,
            },
            pointsStats: {
                width: 700,
            },
            leftPane: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            },
            charts: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginLeft: '10%'
            },
            scoreText: {
                color: blackColor,
                fontSize: 70,
                marginTop: -125,
                marginLeft: scoreSize * 0.2,
            },
            leftText: {
                color: 'white',
                fontSize: 45,
                marginTop: 85,
                marginLeft: -40,
            },
            scoreLeft: {
                width: scoreSize * 2 - leftSize,
                height: scoreSize,
                display: 'flex',
                borderRadius: '2%',
                overflow: 'hidden',
                backgroundColor: 'rgb(250, 250, 250)',
                boxShadow: 'rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px',
            },
            score: {
                display: 'flex',
                boxSizing: 'content-box',
                width: scoreSize,
                height: 0,
                borderRight: (scoreSize - leftSize) + 'px solid rgba(0,0,0,0)',
                borderBottom: '0 solid',
                borderTop: scoreSize + 'px solid rgba(0,0,0,0)',
                color: 'rgba(0,0,0,1)',
            },
            left: {
                display: 'flex',
                marginLeft: -(scoreSize - leftSize),
                boxSizing: 'content-box',
                width: 0,
                height: 0,
                borderLeft: (scoreSize - leftSize) + 'px solid rgba(0,0,0,0)',
                borderTop: '0 solid',
                borderBottom: scoreSize + 'px solid #d4494f',
                color: 'rgba(0,0,0,1)',
            },
            background: {
                borderRadius: '2%',
                backgroundColor: 'rgb(250, 250, 250)',
                boxShadow: 'rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px',
            },
            logoWrapper: {
                display: 'flex',
                position: 'relative',
                width: '100%'
            },
            logo: {
                display: 'flex',
                width: '100%',
                height: '100%',
                transform: 'translate(50%, 50%)',
                position: 'absolute',
                opacity: 0.4
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>

                <div style={this.styles.leftPane}>
                    <div style={{...this.styles.background, ...this.styles.scoreLeft}}>
                        <DefaultTooltip tooltip="Total points won" tooltipPosition="top-right">
                            <div style={this.styles.score}>
                                <span style={this.styles.scoreText}>260</span>
                            </div>
                        </DefaultTooltip>
                        <DefaultTooltip tooltip="Games left" tooltipPosition="top-right">
                            <div style={this.styles.left}>
                                <span style={this.styles.leftText}>3</span>
                            </div>
                        </DefaultTooltip>

                    </div>

                    <Leaderboards style={this.styles.background}/>
                </div>
                <div style={this.styles.charts}>
                    <TimeSpentStats style={this.styles.timeStats}/>
                    <PointsWonStats style={this.styles.pointsStats}/>
                </div>
                <div style={this.styles.logoWrapper}>
                    <div style={this.styles.logo}>
                        <Logo cardHeight={500} cardNumber={4}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

Home.defaultProps = {};
Home.propTypes = {};