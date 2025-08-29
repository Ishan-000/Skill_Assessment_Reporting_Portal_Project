const pool = require('../../config/db');
const AppError = require('../../utils/AppError');

const submit = async (userId, submissionData) => {
  const { skillId, answers } = submissionData; // answers = [{ questionId, selectedOptionIndex }]
  if (!answers || answers.length === 0) {
    throw new AppError('Submission must contain answers.', 400);
  }

  const questionIds = answers.map(a => a.questionId);

  // Get correct answers from DB to score the quiz
  const [correctAnswers] = await pool.query(
    'SELECT id, correct_option_index FROM questions WHERE id IN (?)',
    [questionIds]
  );
    
  if (correctAnswers.length !== questionIds.length) {
    throw new AppError('Some questions submitted do not exist.', 400);
  }

  const correctAnswersMap = new Map(correctAnswers.map(ans => [ans.id, ans.correct_option_index]));
  
  let score = 0;
  const detailedAnswers = answers.map(answer => {
    const isCorrect = correctAnswersMap.get(answer.questionId) === answer.selectedOptionIndex;
    if (isCorrect) {
      score++;
    }
    return {
      questionId: answer.questionId,
      selectedOptionIndex: answer.selectedOptionIndex,
      isCorrect,
    };
  });
  
  const finalScore = (score / correctAnswers.length) * 100;
  
  // Use a transaction to ensure atomicity
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into quiz_attempts
    const [attemptResult] = await connection.query(
      'INSERT INTO quiz_attempts (user_id, skill_id, score) VALUES (?, ?, ?)',
      [userId, skillId, finalScore]
    );
    const attemptId = attemptResult.insertId;

    // 2. Prepare and insert into quiz_answers
    const quizAnswersValues = detailedAnswers.map(ans => 
      [attemptId, ans.questionId, ans.selectedOptionIndex, ans.isCorrect]
    );

    await connection.query(
      'INSERT INTO quiz_answers (attempt_id, question_id, selected_option_index, is_correct) VALUES ?',
      [quizAnswersValues]
    );

    await connection.commit();
    return { attemptId, score: finalScore };

  } catch (error) {
    await connection.rollback();
    throw new AppError('Failed to save quiz results.', 500);
  } finally {
    connection.release();
  }
};

module.exports = { submit };