import React from 'react';
import TextField from 'material-ui/TextField';

class RulesSetter extends React.Component {
    constructor(){
        super();
        const inputs = [
            {
                key: 'gameLimit',
                text: 'Igra se do + -',
                defaultValue: 300,
            },
            {
                key: 'timeLimit',
                text: 'Vreme za odigravanje poteza',
                defaultValue: 10,
            },
            {
                key: 'playerNumberMin',
                text: 'Minimalan broj igraca',
                defaultValue: 3,
            },
            {
                key: 'playerNumberMax',
                text:'Maksimalan broj igraca',
                defaultValue: 8,
            },
            {
                key: 'deckNumber',
                text: 'Broj spilova',
                defaultValue: 2,
            },
            {
                key: 'rankFilter',
                text: 'Rank filter',
                defaultValue: 2,
            }
        ];
        let keys =  {};
        inputs.map((input, _) => keys[input.key] = input.defaultValue);
        this.state = {
            inputs: inputs,
            values: keys,
        };


        this.handleInputChange = this.handleInputChange.bind(this);

    }

    componentDidMount(){
        this.props.onChange(this.state.values);
    }

    handleInputChange(prop, val) {
        let values= this.state.values;
        values[prop] = +val;
        this.setState({values: values});
        this.props.onChange(values);
    }

    get styles() {
        return {
            container: {
                paddingLeft: 16
            },
            numberInput: {
                width: 50
            },
            optionContainer: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                {
                    this.state.inputs.map((input, i) =>
                    <div style={this.styles.optionContainer}
                         key={input.key}>
                        <span>{input.text} &nbsp;</span>
                        <TextField
                            id={input.key}
                            style={this.styles.numberInput}
                            type="number"
                            onChange={(e, v) => this.handleInputChange(input.key, v)}
                            defaultValue={input.defaultValue}
                        />
                    </div>
                    )
                }

            </div>
        );
    }
}
export default RulesSetter;

RulesSetter.defaultProps = {};

RulesSetter.propTypes = {};