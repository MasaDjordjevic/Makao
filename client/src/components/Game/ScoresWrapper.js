import React from 'react';
import Scores from './Scores';
import Timeline from 'material-ui/svg-icons/action/timeline';

class ScoresWrapper extends React.Component {
    constructor() {
        super();

        this.state = {
            hover: false,
            showScores: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showScores: nextProps.showScores});
    }

    get styles() {
        const boxSize = 24;
        return {
            container: {
                position: 'relative',
            },
            showIcon: {
                display: this.state.hover ? 'none' : 'flex',
                width: boxSize,
                height: boxSize,
                boxSizing: 'content-box',
                padding: 6,
                boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
                borderRadius: '2px',
                backgroundColor: 'white',
            },
            scoresContainer: {
                position: 'absolute',
                display: this.state.hover || this.state.showScores ? 'flex' : 'none',
                bottom: 0,
                left: 0,
                zIndex: 10,
            }
        }

    }

    handleHover() {
        if (this.state.showScores)
            return;
        this.setState({hover: !this.state.hover});
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.showIcon}
                     onMouseEnter={() => this.handleHover()}>
                    <Timeline />
                </div>
                <div style={this.styles.scoresContainer}
                     onMouseLeave={() => this.handleHover()}>
                    <Scores scores={this.props.scores}
                            height={this.props.height}/>
                </div>
            </div>
        );
    }
}
export default ScoresWrapper;

ScoresWrapper.defaultProps = {
    showScores: false,
};

ScoresWrapper.propTypes = {
    showScores: React.PropTypes.bool,
    height: React.PropTypes.number.isRequired,
};