HexWars
===================

HexWars je igra za najmanje 2 igrača. Igra se igra na tabli čija polja su heksagoni i cilj svakog igrača je da izgradi što bolju poziciju na tabli. On to čini na tri načina:  *zarada* gde pronalazi i koristi izvor resursa, *napad* gde proširuje svoju teritoriju i ugrožava okolne protivnike i *odbrana* gde se brani od istih.

----------


Funkcionalnosti
-------------

#### <i class="icon-refresh"></i> Sama igra

Osnovni tok igre je ukratko: Igrač gradi svoju poziciju na tabli koristeći resurse koji se već nalaze na tabli. Gradi svoje objekte odabirom iz ponuđenog skupa objekata. Oni ili donose prihode ili pomažu u napadu tj. odbrani. 

#### <i class="icon-user"></i>Korisnici

Korisnici imaju svoj nalog gde se pamte njihovi rezultati kao i veze sa ostalim korisnicima.

----------


Tehnologije
-------------------

Kao glavni frontend frejmvork koristićemo ReactJS.
Kao glavni bekend frejmvork koristićemo Python frejmvork Tornado.
Baza podataka koja ce služiti za sam tok igre će biti Redis.
Baza podataka za korisničke naloge i njihove aktivnosti biće MongoDB.

----------

Zaduženja
-------------

Nikola Mitić će voditi računa o bazama podataka, Miloš Jajac o toku igre na bekendu, dok će Marija Ðordevic biti zadužena za frontend deo aplikacije.

> **Note:**

>  Rešili smo da koristimo tehnologije koje ranije nismo i da naucimo nešto novo. To će verovatno prouzrokovati promenu ovog fajla nakon upoznavanja sa tehnologijama.