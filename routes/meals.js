/**
 * Created by ericdufresne on 2017-03-23.
 */
var express = require('express');
var router = express.Router();
var db = require('../functions/db');
var query = require('../functions/query');

router.post('/meals', function (req, res) {
    var params = [req.body.name, req.body.description, req.body.cuisine];
    db('INSERT INTO "Project".meals (name, description, cuisine) VALUES ($1, $2, $3)', params, function (err) {
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(201).json({'Message': 'Created'});
        }
    });
});

router.get('/meals', function (req, res) {
    db('SELECT * FROM MEALS', [], function (err, results) {
        if (err){
            res.status(500).json(err);
        }
        else{
            res.status(200).json(results);
        }
    });
});

router.get('/meals/:id', function (req, res) {
    db('SELECT * FROM "Project".meal WHERE ID = $1', [req.params.id], function (err, meals) {
        if(err){
            res.status(500).json(err);
        }
        else if (meals[0]){
            var query = 'SELECT name, count FROM "Project".ingredient_for as ingfor, "Project".food as f WHERE f.id = ingfor.food_id AND ingfor.meal_id = $1';
            var params = [req.params.id];
            db(query, params, function (err, ingredients) {
                if(err){
                    res.status(500).json(err);
                }
                else{
                    var meal = meals[0];
                    meal.ingredients = ingredients;
                    res.status(200).json(meal);
                }
            });
        }
        else{
            res.status(404).json({'Error': '404 Not Found'});
        }
    });
});

router.put('/meals/:id', function (req, res) {
    var q = query.update('Project', 'meals', req.body, req.params.id);
    db(q.query, q.params, function (err) {
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(200).json({'Message': 'Update'});
        }
    });
});
router.delete('/meals/:id', function (req, res) {
    db('DELETE FROM "Project".meals WHERE ID = $1', [req.params.id], function (err) {
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(204).end();
        }
    });
});

module.exports = router;