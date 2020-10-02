const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('build'));

app.use('/isAlive', (req, res) => {
    res.sendStatus(200);
});

const port = 8080;
app.listen(port, (error) => {
    if (error) {
        console.error(error);
    }
    console.log('Listening on port', 8080);
});
