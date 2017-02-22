


Arhitektura aplikacije Makao
================

U ovom dokumentu bice predstavljena osnovna struktura aplikacije makao kao i projektni obrasci koji su korišceni prilikom projektovanja.

Slojeviti klijent-server
---------------------

Aplikacija ima dvoslojnu klijent-server arhitekturu. Slojevi su:

SLIKA

- **klijentski sloj**
 - korisnicki interfejs
 - obrada dozvoljenih poteza
- **serverski sloj**
 - upravljanje bazom podataka
 - aplikaciona logika

Odlucili smo se za dvoslojnu arhitekturu iz sledecih razloga:

 - Deo obrade poteza mora postojati i na klijentu, kako korisnik ne bi morao da ceka na odgovor sa servera prilikom svakog svog klika. Ovo takode omogucava raspodelu poslova, gde klijent brine o tome da je serveru poslao potez koji je sigurno korektan a server brine o odigravanju poteza. Obrada poteza je detaljno objašnjena u ....
 - Serverski sloj upravlja bazama podataka. Ovo se možda može klasifikovati kao podsloj, jer je logika za samu komunikaciju sa bazom potuno odvojena. Upravljanje redisom je moguce samo kroz njegov API a mongodb se koristi upravljanjem njegovih modela. Iako aplikaciona logika i upravljanje bazom podataka nisu striktno izdvojeni, predstavljaju dve posebne logicke celine.

FLUX
----------

Flux je arhitektura koju Facebook koristi za kreiranje klijentskih strana web aplikacija i koja se lepo uparuje sa Reactom. Suština ovog obrasca je jednosmerni tok podataka. 

Cetiri osnovna elementa Flux aplikacija su: akcije, dispecer, skladište i pogled.

![Flux general architecture](images/flux-general.png)

**Dispecer** je na neki nacin centralna tacka koja upravlja tokom podataka u Flux arhitekturi. On predstavlja "glupu" komponentu koja je u suštini registar *callback* funkcija skladišta i pruža jednostavni mehanizam za distribuiranje akcija ka skladištima.

Dispecer raspolaže metodom koja nam omogucava da pošaljemo obaveštenje i propratne podatke, što ukratko nazivamo izazivanjem ili slanjem **akcije**.

**Skladište** cuva stanje aplikacije. Ne postoji samo jedno skladište vec više njih, i svako cuva stanje vezano za odredeni domen u okviru aplikacije.

![Flux React architecture](images/flux-react.png)

Ova arhitektura podseca na mešavinu implicintnog pozivanja i obrasca skladište jer je osnovna ideja da komponente osluškuju jedinstveni izvor podataka i reaguju na njegove promene.
Akcije su najcešce akcije korisnika sa pogledom (komponentom) koje se prosleduju dispeceru. Skladište reaguje na poziv, vrši obradu i menja svoje stanje. Nakon završetka izmene stanja, skladište šalje poruku da je došlo do promene njegovog stanja komponentama koje osluškuju to skladište.

U slucaju komunikacije sa serverom preko poruka korišcenjem soketa, odnos sa serverom je implementiran u komponentama koje omotavaju odredeni deo aplikacije i vrše razmenu poruka vezanih za taj deo. Konkretni primeri ovih komponenti navedeni su u delu *publish-subscribe*.

![Flux sockets](images/flux-sockets.png)

U slucaju prijavljivanja i registrovanja, komunikacija sa serverom ne ide preko sistema poruka vec preko HTTP protokola. U tom slucaju akcije vrše komunikaciju sa serverom i prosleduju rezultat skladištu.

Više o konkretnim skladištima....

Publish-subscribe
-----------------------

Razmena poruka u realnom vremenu izmedu klijenata i servera se odvija po publish-subscribe obrascu. Svaku razmenu poruka zapocinje klijent koji se konektuje i traži autentikaciju na osnovu svog tokena (*JWT - JSON Web Tokens*). Server proverava identitet korisnika i odobrava mu ili zabranjuje dalju komunikaciju. Ovaj obrazac je implementiran u nekoliko komponenti: 

- *AppSocketWrapper* - ova komponenta je prisutna na svim stranicama aplikacije kojima prijavljeni korisnik ima pristup. Ova komponenta komunicira sa serverom kako bi omogucila korisniku da šalje i prima zahteve za prijateljstvo kao i da prima pozive za ucešce u igri.
- *PlaySocketWrapper* - komponenta koja vrši komunikaciju sa serverom u slucaju kreiranja nove igre ili ukljucivanja u postojecu igru iz liste javnih igara.
- *LobbySocketWrapper* - komponenta koja je zadužena za inicijalizaciju igre, mesto gde se skupljaju igraci pre nego što sama igra pocne. Komunicira sa serverom kako bi ispitala stanje igre i odlucila da li je korisniku dozvoljen pristup lobiju odredene igre. Omogucava pracenje stanja svih igraca koji su prisutni u lobiju, odnosno da li su spremni za pocetak igre ili ne. Takode omogucava pozivanje prijatelja u igru.
- *GameSocketWrapper* - komponenta koja je zadužena za komunikaciju sa serverom u vezi sa tokom same igre. Sve pribavljene podatke prosleduje komponenti koja prikazuje samu igru.
- *ChatSocketWrapper* - komponenta koja omogucuje caskanje u toku same igre.

Detaljnije o komunikaciji ovih komponenti sa serverom na....

