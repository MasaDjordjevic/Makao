import React, { Component } from 'react';
import './App.css';
import Card from './Card/Card'
import CardComponent from "./Card/CardComponent"

class App extends Component {
    get testCards(){
        return [
            new Card("spades", "2"),
            new Card("spades", "7"),
            new Card("diamonds", "1"),
            new Card("spades", "12"),
            new Card("spades", "13"),
            new Card("spades", "1"),
            new Card("diamonds", "2"),
            new Card("diamonds", "13"),
            new Card("clubs", "1"),
            new Card("clubs", "2"),
            new Card("clubs", "10"),
            new Card("clubs", "14"),
            new Card("hearts", "3"),
            new Card("hearts", "12"),
        ];
    }
    get style(){
        return {
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignContent:"space-around",
            flexWrap: "wrap",
            backgroundColor: "#ECEFF1"
        };
    }
  render() {
    return (
      <div className="App" style={this.style}>
          {this.testCards.map((card, i)=>
                <CardComponent
                    card={card}
                    key={i.toString()}
                    cardHeight={310}/>
          )}
      </div>
    );
  }
}



export default App;
