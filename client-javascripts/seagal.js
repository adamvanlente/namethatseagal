/*
 *   Name that Seagal
 *   The game no one asked for
 *   ... The game everyone wanted
 *
 *   This file holds the SeagalGame object, which should be intialized with
 *
 *   var game = new SeagalGame(difficulty);  // 0, 1 or 2 difficulty args accepted
 *
 *   The game then has two public methods available:
 *
 *      - game.getQuestion(); // delivers the next available question: A Seagal movie title
 *            and four character names, one of which is his character name in the movie.
 *
 *      - game.answerQuestion(answer); // Takes a character name as argument, and delivers
 *            a true/false success message.
 *
 *      NOTE: both methods return total quesitons, questions answered, and correct answers.
 *
 *      The game relies on newGameData being defined in another document.  The companion file
 *      key-sample.json gives the example structure needed.
 *
 */

// Seagal game.
function SeagalGame (difficulty) {

    // Set a difficulty level.  Is 0, 1 or 2, mapping to Easy, Medium and Hard.
    // Keep track of this mode with a string version called 'mode'.
    var mode;
    difficulty = difficulty || 0;

    // Make a mutable, unique copy of the game data.
    var newGameData = JSON.parse(JSON.stringify(gameData));

    // Set the number of questions based on the difficulty level.
    var numberOfQuestions;

    if (difficulty == 1) {
        mode = 'medium';
        numberOfQuestions = 20;
    } else if (difficulty == 2) {
        mode = 'hard';
        numberOfQuestions = newGameData.movies.length - 1;
    } else {
        mode = 'easy';
        numberOfQuestions = 10;
    }

    // Keep track of the current state of the game.
    var currentQuestion = 0;
    var questionsCorrect = 0;
    var questionsRemaining = 0;
    var currentMovie = {};
    var plainTextCurrentScore = '';
    var plainTextQuestionNumber = '';

    // Make a shuffled copy of the list of movies and create a new list
    // for the current game.
    var movies = _shuffler(newGameData.movies, numberOfQuestions);

    // Helper function to shuffle a list.
    function _shuffler(sourceArray, counter) {
        var newArray = [];
        var sourceArrayCopy = sourceArray;
        for (var i = 0; i < counter; i++) {
            var rand = Math.floor((Math.random() * sourceArrayCopy.length - 1) + 1);
            var movie = sourceArrayCopy[rand];
            newArray.push(movie);
            sourceArrayCopy.splice(rand, 1);
        }
        return newArray;
    }

    // One of two main functions.  Get a question for the game.
    function _getQuestion() {

        // Get a movie for the current question.
        currentMovie = movies[currentQuestion];

        // Get a plain text score for the user.
        plainTextCurrentScore = questionsCorrect + '/' + currentQuestion;

        // Increment the current question.
        currentQuestion++;

        // Give a plain text question status, ie 1/10.
        plainTextQuestionNumber = currentQuestion + '/' + numberOfQuestions;

        // Get 4 character names as options for the answer.
        var options = _getCharacterNames(currentMovie.character);

        // Return a Question object.
        return  {
            'question_number': currentQuestion,
            'movie': currentMovie,
            'current_score': plainTextCurrentScore,
            'current_question': plainTextQuestionNumber,
            'answer_options': options
        };
    }

    // Given the correct answer for a question (character), provide a
    // a shuffled array including that option and 3 other options.
    function _getCharacterNames(character) {

        // Create a list with the correct answer in it.
        var choices = [ character ];

        // Add three random names to guess from.  Remove the name from the main
        // list when added so as not to include duplicates.
        for (var i = 0; i < newGameData.character_names.length; i++) {
            var randomChar = _randomCharacter();
            if (choices.indexOf(randomChar) == -1) {
                choices.push(randomChar);
            }

            if (choices.length == 4) {
                // Return a shuffled version of the character name options.
                return _shuffler(choices, choices.length);
            }
        }
    }

    function _randomCharacter() {
        var count = newGameData.count - 1;
        var rand = Math.floor((Math.random() * count) + 1);
        return newGameData.character_names[rand];
    }

    // Answer a question with the supplied answer argument.
    function _answerQuestion(answer) {

        // Determine if this was the last question - if the game has ended.
        var gameIsEnded = currentQuestion == numberOfQuestions;

        // Set the correct status, and increment correct answers if it is correct.
        var answerIsCorrect = false;
        if (answer == currentMovie.character) {
            answerIsCorrect = true;
            questionsCorrect++;
        }

        // Update the user's plain text score.
        plainTextCurrentScore = questionsCorrect + '/' + currentQuestion;

        // Return an Answer object.
        return  {
            'question_number': currentQuestion,
            'movie': currentMovie,
            'current_score': plainTextCurrentScore,
            'current_question': plainTextQuestionNumber,
            'answer_is_correct': answerIsCorrect,
            'questions_correct': questionsCorrect,
            'game_is_ended': gameIsEnded,
            'mode': mode
        };
    }

    // Create public methods that can be accessed for game play.
    this.answerQuestion = _answerQuestion;
    this.getQuestion = _getQuestion;
}

// Go play at NameThatSeagal.com !
