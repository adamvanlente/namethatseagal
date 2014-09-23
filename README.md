##Name that Seagal	

Name that Seagal is a simple quiz game, based on a small piece of javascript I wrote some time ago.  While this version contains user accounts for remembering scores, the foundation for it lives in:
	
	client-javascripts/seagal.js

#### Using Seagal.js

Seagal.js is very portable.  It can also be used as a starting point for your own quiz game.  Seagal.js is instantiated in javascript with:
	
	// Start a new Seagal game.  Accepts a difficulty argument of 
	// 0 (easy), 1 (medium) or 2 (hard).  Defaults to easy.
	var seagalGame = new Seagal();
	
Seagal then exposes two public functions:

	// Get a question.
	var q = seagalGame.getQuestion();

This responds with an object containing the question, answer options, as well as the current state of the game.  Using one of the options returned, you can access the other public function:

	// Answer a question
	var a = seagalGame.answerQuestion(answer);

This will respond correct/incorrect based on the answer provided, and will also return the current state of the game.

Read the Seagal.js file for more about how it works, or play the game at namethatseagal.com!