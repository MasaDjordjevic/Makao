import React from 'react';
import _ from 'lodash';
class GlobalVariables extends React.Component {
    constructor() {
        super();
        this.userId = '';
        this.username = '';
        this.handLength = 5;

        this.players = [
            {id: 1, name: 'Masa'},
            {id: 2, name: 'Jajac'},
            {id: 3, name: 'Nikolica'},
            {id: 4, name: 'Nemanja'},
            {id: 5, name: 'Darko'},
        ];
        this.playersById = _.keyBy(this.players, 'id');

        this.initialize = this.initialize.bind(this);
    }

    isSet() {
        return !!this.username;
    }

    initialize() {
        fetch('/user/data')
        .then((res) => {
            return res.json();
        }).then((user) => {
            this.usedId = user.id;
            this.username = user.username;
        });
    }
}
export default (new GlobalVariables());