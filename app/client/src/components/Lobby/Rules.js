import React from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';


class Rules extends React.Component {
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

    componentWillMount(){
        if(this.props.rules && this.props.onChange) {
            console.log('[Rules] Error: rules and onChange set, can\'t be both' );
        }
        if(this.props.rules){
            const values = Object.assign({}, this.state.values);
            const rules = this.props.rules;
            Object.keys(rules).forEach(function(key,index) {
                values[key] = rules[key];
            });
            this.setState({values: values});
        }
    }

    componentDidMount(){
        this.props.onChange && this.props.onChange(this.state.values);
    }

    handleInputChange(prop, val) {
        let values= this.state.values;
        values[prop] = +val;
        this.setState({values: values});
        this.props && this.props.onChange(values);
    }

    get styles() {
        const numWidth = 50;
        return {
            container: {
                paddingLeft: 16
            },
            numberInput: {
                width: numWidth
            },
            span: {
                width: numWidth,
                textAlign: 'center',
            },
            optionContainer: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 48
            },
            checkbox: {
                marginLeft: 'auto',
                width: 'inherit',
            }
        }
    }

    renderTextfield(input){
        return (
            <TextField
                id={input.key}
                style={this.styles.numberInput}
                type="number"
                onChange={(e, v) => this.handleInputChange(input.key, v)}
                defaultValue={this.state.values[input.key]}
            />
        )
    }

    renderSpan(input){
        return (<span  style={this.styles.span}>{this.state.values[input.key]}</span>);
    }

    render() {
        const rules = !!this.props.rules;

        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                {
                    this.state.inputs.map((input, i) =>
                    <div style={this.styles.optionContainer}
                         key={input.key}>
                        <span>{input.text} &nbsp;</span>
                        {rules ? this.renderSpan(input) : this.renderTextfield(input)}
                    </div>
                    )
                }
                <div style={this.styles.optionContainer}>
                    <span>Private&nbsp;</span>
                    <Checkbox style={this.styles.checkbox}
                    onCheck={(e, v) => this.handleInputChange('private', v)}
                    disabled={rules}
                    checked={!!this.state.values.private}/>
                </div>


            </div>
        );
    }
}
export default Rules;

Rules.defaultProps = {};

Rules.propTypes = {
    onChange: React.PropTypes.func,
    rules: React.PropTypes.object,
};