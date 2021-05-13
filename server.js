const express = require('express');
const path = require('path');
const compression = require('compression')
const app = express();
app.use(compression());
// Serve only the static files form the dist directory
app.use(express.static('./dist/ironsource-assignment'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'/dist/ironsource-assignment/index.html'))
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);