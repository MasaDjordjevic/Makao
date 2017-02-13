import React from 'react';
import _ from 'lodash';

class GlobalVariables extends React.Component {
    constructor() {
        super();
        this.handLength = 5;

        this.players = [
            {id: 1, name: 'Masa'},
            {id: 2, name: 'Jajac'},
            {id: 3, name: 'Nikolica'},
            {id: 4, name: 'Nemanja'},
            {id: 5, name: 'Darko'},
        ];
        this.playersById = _.keyBy(this.players, 'id');
    }
}
export default (new GlobalVariables());