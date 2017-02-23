import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';

export default class TimerProgress extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            completed: 0,
            timeLeft: null,
        };
    }

    componentDidMount() {
        this.setState({completed: this.props.length});
        this.timer = setTimeout(() => this.progress(this.props.length - 1), 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.timeLeft !== this.state.timeLeft) {
            this.setState({completed: this.props.timeLeft, timeLeft:newProps.timeLeft});
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.progress(this.props.timeLeft - 1), 1000);
            return;
        }
        if (!this.props.reset && newProps.reset) {
            this.setState({completed: this.props.length});
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.progress(this.props.length - 1), 1000);
        }

    }


    progress(completed) {
        if (completed < 0) {
            this.setState({completed: 0});
            this.props.onTimeExpiration && this.props.onTimeExpiration();
        } else {
            this.setState({completed});
            this.timer = setTimeout(() => this.progress(completed - 1), 1000);
        }
    }

    render() {
        return (
            <LinearProgress mode="determinate"
                            value={this.state.completed}
                            min={0}
                            max={this.props.length}
                            style={this.props.style}/>
        );
    }
}


TimerProgress.propTypes = {
    length: React.PropTypes.number,
    onTimeExpiration: React.PropTypes.func,
    reset: React.PropTypes.bool,
};