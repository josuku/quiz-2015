var models = require('../models/models.js');
var Sequelize = require('sequelize');

exports.show = function(req, res, next){

	var numQuizes = 0;
	var numComments = 0;
	var mediaCommentsQuiz = 0;
	var numQuizesSinComments = 0;
	var numQuizesConComments = 0;
	var quizComments = 0;

	models.Quiz.count().then(function(nq){

		numQuizes = nq;

		models.Comment.count().then(function(nc){

			numComments = nc;

			if (numQuizes == 0 || numComments == 0)	mediaCommentsQuiz = 0;
			else			mediaCommentsQuiz = numComments / numQuizes;

			models.Quiz.count({ distinct: true, include:[{ model: models.Comment,
							   	where:{ id: Sequelize.col('Comments.id') } }]
			}).then(function(cc){

				numQuizesConComments = cc;

				numQuizesSinComments = numQuizes - numQuizesConComments;

				res.render('statistics', { num_quizes: numQuizes, 
										   num_comments: numComments, 
										   media_comments_quiz: mediaCommentsQuiz,
										   num_quizes_sin_comments: numQuizesSinComments,
										   num_quizes_con_comments: numQuizesConComments,
										   errors: [] });
			});
		});
	});
};