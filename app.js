const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const data = require('./data.json');

app.use('/static', express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    const projects = data.projects;
    res.render('index', { projects });
});

app.get('/about', (req, res) => { 
    res.render('about');
});

// project route with id parameter.
app.get('/project/:id', (req, res) => {
    const id = req.params.id;
    const project = data.projects.filter((item) => item.id === parseInt(id))[0];
    res.render('project', { project });
});

// 404 error handler with human readable text
app.use((req, res, next) => {
    const err = new Error("Oh no! It appears tha page your looking for doesn't exist");
    err.status = 404;
    console.log(err.message);
    next(err);
});

app.use((err, req, res, next) => {
    // if message and status are missing add generic server error.
    if(!err.message) {
        err.message = 'Oh no! Server error';
    }

    if(!err.status) {
        err.status = 500;
    }
    res.status(err.status);
    console.error(err);
    res.locals.error = err;
    res.render('error');
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});