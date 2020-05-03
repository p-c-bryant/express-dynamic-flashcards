const express = require('express');
const router = express.Router();
const { data } = require('../data/flashcardData.json');
const { cards } = data;

let getRandomId = () => {
  const numberOfCards = cards.length;
  return Math.floor( Math.random() * numberOfCards );

} 

router.get( '/', ( req, res ) => {
  let newId = getRandomId();

  while (parseInt(req.cookies.id) === newId) {
    newId = getRandomId();
  }

  res.redirect( `/cards/${newId}` );
});

router.get('/:id', (req, res) => {
    const { side } = req.query;
    const { id } = req.params;

    res.cookie('id', id);

    if ( !side ) {
        return res.redirect(`/cards/${id}?side=question`);
    }
    const name = req.cookies.username;
    const text = cards[id][side];
    const { hint } = cards[id];
    
    const templateData = { id, text, name, side };

    if ( side === 'question' ) {
      templateData.hint = hint;
      templateData.sideToShow = 'answer';
      templateData.sideToShowDisplay = 'Answer';
    } else if ( side === 'answer' ) {
      templateData.sideToShow = 'question';
      templateData.sideToShowDisplay = 'Question';
    }

    res.render('card', templateData);
});

module.exports = router;