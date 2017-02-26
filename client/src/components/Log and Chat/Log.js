import React from 'react';
import LogEntry from './LogEntry';
import Card from '../Card/Card';
import ReactDOM from 'react-dom';
import UserStore from '../../stores/UserStore';

class Log extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            me: UserStore.getState(),
            logs: [],
            socketInit: false,
        };

        this.handleNewLog = this.handleNewLog.bind(this);
        this.handleLogsInit = this.handleLogsInit.bind(this);
    }

    handleLogsInit(logs) {
        if (!logs) {
            logs = [];
        }
        logs.map((log) => log.card ? log.card = new Card(log.card) : log);
        this.setState({logs: logs});
    }

    handleNewLog(logs) {
        if (!logs) {
            logs = [];
        }
        logs.map((log) => log.card ? log.card = new Card(log.card) : log);
        let newLog = [...this.state.logs, ...logs];
        this.setState({logs: newLog});
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.socketInit && nextProps.socket) {
            this.setState({socketInit: true});
            nextProps.socket.emit('log:get', this.props.creatorUsername);
            nextProps.socket.on('log:get', this.handleLogsInit);
            nextProps.socket.on('log:new', this.handleNewLog);
        }
    }

    componentDidMount() {
        if (this.props.logs) {
            this.setState({logs: this.props.logs});
        }
    }

    componentWillUpdate() {
        const node = ReactDOM.findDOMNode(this).parentElement;
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    }


    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this).parentElement;
        node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
    }

    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            },
            logContainer: {
                display: 'flex',
                flexDirection: 'column',
                marginTop: '5%',
            }

        }
    }

    render() {
        let logs = JSON.parse(JSON.stringify(this.state.logs));
        logs.map((log) => log.card ? log.card = new Card(log.card) : log);
        logs.forEach((log, index) => {
            if (!log.message) {
                log.message = "";
            }
            if (log.draw) {
                log.message += 'draw' + (log.username === this.state.me.username ? '' : 's') + ' ' + (log.draw > 1 ? log.draw : '');
            }
        });
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.logContainer}>
                    {
                        logs.map((log, index) =>
                            <LogEntry key={index}
                                      log={log.message}
                                      win={log.win}
                                      playerName={(this.props.alwaysDisplayUsername || log.username !== this.state.me.username || log.win) && log.username}
                                      left={this.props.alwaysDisplayUsername || log.username !== this.state.me.username}
                                      card={log.card}/>
                        )
                    }
                </div>
            </div>
        );
    }
}
export default Log;

Log.defaultProps = {
    logs: [
        {
            username: 'masa',
            message: '',
            card: new Card('spades', '7'),
        },
        {
            username: 'darko',
            message: 'vuce 3',
        },
        {
            username: 'nikolica',
            card: new Card('hearts', '12'),
        },
    ],
};

Log.propTypes = {
    logs: React.PropTypes.array.isRequired,
    alwaysDisplayUsername: React.PropTypes.bool
};