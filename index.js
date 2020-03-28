const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const port = 3000;

let collectedStrings = [];

let currentRoundStrings = [];

app.get('/', (req, res) => {
  res.send(`<form method="POST" action="/submit-string">
  Kirjoita sanaehdotus tähän: 
  <input type="text" name="input" />
  <input type="submit" value="Ehdota" />
</form>
<form method="POST" action="/start-round">
  <input type="submit" value="Aloita kierros" />
</form>
<form method="POST" action="/random-word">
  <input type="submit" value="Poimi sana hatusta" />
</form>
`)
})

app.post('/submit-string', (req, res) => {
  console.log('Got item:', req.body);
  if (req.body.input !== undefined && req.body.input.trim() !== "") {
    const string = req.body.input.trim();
    if (collectedStrings.indexOf(string) >= 0) {
      res.send('<span style="color: red">Nyt tais tulla sama sana tuplana.</span><br><a href="/">koitapa uusiksi</a>');
    } else {
      collectedStrings.push(string);
      res.send('Vastaanotettiin: "' + req.body.input + '".<br/> Yhteensä kerättynä sanoja: ' + collectedStrings.length + '<br><a href="/">takas</a>');
    }
  } else {
    res.send('<span style="color: red">Joku meni vikaan.</span><br><a href="/">koitapa uusiksi</a>');
  }
});

app.post('/start-round', (req, res) => {
  currentRoundStrings = [...collectedStrings];
  res.send('Kierros aloitettu!' + '<br><a href="/">takas</a>');
});

app.post('/random-word', (req, res) => {
  if (currentRoundStrings.length == 0) {
    res.send('<span style="color: red">Joko sanat on loppu hatusta tai kierrosta ei ole vielä aloitettu!</span>' + '<br><a href="/">takas</a>');
  }
  const randomIndex = Math.floor(Math.random() * currentRoundStrings.length);
  const str = currentRoundStrings[randomIndex];
  currentRoundStrings.splice(randomIndex, 1);
  res.send(`<body style="font-size: 50px;">
  ${str}<br /><br />
  Sanoja jäljellä: ${ currentRoundStrings.length }<br />
  <form method="POST" action="/random-word">
    <input type="submit" style="padding: 30px;" value="Poimi sana hatusta" />
  </form>`);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})