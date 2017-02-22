Poruke
=======

U ovom dokumentu bice objašnjena struktura poruka koje razmenjuju klijent i server.

##Chat

U toku igre, radi razmenjivanja poruka, komuniciraju `ChatSocketWrapper` na frontendu i `chatSocket` na bekendu.

```
{
	message: string;
	username: string;
	time: Date;
}
```

##Game

U toku same igre komuniciraju `GameSocketWrapper` na fronendu i `gameSocket` na bekendu.

###Poruke servera

 - `init` message i `newHand` message: 
 
 ```
 {
	 players[]: {
					username: string,
					online: bool,
					cardNumber: number
				} //lista svih igraca
	 cards[]: object(Card), //lista karata tog igraca
	 talon[]: object(Card),
	 playerOnMove: string, //username
	 scores[]: [{username: string, score: number}, ...] //niz rundi, gde svaka runda ima niz igraca
	 moveTime: number //dozvoljeno vreme za odigravanje poteza u sekundama	 	 
 }
 ```
 - `user:join` i `user:left` i `play:playerOnMove`

 ```
 username: string
 ```
 - `play:move`

 ```
 username: string
 card: object(Card)
 ```
 - `play:draw`

 ```
 username:string,
 cardsNumber: number
 ```
 - `play:get`

 ```
 cards[]: object(Card)
 ```
 - `game:over`

 ```
 scores[]: [{username: string, score: number}, ...] //obuhvata rezultate cele igre

 ```
 - `game:kicked` i `game:everyoneLeft` ne šalju podatke
 
 > tip podatka object(Card) je zapravo obican JavaScript objekat koji samo odgovara strukturi klase Card koja postoji na frontendu.

###Poruke klijenta

- `join` `(creatorUsername, myUsername)`
- `myMove` 
- `play:pass` 
- `play:move` `(Card)`
- `play:draw` 

##Lobby

##Header
