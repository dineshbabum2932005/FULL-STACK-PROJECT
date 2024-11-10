// src/components/ProgressBar.jsx
import React, { useEffect, useState } from 'react';
import { ProgressBar as BootstrapProgressBar, Container } from 'react-bootstrap';

const ProgressBar = ({ language }) => {
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [totalQuizQuestions, setTotalQuizQuestions] = useState(0);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('users')) || {};
    const user = "yourUserIdentifier"; // Replace with actual user identifier logic
    if (storedData[user] && storedData[user].progress[language]) {
      const progress = storedData[user].progress[language];
      setLessonsCompleted(progress.lessons || 0); // Set lessons completed
      setQuizScore(progress.quizScore || 0); // Set quiz score
    }
    
    // You should replace these with actual counts for your application
    const totalLessonsCount = 10; // Total number of lessons for this language
    const totalQuizQuestionsCount = 10; // Total number of quiz questions for this language
    setTotalLessons(totalLessonsCount);
    setTotalQuizQuestions(totalQuizQuestionsCount);
  }, [language]);

  // Calculate the progress percentage for lessons and quizzes
  const lessonProgress = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;
  const quizProgress = totalQuizQuestions > 0 ? (quizScore / totalQuizQuestions) * 100 : 0;

  return (
    <Container className="mt-4">
      <h2>Your Progress</h2>
      <h5>Lessons Progress: {lessonsCompleted} / {totalLessons}</h5>
      <BootstrapProgressBar now={lessonProgress} label={`${lessonProgress.toFixed(2)}%`} />
      
      <h5>Quiz Progress: {quizScore} / {totalQuizQuestions}</h5>
      <BootstrapProgressBar now={quizProgress} label={`${quizProgress.toFixed(2)}%`} />
    </Container>
  );
};

export default ProgressBar;
