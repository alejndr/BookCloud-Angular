const express = require('express');
const router = express.Router();
var Review = require('./review.model');
var Book = require('../books/Book.model');

router.post('/', createReview);
router.get('/:book', getBookReview);



function createReview (req, res)  {
  const review = new Review();
  review.book = req.body.book;
  review.username = req.body.username;
  review.rating = req.body.rating;
  review.body = req.body.body;
  review.save()
    .then((result) => {
      Book.findOne({ BookTitulo: review.book }, (err, book) => {
        if (err) return next(err);
        if (book) {

              book.reviews.push(review);
              book.save();
              res.json(book);
          }
      });
    })
    .catch((error) => {
      //res.status(500).json({ error });
      console.error(error);
    });
};


function getBookReview(req, res) {
  Book.findOne({ BookTitulo: req.params.book })
    .populate('reviews')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

module.exports = router;