import React, { Component } from 'react';
import './App.css';
import Card from "./Card/Card"

class App extends Component {
    get testCards(){
        return [
            {sym:"spades", num: "2" },
            {sym:"spades", num: "7" },
            {sym:"diamonds", num: "1" },
            {sym:"spades", num: "12" },
            {sym:"spades", num: "13" },
            {sym:"spades", num: "1" },

            {sym:"diamonds", num: "2" },
            {sym:"diamonds", num: "13" },
            {sym:"clubs", num: "1" },
            {sym:"clubs", num: "2" },
            {sym:"clubs", num: "10" },
            {sym:"clubs", num: "14" },
            {sym:"hearts", num: "3" },
            {sym:"hearts", num: "12" },
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
                <Card
                    symbol={card.sym}
                    number={card.num}
                    key={i.toString()}
                    cardHeight={310}/>
          )}
      </div>
    );
  }
}



export default App;
