var models = require('../models/models.js');
var Sequelize = require('sequelize');

exports.show = function(req, res, next){

	var numQuizes = 0;
	var numComments = 0;
	var mediaCommentsQuiz = 0;
	var numQuizesSinComments = 0;
	var numQuizesConComments = 0;
	var quizComments = 0;

	// Encadenamos consultas a la BD
	// En la primera consulta buscamos todos los quizes e incluimos los comentarios de cada uno
	models.Quiz.findAll({ include: [{ model: models.Comment }] }).then(function(quizes){

		// Guardamos numero de comentarios
		numQuizes = quizes.length;

		// Consulta para contar el numero total de comentarios
		models.Comment.count().then(function(nc){

			// Guardamos el numero de comentarios
			numComments = nc;

			// Guardamos la media de comentarios por quiz 
			if (numQuizes == 0 || numComments == 0)	mediaCommentsQuiz = 0;
			else			mediaCommentsQuiz = numComments / numQuizes;

			// Calculamos el numero de quizes con comentarios
			for (var i=0; i < quizes.length; i++)
				if (quizes[i].Comments.length > 0)
					numQuizesConComments++;	 
				
			// Calculamos el numero de quizes sin comentarios
			numQuizesSinComments = numQuizes - numQuizesConComments;

			// Enviamos a la vista toda la informacion calculada para pintarla
			res.render('statistics', { num_quizes: numQuizes, 
									   num_comments: numComments, 
									   media_comments_quiz: mediaCommentsQuiz,
									   num_quizes_sin_comments: numQuizesSinComments,
									   num_quizes_con_comments: numQuizesConComments,
									   errors: [] });
		});
	});
};


// Opcion 2. La descarte porque a pesar de funcionar bien en local, en Heroku no cargaba la pagina de estadisticas
// 			 por error al hacer la ultima consulta sobre la BD
//
/*
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
*/

