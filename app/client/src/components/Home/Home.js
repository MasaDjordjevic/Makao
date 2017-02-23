import React from 'react';
import TimeSpentStats from './TimeSpentStats';
import PointsWonStats from './PointsWonStats';
import {blackColor} from '../Card/common';
import DefaultTooltip from '../DefaultTooltip/DefaultTooltip';
import Leaderboards from './Leaderboards';
import Logo from '../Login/Logo';
import {lightWhite} from 'material-ui/styles/colors';
import UserStore from '../../stores/UserStore';

class Home extends React.Component {
    constructor() {
        super();

        this.state = {
            stats: {
                averageTimeSpent: 0,
                timeSpent: [0],
                scores: [0],
                totalScore: 0,
                gamesLeft: 0,
            },
        };

        this.onChange = this.onChange.bind(this);
    }

    get styles() {
        const scoreSize = 150;
        const leftSize = 40;
        const backgroundColor = lightWhite;
        const background = {
            borderRadius: '1%',
            backgroundColor: backgroundColor,
            boxShadow: 'rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px',
        };
        const stats = {
            ...background, ...{
                padding: '2% 0 1% 3%'
            }
        };

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
                ...stats, ...{
                    width: 650,
                }
            },
            pointsStats: {
                ...stats, ...{
                    width: 650,
                }
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
                ...background, ...{
                    width: scoreSize * 2 - leftSize,
                    height: scoreSize,
                    minHeight: scoreSize,
                    maxHeight: scoreSize,
                    marginBottom: 10,
                    display: 'flex',
                    borderRadius: '2%',
                }
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
                height: 0,
                borderLeft: (scoreSize - leftSize) + 'px solid rgba(0,0,0,0)',
                borderTop: '0 solid',
                borderBottom: scoreSize + 'px solid #d4494f',
                color: 'rgba(0,0,0,1)',
            },
            background: {
                borderRadius: '1%',
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


    padLeftArray(array, pad) {
        return Array(pad - array ? array.length : 0).fill(0).concat(array);
    }

    onChange() {
        let stat = UserStore.getState().stats;
        if(!stat){
            return;
        }
        let retVal = {};
        retVal.averageTimeSpent = stat.averageTimeSpent;
        retVal.timeSpent = this.padLeftArray(stat.timeSpent);
        retVal.scores = this.padLeftArray(stat.scores);
        retVal.totalScore = stat.totalScore;
        retVal.gamesLeft = stat.gamesLeft;
        this.setState({stats: retVal});
    };

    componentDidMount() {
        UserStore.listen(this.onChange);
    }

    componentWillUnmount() {
        UserStore.unlisten(this.onChange);
    }


    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.leftPane}>
                    <div style={this.styles.scoreLeft}>
                        <DefaultTooltip tooltip="Total points won" tooltipPosition="bottom-left">
                            <div style={this.styles.score}>
                                <span style={this.styles.scoreText}>{this.state.stats.totalScore}</span>
                            </div>
                        </DefaultTooltip>
                        <DefaultTooltip tooltip="Games left" tooltipPosition="bottom-left">
                            <div style={this.styles.left}>
                                <span style={this.styles.leftText}>{this.state.stats.gamesLeft}</span>
                            </div>
                        </DefaultTooltip>
                    </div>
                    <Leaderboards style={this.styles.background}/>
                </div>
                <div style={this.styles.charts}>
                    <TimeSpentStats style={this.styles.timeStats}
                                    average={this.state.stats.averageTimeSpent}
                                    timeArray={this.state.stats.timeSpent}/>
                    <PointsWonStats style={this.styles.pointsStats}
                                    scoresArray={this.state.stats.scores}/>
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