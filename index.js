const express = require('express');
const helmet  = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const router  = require('./router');

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use("/", router);

app.use((error, req, res, next)=>{
    res.json({
        error: "Hubo un error ToT",
        errorStack: error.stack
    });
});

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`APP RUNNING IN PORT ${port}`)
});