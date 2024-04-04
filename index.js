const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

/* Routa na domovskou stránku http://localhost:3000/ */
app.get('/', function (req, res) {
  // console.log(req)
  res.render('index')
})

/* Routa na stránku http://localhost:3000/about */
app.get('/about', function (req, res) {
    res.render('about')
})

/* Routa na stránku http://localhost:3000/about */
/* Routa pro zpracování dat z formuláře */
app.post("/submit", (req, res) => {
  // Zde budeme ukládat data z formuláře do souboru responses.json
  const newResponse = {
    id: Date.now(), // Jednoduchý způsob, jak generovat unikátní ID
    timestamp: new Date().toISOString(),
    answers: req.body, // Předpokládáme, že všechny odpovědi jsou ve formátu, který chceme uložit
  };

  // Čtení stávajících dat z souboru
  fs.readFile("responses.json", (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);
    json.push(newResponse);

    // Zápis aktualizovaných dat zpět do souboru
    fs.writeFile("responses.json", JSON.stringify(json, null, 2), (err) => {
      if (err) throw err;
      console.log("Data byla úspěšně uložena.");
      res.redirect("/results"); // Přesměrování na stránku s výsledky
    });
  });
});

/* Routa pro zobrazení výsledků ankety */
app.get("/results", (req, res) => {
  // Zde bude načtení dat ze souboru responses.json a jejich předání do šablony
  fs.readFile('responses.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Nastala chyba při čtení dat.');
    }
    const responses = JSON.parse(data);
    res.render('results', { responses }); // Předání dat-odpovědí šabloně results.ejs
  });
});

app.listen(3000)