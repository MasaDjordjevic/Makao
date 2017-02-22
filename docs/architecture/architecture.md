Arhitektura aplikacije Makao
================

U ovom dokumentu bice predstavljena osnovna struktura aplikacije makao kao i projekti obrasci koji su korišceni prilikom projektovanja.

Slojeviti klijent-server
---------------------

Aplikacije je dvoslojna klijent-server arhitektura. Slojevi su:

SLIKA

- klijentski sloj
 - korisnicki interfejs
 - obrada korektnosti poteza
- serverski sloj 
 - upravljanje bazom podataka
 - aplikaciona logika

Odlucili smo se za dvoslojnu arhitekturu iz sledecih razloga:

 - deo obrade poteza mora postojati i na klijentu, kako korisnik ne bi morao da ceka na odgovor sa servera prilikom svakog svog klika. Ovo takode omogucava raspodelu poslova, gde klijent brine o tome da je serveru poslao potez koji je sigurno korektan a server brine o odigravanju poteza. Obrada poteza je detaljno objašnjena u ....
 - serverski sloj upravlja bazama podataka. Ovo se možda može klasifikovati kao podsloj, jer je logika za samu komunikaciju sa bazom potuno odvojena. Upravljanje rediso je moguce samo kroz API a upravljanje mongom je moguce samo kroz njegove modele. Iako aplikaciona logika i upravljanje bazom podataka nisu striktno izdvojeni, predstavljaju dve posebne logicke celine.

FLUX
----------

Flux je arhitektura koju Facebook koristi za kreiranje klijentskih strana veb aplikacija pa smo je i mi iskoristili. Suština ovog obrazca je jednosmerni tok podataka. 

Tri osnovna elementa flux aplikacija su: dispecer, skladište i pogled (same React komponente).
SLIKA 
https://facebook.github.io/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png
http://engineering.kapost.com/wp-content/uploads/2015/05/figure4_3x13.png

https://blog.mozilla.org/standard8/files/2015/02/Screen-Shot-2015-02-09-at-20.33.39.png

http://yycjs.com/real-world-react/img/flux-architecture-2.png

https://cask.scotch.io/2014/10/rHwGUog.png

Ova arhitektura podseca mix implicintnog pozivanja i obrazca skladište jer je osnovna ideja da komponente osluškuju jedinstveni izvor podataka i reaguju na njegove promene.
Akcije su najcešce akcije korisnika sa pogledom (komponentom) koje prosledenje dispeceru. On, nakon svoje obrade, poziva sva skladišta koja su registrovana na njega. Skladište reaguje na poziv, vrši obradu i menja svoje stanje. Nakon izmene on šalje poruku da je došlo do promene njegovog stanja komponentama koje osluškuju to skladište.

U slucaju logovanja, komnukacija sa serverom ne ide preko sistema poruka vec preko HTTP protokola. U tom slucaju akcije su zadužene za preuzimanje podataka sa servera. 

SLIKA https://cask.scotch.io/2014/10/V70cSEC.png


Više o konkretnim skladištima....



Publish-subscribe
-----------------------

Razmena poruka u realnom vremenu izmedju klijenata i servera se odvija po publish-subscribe obrascu. Svaka razmena poruka zapocinje klijent koji se konektuje i traži autentifikaciju na osnovu svog jwt-a. Server proverava identitet korisnika i odobrava mu dalju komunikaciju ili ne. Ovaj obrazac je implementiran kroz neokoliko komponenti: 

- header: ova komponeneta je prisuta na svim stranicama aplikacije kojima korisnik koji je ulogovan ima pristup. Ova komponenta komunicira sa serverom kako bi omogucila korisniku da šalje i prima zahteve za prijateljstvo kao i da prima zahteve za ucešce u igri.
- lobby: komponenta koja je zadužena za inicijalizaciju igre, mesto gde se skupljaju igraci pre nego što sama igra pocne. Komunicira sa serverom kako bi ispitala stanje igre i odlucila da li je korisniku dozvoljen pristup lobiju odredene igre. Omogucava pracenje stanja svih igraca koji su prisutni u lobiju, odnosno da li su spremni za pocetak igre ili ne. Takode omogucava poziavanje prijatelja u igru.
- gameSocketWrapper: komponenta koja je zadužena za komunikaciju sa serverom  toku same igre. Sve podatke prosleduje komponenti koja prikazuje samu igru.
- chat: komponenta koja omogucuje caskanje u toku same igre

Detaljnije o komunikacji ovih komponenti sa serverom na....

