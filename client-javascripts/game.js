var seagalGame = {

    game: false,

    userId: false,

    userName: false,

    leaderboardStartingIndex: 0,

    startNewGame: function(difficulty) {

        // Create a new Seagal game.
        seagalGame.game = new SeagalGame(difficulty);
        console.log(seagalGame.game);
        seagalGame.resetUi();

        seagalGame.getUserId();

        // Ask the first question.
        var firstQuestion = seagalGame.game.getQuestion();
        seagalGame.renderQuestion(firstQuestion);
    },

    // Given a question, render buttons for each optional answer.
    renderQuestion: function(q) {

        // Set the ui elements of the question.
        $('#currentMovie').html(q.movie.title);

        // Create a button for each option.
        for (var i = 0; i < q.answer_options.length; i++) {
            var option = q.answer_options[i];
            var button = $('<button></button>')
                .html(option)
                .attr('class', 'answerButton')
                .attr('id', option);
            $('#options').append(button);
        }

        // Add a listener to each button that will answer the current question.
        $('.answerButton').click(function() {
            var answer = $(this).attr("id");
            seagalGame.answerQuestion(answer);
        });
    },

    // Answer the currect quesion.
    answerQuestion: function(answer) {
        seagalGame.resetUi();

        var a = seagalGame.game.answerQuestion(answer);

        var correct = a.answer_is_correct ? 'Correct' : 'Incorrect';
        var message = 'Answer was ' + correct +
            '.  You have ' + a.current_score + ' correct';
        $('#answerStatus').html(message);

        if (a.game_is_ended) {
            var message = 'The game is over.  You got ' + a.current_score +
                ' correct.'
            seagalGame.resetUi();
            $('#gameEndedMessage').html(message);

            seagalGame.addGameStartButtons('gameEndedMessage');

            if (seagalGame.userId) {
                seagalGame.storeScore(a.mode, a.questions_correct);
            } else {
                console.log('not logged in.  not storing score.');
            }

        } else {
            var nextQuestion = seagalGame.game.getQuestion();
            seagalGame.renderQuestion(nextQuestion);
        }
    },

    // Reset all of the page elements.
    resetUi: function(gameIsEnded) {

        $('#gameEndedMessage').html('');
        $('#currentMovie').html('');
        $('#answerStatus').html('');
        $('#options').html('');
        $('#buttons').html('');

    },

    addGameStartButtons: function(targetDivId) {

        var easyButton = $('<button></button>')
            .attr('class', 'startGame')
            .attr('id', '0')
            .html('easy game');

        var medButton = $('<button></button>')
            .attr('class', 'startGame')
            .attr('id', '1')
            .html('medium game');

        var hardButton = $('<button></button>')
            .attr('class', 'startGame')
            .attr('id', '2')
            .html('hard game');

        $('#' + targetDivId)
            .append(easyButton)
            .append(medButton)
            .append(hardButton);

        $('.startGame').click(function() {
            var difficulty = $(this).attr("id");
            seagalGame.startNewGame(difficulty);
        });

    },

    storeScore: function(mode, correct) {
          var url = '/logScore/' + seagalGame.userId + '/' + mode +
              '/' + correct + '/' + seagalGame.username;

          $.ajax({
              url: url,
              type: 'POST',
              success: function(data){
                  console.log(data);
              },
              error: function(err) {
                  errorCb(err);
              }
          });
    },

    getUserId: function() {
        if (document.getElementById('userId') &&
            document.getElementById('userId').value) {
            seagalGame.userId = document.getElementById('userId').value;
            seagalGame.username = document.getElementById('username').value;
        }
    },

    onFirstLoad: function() {
        seagalGame.addGameStartButtons('buttons');
    },

    showScores: function(id) {
        var url;
        if (id) {
            url = '/myScores/' + id + '/' +
                seagalGame.leaderboardStartingIndex;
        } else {
            url = '/allScores';
        }
        $.ajax({
            url: url,
            type: 'POST',
            success: function(data){
                console.log(data);
            }
        });
    }
};

$('.showScores').click(function() {
    seagalGame.getUserId();
    seagalGame.showScores();
    seagalGame.showScores(seagalGame.userId);
});
