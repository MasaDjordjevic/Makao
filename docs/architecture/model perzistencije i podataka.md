Model perzistencije i podataka
==========================

U ovom dokumentu bice opisani modeli podataka koje trajno cuvaju.
Modeli podataka na frontendu pripadaju jednoj od sledece tri grupe:
 -  podaci koji su dobijeni sistemom za razmenu poruka o kojima možete procitati više u...
 - podaci koji se cuvaju u skladištimi o kojima možete procitati više u...
 - podaci koje same komponente koriste za prikaz koji su opisani na kraju svake komponente. Nalaz se `propTypes` koji opisuje podatke koje komponenta ocekuje i njihov tip ili oblik.

Šema baze podataka
--------------------------
####MongoDB
Kao maper za MongoDB korišcen je Mongoose. 
Šema za usera
Šema za partiju
...


####Redis

Za pristup bazi korišcen je redis klijent za node.js koji implementira sve Redis komande.

| Key							| Value type | Value |
| :------- 						| :----: | ---: |
| `socket:username` | string|  socketId (string) koji odgovara tom korisniku   |
| `game:chat`| lista | poruke jedne partije |
| `game:username`| string   |  objekat koji sadrži sve podatke o samoj igri  |
| `game:username:socket` | hash| key je username a value njegov socketId |
| `game:username:lobby` | hash | key je username a value njegov status (ready)|
| `game:username:invites` | skup | skup korisnika koji su pozvani u igru|
| `games:lobby` | skup | skup igara koje su keirane a nisu zapocete|
| `games:started` | skup | skup zapocetih igara|

> **Napomena:** username nije kljucna rec vec predstavlja username korisnika. U kljucevima oblika `game:` username oznacava username kreatora igre. On je ustvari sam kljuc te igre jer jedan korisnik može imati (kreirati i igrati) samo jednu igru u jednom trenutku.

Odlucili smo se da samu partiju cuvamo kao string, odnosno da jedan objekat cuva sve potrebne informacije jer je prilikom odigravanja poteza igraca potreban uvid u vecinu polja tog objekta (lista karata igraca, lista karata na talonu, lista karata za izvlacenje, lista igraca, njhov status i broj karata...). Pa kako je redis key-value baza podataka odabrali smo flat pristup gde korisnik uvek ima pristup celom objektu, kako bi smanjili broj poziva baze i vreme potrebno za pribavaljanje a kasnije i cuvanje tih podataka.

Redis ne brine (i ne interesuje ga) sadržaj odnosno sturktura samih podataka koje cuva, što izmenu cini jako jednostavnom. 
