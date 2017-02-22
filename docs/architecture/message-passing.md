Razmena poruka
=======

U ovom dokumentu biće objašnjene komponente koje vrše komunikaciju sa serverom, kao i struktura poruka koje razmenjuju.

##Komponente

- *HeaderSocketWrapper* - ova komponenta je prisutna na svim stranicama aplikacije kojima prijavljeni korisnik ima pristup. Ova komponenta komunicira sa serverom kako bi omogućila korisniku da šalje i prima zahteve za prijateljstvo kao i da prima pozive za učešće u igri.
- *PlaySocketWrapper* - komponenta koja vrši komunikaciju sa serverom u slučaju kreiranja nove igre ili uključivanja u postojeću igru iz liste javnih igara.
- *LobbySocketWrapper* - komponenta koja je zadužena za inicijalizaciju igre, mesto gde se skupljaju igrači pre nego što sama igra počne. Komunicira sa serverom kako bi ispitala stanje igre i odlučila da li je korisniku dozvoljen pristup lobiju određene igre. Omogućava praćenje stanja svih igrača koji su prisutni u lobiju, odnosno da li su spremni za početak igre ili ne. Takođe omogućava pozivanje prijatelja u igru.
- *GameSocketWrapper* - komponenta koja je zadužena za komunikaciju sa serverom u vezi sa tokom same igre. Sve pribavljene podatke prosleđuje komponenti koja prikazuje samu igru.
- *ChatSocketWrapper* - komponenta koja omogućuje ćaskanje u toku same igre.

##HeaderSocketWrapper

###Poruke servera

 - `user:data`
 ```
 id: Object.id
 username: string
 friends[]: string
 friendRequests[]: string
 ```
 
 - `friend:added` i  `friend:ignore` i `friend:request:received`
 ```
 friendUsername: string
 ```
 
 - `invite:accepted` i `invite:remove`
 ```
 creatorUsername: string
 ```
 
 - `invite:rejected`
 ```
 message: string
 ```
 
 - `friend:find`
 ```
 username: string
 ```
 
 - `friend:request:sent` ne šalje podatke

##PlaySocketWrapper

TODO

##LobbySocketWrapper

TODO

##ChatSocketWrapper

U toku igre, radi razmenjivanja poruka komuniciraju `ChatSocketWrapper` na klijentu i `chatSocket` na serveru.

```
{
	message: string;
	username: string;
	time: Date;
}
```

##GameSocketWrapper

U toku same igre komuniciraju `GameSocketWrapper` na klijentu i `gameSocket` na serveru.

###Poruke servera

 - `init` i `newHand`: 
 
 ```
 {
	 players[]: {
					username: string,
					online: bool,
					cardNumber: number
				}
	 cards[]: object(Card), //lista karata tog igraca
	 talon[]: object(Card),
	 playerOnMove: string, //username
	 scores[]: [{username: string, score: number}, ...] //niz rundi gde svaka runda ima niz igraca
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

