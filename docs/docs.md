Makao
===================

Makao je veb-aplikacija koja omogućuje korisnicima igranje popularne kartaške igre makao.  Korisnici ove aplikacije mogu da igraju igru kako sa svojim prijateljima tako i sa drugim korisnicima, odnosno, moguće je kreirati i privatnu i javnu partiju.

----------


Funkcionalnosti
-------------

#### <i class="icon-cog"></i> Sama igra

S obzirom na popularnost ove kartaške igre nećemo se baviti samom igrom i njenim specifičnostima. Korisnicima pored same igre treba omogućiti **ćaskanje** odnosno *chat* i obezbediti mogućnost biranja **pravila** kao što su: 

- dužina partije odnosno broj poena koje je potrebno osvojiti kako bi igra bila gotova
- dozvoljeno vreme za odigravanje poteza
- minimalan broj igrča potreban za početak igre
- maksimalan broj igrača koji može učestvovati u igri
- broj špilova sa kojima se igra
- rank filter koji omogućava filtriranje igrača po njihovom ukupnom skoru
- dostupnost igre (privatna ili javna)



#### <i class="icon-user"></i>Korisnici

- nalog gde se pamte njihovi rezultati kao i veze sa ostalim korisnicima
- stvaranje prijateljstva kao i pozivanje prijatelja u igru
- uvid u svoju statistiku i rang liste

----------


Tehnologije
-------------------

###Okruženje
**Node.js** je rantajm sistem ili sistem izvršavanja koji koristi događajima vođen model koji je pogodan za tip aplikacije koji je nama potreban odnosno aplikacije u realnom vremenu. Iako nije JavaScript frejmvork, većinom je pisan u JavaScriptu i developeri mogu pisati nove komponente u JavaScriptu što nam omogućava da i frontend i bekend budu pisani u istom jeziku što olakašava razvoj aplikacije.

###Baze podataka
####Redis
Redis je *key-value* NoSQL baza podataka otvorenog koda koja se nalazi u memoriji što je čini jako brzom i obično se koristi kao keš ili za prenos podataka. Mi ćemo je koristiti za čuvanje podataka o igrama koje su u toku, razgovora u samim igrama i pozivima korisnika za učešće u igri. 

Kako se ova baza podataka nalazi u memoriji, potrebna nam je baza podataka koja je će trajno čuvati podatke.
####MongoDB
MongoDB je višeplatformska NoSQL baza podataka zasnovana na čuvanju dokumenata. Mi ćemo je koristiti za čuvanje podataka o igračima, njihovim vezama i završenim partijama.

###Frejmvorci i jezici
####Express.js
Express.js je frejmovork otvorenog koda za Node.js koji pruža mnogo mogućnosti za razvoj web aplikacija.
 
###Biblioteke i jezici
####React 
React je JavaScript biblioteka otvorenog koda namenjena izradi korisničkih interfejsa. Baziran je na komponentama što, pored modularnosti, olakšava razdvajanje problema i poštovanje principa pojedinačne odgovornosti. 

####JSX
React komponente su pisane u JSX-u, JavaSript proširenoj sintaksi koja dozvoljava korišćenje HTML tag sintakse za rederovanje subkomponenti. Nakon kompajliranja JSX izrazi postaju JavaScript objekti što nam dozvoljava korišćenje ovih izrazima u `if` naredbama, `for` petljama, naredbama dodele i slično. Zbog mešanja HTML sintakse sa JavaScriptom naziva se i sintaksa smešnih tagova.

####Alt
Alt je biblioteka koja olakšava rukvanje stanjem aplikacije u okviru JavaScript aplikacija. Modulirana je po fluxu, arhitekturnom obrazcu za kreiranje kompleksnih korisničkih interfejsa. Ona izbegava MVC u korist jednosmernog toka podataka. 

###Paketi
Navešćemo nekoliko paketa koji nisu karakteristični za većinu React aplikacija.
####Frontend 
- chart.js - iscrtava HTML5 grafikone koristeći kanvas
- radium - omogućava pisanje inline stilova sa dodatnim mogućnostima
- material-ui - skup komponenti koje implementiraju guglovu *Material Desing* specifikaciju
- socket.io - omogućava dvosmernu komunikaciju u realnom vremenu baziranu na događajima

####Bekend
- concuretntly - omogućava pokretanje više procesa konkurentno
- jsonwebtoken - implementacija jwt-a, olakšava proces autentikacije

Zaduženja
-------------

Nikola Mitić će voditi računa o bazama podataka, Miloš Jajac o toku igre na bekendu, dok će Marija Đorđević bitij zadužena za frontend deo aplikacije.

> **Note:**

>  Rešili smo da koristimo tehnologije koje ranije nismo i da naučimo nešto novo. To će vrlo verovatno prouzrokovati promenu ovog fajla nakon upoznavanja sa tehnologijama.

