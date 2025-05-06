# JS-mat-zad
Aplikace pro správu soukromých poznámek jako školní maturitní projekt.  
Uživatel si může založit účet, psát poznámky, označovat je jako důležité a účet kdykoliv smazat.  
Data jsou bezpečně uložena v cloudu pomocí Supabase.

## Použité technologie

- Node.js + Express.js
- Supabase – databáze
- EJS 
- Bootstrap 5 
- Express-session
- bcrypt


## instalace
1. Vytvořte nastavení prostředí `.env` v kořenovém adresáři projektu.
    => vložit do souboru: `SESSION_SECRET=nejake-heslo`
                          `SUPABASE_URL=https://xyzcompany.supabase.co`
                          `SUPABASE_KEY=public-anon-key`
2. V terminálu spusťte instalaci potřebných balíčků `npm install`.
3. Spuštění
   - Pro prohlížecí a testovací účely spusťte příkaz `node app.js`.
   - Pro vývojářské účely spusťte příkaz `npx nodemon app.js`.