import React from 'react';
import HomeHeader from './HomeHeader';
import TimeSpentStats from './TimeSpentStats';
import PointsWonStats from './PointsWonStats';

class Home extends React.Component {
    get styles() {
        return {
            container: {
                width: '100%',
            },
            timeStats: {
                width: 500,
                height: 300,

            },
            pointsStats: {

            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <HomeHeader />

                <TimeSpentStats style={this.styles.timeStats}/>

            </div>
        );
    }
}
export default Home;

Home.defaultProps = {};

Home.propTypes = {};