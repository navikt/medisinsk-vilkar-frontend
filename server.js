const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('build'));

const port = 80;
app.listen(port, () => {
    console.log('Listening on port', 80);
});
