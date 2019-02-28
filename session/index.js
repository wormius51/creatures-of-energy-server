const express = require('express');
const router = express.Router();
const faker = require('faker');

router.use('/nickName', (req, res, next) => {
    if (req.body.nickName) {
        req.session.nickName = req.body.nickName;
    }
    if (!req.session.nickName) {
        req.session.nickName = faker.name.findName();
    }
    if (req.body.colors) {
        req.session.colors = JSON.parse(req.body.colors);
    }
    if (req.body.eyesStyles) {
        req.session.eyesStyles = JSON.parse(req.body.eyesStyles);
    }
    res.send(req.session.nickName);
});


module.exports = router;