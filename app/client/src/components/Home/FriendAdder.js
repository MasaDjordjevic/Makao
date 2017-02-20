import React from 'react';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FlatButton from 'material-ui/FlatButton';

class FriendAdder extends React.Component {
    constructor() {
        super();
        this.state = {
            searchText: '',
        };

        this.handleSearchTextChanged = this.handleSearchTextChanged.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearchTextChanged(text) {
        if (text.charCodeAt(text.length - 1) === 10) { //enter (znam da je ruzno)
            this.handleSearch(text);
        } else {
            this.setState({searchText: text});
        }
    }

    handleSearch() {
        this.setState({searchText: this.state.searchText.trim()});
        this.props.onSearch(this.state.searchText);
    }

    get styles() {
        return {
            container: {
                height: 130,
                display: 'flex',
                flexDirection: 'column',
            },
            list:{
                marginRight: 16
            },
            noResults: {
                marginTop: 30,
                marginLeft: 16,
                display: 'block'
            },
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.search}>
                    <TextField
                        hintText="Type friends username"
                        multiLine={true}
                        rowsMax={1}
                        value={this.state.searchText}
                        onChange={(e, v) => this.handleSearchTextChanged(v)}/>
                    <FlatButton
                        primary={true}
                        icon={<SearchIcon />}
                        onClick={this.handleSearch}/>
                </div>
                <div>
                    {this.props.searchResults ?
                        <List style={this.styles.list}>
                            <ListItem
                                key={this.props.searchResults}
                                primaryText={this.props.searchResults}
                                leftAvatar={<Avatar>{this.props.searchResults.charAt(0)}</Avatar>}
                                onClick={() => this.props.onUserSelect(this.props.searchResults)}
                            />
                        </List>
                        :
                        <span style={this.styles.noResults}>No results</span>
                    }
                </div>
            </div>
        );
    }
}
export default FriendAdder;

FriendAdder.defaultProps = {};

FriendAdder.propTypes = {
    searchResults: React.PropTypes.string,
    onSearch: React.PropTypes.func,
};