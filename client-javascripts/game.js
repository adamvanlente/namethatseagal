var seagalGame = {

    game: false,

    userId: false,

    userName: false,

    leaderboardStartingIndex: 0,

    startNewGame: function(difficulty) {

        // Create a new Seagal game.
        seagalGame.game = new SeagalGame(difficulty);

        seagalGame.resetUi();

        seagalGame.getUserId();

        // Ask the first question.
        var firstQuestion = seagalGame.game.getQuestion();
        seagalGame.renderQuestion(firstQuestion);
    },

    // Given a question, render buttons for each optional answer.
    renderQuestion: function(q) {

        var htmlContent = q.movie.title +
            '<img src="/img/' + q.movie.poster_url + '"/>';
        // Set the ui elements of the question.
        $('#currentMovie').html(htmlContent);
        $('#currentMovie').addClass('animated fadeInDownBig');

        $('#options').hide();

        document.getElementById('answerStatus').style.display = 'block';
        var message = 'question ' + q.current_question + '  |  ' +
            q.current_score + ' correct';
        $('#answerStatus').html(message);

        // Create a button for each option.
        for (var i = 0; i < q.answer_options.length; i++) {
            var classList = ['abOne', 'abTwo', 'abThree', 'abFour'];
            var option = q.answer_options[i];
            var button = $('<button></button>')
                .html(option)
                .attr('class', 'answerButton ' + classList[i])
                .attr('id', option);
            $('#options').append(button);
        }

        // Add a listener to each button that will answer the current question.
        $('.answerButton').click(function(e) {
            var answer = $(this).attr("id");
            seagalGame.answerQuestion(answer, e);
        });

        setTimeout(function() {
          document.getElementById('options').style.display = 'block';
          document.getElementById('options').className = 'options animated bounceInUp';
        }, 300)
    },

    // Answer the currect quesion.
    answerQuestion: function(answer, e) {

        var a = seagalGame.game.answerQuestion(answer);

        var correct = a.answer_is_correct;

        var addedClass = correct ? ' animated tada' : ' animated wobble';
        var bgColor = correct ? 'rgb(92, 156, 89)' : 'rgb(204, 89, 74)';
        var buttonClass = e.target.className;
        document.getElementById(e.target.id).className = buttonClass + addedClass;
        document.getElementById(e.target.id).style.backgroundColor = bgColor;

        if (a.game_is_ended) {
            var message = 'The game is over.  You got ' + a.current_score +
                ' correct.'
            $('#gameEndedMessage').html(message);

            $('#answerStatus').hide(message);

            seagalGame.addGameStartButtons('gameEndedMessage');

            if (seagalGame.userId) {
                seagalGame.storeScore(a.mode, a.questions_correct);
            } else {
                console.log('not logged in.  not storing score.');
            }

        } else {
            setTimeout(function(){
              seagalGame.resetUi();
              var nextQuestion = seagalGame.game.getQuestion();
              seagalGame.renderQuestion(nextQuestion);
            }, 1200);

        }
    },

    // Reset all of the page elements.
    resetUi: function(gameIsEnded) {

        $('#gameEndedMessage').html('');
        $('#currentMovie').html('')
          .attr('class', 'currentMovie');
        $('#welcomeScreen').hide();
        $('#options').html('');
        $('#buttons').html('');

    },

    addGameStartButtons: function(targetDivId) {

        var easyButton = $('<button></button>')
            .attr('class', 'startGame easy')
            .attr('id', '0')
            .html('easy game');

        var medButton = $('<button></button>')
            .attr('class', 'startGame med')
            .attr('id', '1')
            .html('medium game');

        var hardButton = $('<button></button>')
            .attr('class', 'startGame hard')
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

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);
