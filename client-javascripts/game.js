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

        $('.options').hide();
        $('.currentMovie').hide();
        var htmlContent = q.movie.title +
            '<img src="/img/' + q.movie.poster_url + '"/>';
        // Set the ui elements of the question.
        $('#currentMovie').html(htmlContent);

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

        setTimeout(function() {
          document.getElementById('options').style.display = 'block';
          $('.options').attr('class', 'options animated bounceInUp');
          document.getElementById('currentMovie').style.display = 'block';
          $('.currentMovie').attr('class', 'currentMovie animated bounceInDown');
        }, 300);


        // Add a listener to each button that will answer the current question.
        $('.answerButton').click(function(e) {
            var answer = $(this).attr("id");
            seagalGame.answerQuestion(answer, e);
        });
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

        seagalGame.mostRecentQuestion = a;

        setTimeout(function(){
            seagalGame.resetUi();
            if (a.game_is_ended) {
                seagalGame.gameEndMessage()
            } else {
                var nextQuestion = seagalGame.game.getQuestion();
                seagalGame.renderQuestion(nextQuestion);
            }
        }, 1800);
    },

    gameEndMessage: function() {

        var a = seagalGame.mostRecentQuestion;
        var score = (a.questions_correct / a.question_number) * 10;

        var message = '<span>You got ' + a.current_score + '</span>';

        var uniqueMessage;

        if (score >= 0 && score < 4) {
          uniqueMessage = 'Pull yourself together and step up your Seagal game.';
        } else if (score >= 4 && score < 6) {
          uniqueMessage = 'You did poorly, but you can always try again.';
        } else if (score >= 6 && score <= 9) {
          uniqueMessage = 'Nicely done.  Steven would be proud.';
        } else {
          uniqueMessage =
              'Nobody beats Steven in the kitchen, and nobody beats you at this game.';
        }

        message += '<label>' + uniqueMessage + '</label>';
        if (seagalGame.userId) {
            message +=
                '<button class="showScores">leaderboard</button>';
        }

        $('#gameEndedMessage').html(message);
        $('#answerStatus').hide(message);
        seagalGame.addGameStartButtons('gameEndedMessage');
        if (seagalGame.userId) {
            seagalGame.storeScore(a.mode, a.questions_correct);
            $('.showScores').click(function() {
                seagalGame.getUserId();
                seagalGame.showScores();
            });
        }
    },

    // Reset all of the page elements.
    resetUi: function(gameIsEnded) {
        $('#gameEndedMessage').html('');
        $('#currentMovie').html('')
          .attr('class', 'currentMovie');
        $('#welcomeScreen').hide();
        $('.showScores').hide();
        $('#options').html('');
        $('#buttons').html('');
        $('.openwhy').hide();
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

    showScores: function(mode, start) {
        mode = mode || 'easy';
        start = start || 0;

        seagalGame.leaderboardIndex = start;
        seagalGame.leaderboardMode = mode;

        var url = '/allScores/' + mode + '/' + start;
        $.ajax({
            url: url,
            type: 'POST',
            success: function(data){
                for (var i = 0; i < data.length; i++) {
                  console.log(data[i]);
                }
                seagalGame.renderLeaderboard(data, mode);
            }
        });
    },

    renderLeaderboard: function(data, mode) {

        var closer = '<em onclick="seagalGame.closeLeaderboard()">x</em>';

        var header = '<h3>leaderboard</h3>';

        var curMode = seagalGame.leaderboardMode;

        var easyClass = curMode == 'easy' ? 'active' : '';
        var medClass = curMode == 'medium' ? 'active' : '';
        var hardClass = curMode == 'hard' ? 'active' : '';

        var buttons =
            '<button class="' + easyClass + '" onclick="' +
            'seagalGame.showScores(\'easy\')">easy</button>' +
            '<button class="' + medClass + '" onclick="' +
            'seagalGame.showScores(\'medium\')">medium</button>' +
            '<button class="' + hardClass + '" onclick="' +
            'seagalGame.showScores(\'hard\')">hard</button>';

        var totalQuestions;
        if (mode == 'medium') {
            totalQuestions = 20;
        } else if (mode == 'hard') {
            totalQuestions = 37;
        } else {
            totalQuestions = 10;
        }

        var div = document.getElementById('leaderboard');
        div.innerHTML = '';
        div.innerHTML = closer + header + buttons;
        div.className = 'leaderboard visible';

        for (var i = 0; i < data.length; i++) {
            var result = data[i];

            var formattedDate = result.date.split(' ');
            formattedDate = formattedDate[1] + ' ' + formattedDate[2] +
                ' ' + formattedDate[3];

            var element = '<span>' +
                '<label>' + result.username + '</label>' +
                '<label>' + result.number_correct +
                '/' + totalQuestions + '</label>' +
                '<label>' + formattedDate + '</label>' +
                '</span>';
            div.innerHTML += element;
        }

        if (data.length == 0) {
            var element = '<span>There are no results to show!</span>';
            div.innerHTML += element;
        } else {
            if (seagalGame.leaderboardIndex > 0) {
                var prevIndex = seagalGame.leaderboardIndex - 10;
                var prevButton = '<button class="pgButton" onclick="' +
                'seagalGame.showScores(\'' + mode + '\',\'' +
                prevIndex + '\')">previous</button>';
                div.innerHTML += prevButton;
            }

            if (data.length == 10) {
                var nextIndex = seagalGame.leaderboardIndex + 10;
                var nextButton = '<button class="pgButton" onclick="' +
                'seagalGame.showScores(\'' + mode + '\',\'' +
                nextIndex + '\')">next</button>';
                div.innerHTML += nextButton;
            }
        }
    },

    closeLeaderboard: function() {
        document.getElementById('leaderboard').className =
            'leaderboard hidden';
    },

    openWhy: function() {
        document.getElementById('why').className = 'why visible';
    },

    closeWhy: function() {
        document.getElementById('why').className = 'why hidden';
    }
};

$('.showScores').click(function() {
    seagalGame.getUserId();
    seagalGame.showScores();
});

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);
