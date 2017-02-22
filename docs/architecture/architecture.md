


Arhitektura aplikacije Makao
================

U ovom dokumentu biće predstavljena osnovna struktura aplikacije makao kao i projektni obrasci koji su korišćeni prilikom projektovanja.

Slojeviti klijent-server
---------------------

Aplikacija ima dvoslojnu klijent-server arhitekturu. Slojevi su:

SLIKA

- **klijentski sloj**
 - korisnički interfejs
 - obrada dozvoljenih poteza
- **serverski sloj**
 - upravljanje bazom podataka
 - aplikaciona logika

Odlučili smo se za dvoslojnu arhitekturu iz sledećih razloga:

 - Deo obrade poteza mora postojati i na klijentu, kako korisnik ne bi morao da čeka na odgovor sa servera prilikom svakog svog klika. Ovo takođe omogućava raspodelu poslova, gde klijent brine o tome da je serveru poslao potez koji je sigurno korektan a server brine o odigravanju poteza. Obrada poteza je detaljno objašnjena u ....
 - Serverski sloj upravlja bazama podataka. Ovo se možda može klasifikovati kao podsloj, jer je logika za samu komunikaciju sa bazom potuno odvojena. Upravljanje redisom je moguće samo kroz njegov API a mongodb se koristi upravljanjem njegovih modela. Iako aplikaciona logika i upravljanje bazom podataka nisu striktno izdvojeni, predstavljaju dve posebne logičke celine.

FLUX
----------

Flux je arhitektura koju Facebook koristi za kreiranje klijentskih strana web aplikacija i koja se lepo uparuje sa Reactom. Suština ovog obrasca je jednosmerni tok podataka. 

Četiri osnovna elementa Flux aplikacija su: akcije, dispečer, skladište i pogled.

![Flux general architecture](images/flux-general.png)

**Dispečer** je na neki način centralna tačka koja upravlja tokom podataka u Flux arhitekturi. On predstavlja "glupu" komponentu koja je u suštini registar *callback* funkcija skladišta i pruža jednostavni mehanizam za distribuiranje akcija ka skladištima.

Dispečer raspolaže metodom koja nam omogućava da pošaljemo obaveštenje i propratne podatke, što ukratko nazivamo izazivanjem ili slanjem **akcije**.

**Skladište** čuva stanje aplikacije. Ne postoji samo jedno skladište već više njih, i svako čuva stanje vezano za određeni domen u okviru aplikacije.

![Flux React architecture](images/flux-react.png)

Ova arhitektura podseća na mešavinu implicintnog pozivanja i obrasca skladište jer je osnovna ideja da komponente osluškuju jedinstveni izvor podataka i reaguju na njegove promene.
Akcije su najčešce akcije korisnika sa pogledom (komponentom) koje se prosleđuju dispečeru. Skladište reaguje na poziv, vrši obradu i menja svoje stanje. Nakon završetka izmene stanja, skladište šalje poruku da je došlo do promene njegovog stanja komponentama koje osluškuju to skladište.

U slučaju komunikacije sa serverom preko poruka korišćenjem soketa, odnos sa serverom je implementiran u komponentama koje omotavaju određeni deo aplikacije i vrše razmenu poruka vezanih za taj deo. Konkretni primeri ovih komponenti navedeni su u delu *publish-subscribe*.

![Flux sockets](images/flux-sockets.png)

U slučaju prijavljivanja i registrovanja, komunikacija sa serverom ne ide preko sistema poruka već preko HTTP protokola. U tom slučaju akcije vrše komunikaciju sa serverom i prosleđuju rezultat skladištu.

Više o konkretnim skladištima....

Publish-subscribe
-----------------------

Razmena poruka u realnom vremenu između klijenata i servera se odvija po publish-subscribe obrascu. Svaku razmenu poruka započinje klijent koji se konektuje i traži autentikaciju na osnovu svog tokena (*JWT - JSON Web Tokens*). Server proverava identitet korisnika i odobrava mu ili zabranjuje dalju komunikaciju. Ovaj obrazac je implementiran u nekoliko komponenti: 

- *AppSocketWrapper* - ova komponenta je prisutna na svim stranicama aplikacije kojima prijavljeni korisnik ima pristup. Ova komponenta komunicira sa serverom kako bi omogućila korisniku da šalje i prima zahteve za prijateljstvo kao i da prima pozive za učešće u igri.
- *PlaySocketWrapper* - komponenta koja vrši komunikaciju sa serverom u slučaju kreiranja nove igre ili uključivanja u postojeću igru iz liste javnih igara.
- *LobbySocketWrapper* - komponenta koja je zadužena za inicijalizaciju igre, mesto gde se skupljaju igrači pre nego što sama igra počne. Komunicira sa serverom kako bi ispitala stanje igre i odlučila da li je korisniku dozvoljen pristup lobiju određene igre. Omogućava praćenje stanja svih igrača koji su prisutni u lobiju, odnosno da li su spremni za početak igre ili ne. Takođe omogućava pozivanje prijatelja u igru.
- *GameSocketWrapper* - komponenta koja je zadužena za komunikaciju sa serverom u vezi sa tokom same igre. Sve pribavljene podatke prosleđuje komponenti koja prikazuje samu igru.
- *ChatSocketWrapper* - komponenta koja omogućuje ćaskanje u toku same igre.

Detaljnije o komunikaciji ovih komponenti sa serverom na....

