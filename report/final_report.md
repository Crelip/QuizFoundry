# Beta report: beta_version

## Filip Hošták

## QuizFoundry

## Link na verejnú inštanciu projektu:

https://quizfoundry.surge.sh/

## Ako rozbehať vývojové prostredie

- Naklonovať si tento repozitár

### Frontend

- Nainštalovať si npm pomocou `apt install npm`
- V priečinku quizfoundry sa nachádza React frontend - keď si priečinok otvoríme v
  termináli, tak príkazom `npm start` ho spustíme
- na adrese "localhost:3000" by sa nám mal zobraziť frontend

### Backend

- Nainštalovať si PostgreSQL cez `apt install postgres`
- Spustiť príkaz `psql -U postgres` a potom zadať `CREATE DATABASE quizfoundrydb;` na vytvorenie databázy
- Nainštalovať si python3 cez `apt install python3`
- Stiahnuť si potrebné python package, teda `pip install django psycopg2 django-cors-headers djangorestframework`
- V priečinku quizfoundry_backend sa nachádza Django backend, vstúpime doň
- Pred prvým spustením backendu treba premigrovať databázu pomocou `python3 manage.py migrate`
- Teraz môžeme spustiť backend pomocou `python3 manage.py runserver`

## Implementované časti špecifikácie

- Tvorba nových kvízov
- Riešenie kvízov
- Backend v Django prepojený s PostgreSQL databázou
- Základná autentifikácia a registrácia používateľov

## Čo chýba voči špecifikácii

- Tvorba branching kvízov priamo v aplikácii sa nepodarila dobre dotiahnuť
- Multimédiá v jednotlivých otázkach

## Problémy

- Problémy som mal asi najviac s tým, že som činnosť na projekte odkladal
- Jedná sa o moje prvé stretnutie s Reactom + Djangom; s HTML, CSS a JS (aj jQuery)
  už mám z minulosti skúsenosti, ale aj to bolo už pomerne dávno (najmä Django bolo
  spočiatku celkom ťažké vzhľadom na potrebu pochopenia serializers, views, urls a
  chvíľu som sa trápil so správnym nabindovaním pathov pre REST API)
