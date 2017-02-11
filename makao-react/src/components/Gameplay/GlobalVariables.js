import React from 'react';
import _ from 'lodash';
class GlobalVariables extends React.Component {
    constructor() {
        super();
        this.userId = 1;
        this.username = 'Masa'; //TODO odvoji u jedan objekat ili odbaci lastname
        this.userLastName = 'Djordjevic';
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

    initialize(user) {
        this.usedId = user.id;
        this.username = user.username;
    }
}
export default (new GlobalVariables);