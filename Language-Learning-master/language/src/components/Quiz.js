import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import quizData from '../data/quizData'; // Import the quiz data
import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import html2pdf from 'html2pdf.js'; // Import html2pdf

function Quiz() {
  const { language } = useParams(); // Get the language from the URL
  const questions = quizData[language] || []; // Get the questions for the selected language

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Initialize user progress in localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('users')) || {};
    const user = "yourUserIdentifier"; // Replace this with actual user identifier logic
    if (!storedData[user]) {
      storedData[user] = { progress: {} };
      localStorage.setItem('users', JSON.stringify(storedData)); // Save to localStorage
    }
  }, []);

  // Handle answer selection
  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (answer === currentQuestion.answer) {
      setScore(prevScore => prevScore + 1); // Increment score if the answer is correct
    }
    
    // Move to the next question or complete the quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1); // Move to the next question
    } else {
      setQuizCompleted(true); // Mark the quiz as completed
      saveProgress(); // Save user progress
    }
  };

  // Save progress to localStorage
  const saveProgress = () => {
    const storedData = JSON.parse(localStorage.getItem('users')) || {};
    const user = "yourUserIdentifier"; // Replace with actual user identifier logic
    
    // Store progress for the current language
    if (!storedData[user].progress[language]) {
      storedData[user].progress[language] = 0;
    }
    storedData[user].progress[language] += score; // Update the progress
    localStorage.setItem('users', JSON.stringify(storedData)); // Save to localStorage
  };

  // Generate and download the certificate
  const generateCertificate = () => {
    const certificateContent = `
      <div style="text-align: center; font-family: Arial, sans-serif; padding: 50px; border: 5px solid #007bff; border-radius: 15px; width: 100%; height: 100%; box-sizing: border-box;">
        <h1 style="color: #007bff; font-size: 72px; margin-top: 100px;">Certificate of Completion</h1>
        <p style="font-size: 40px; margin-top: 50px; color: #333;">Congratulations!</p>
        <p style="font-size: 32px; color: #333;">You have successfully completed the quiz on <strong style="color: #007bff;">${language.charAt(0).toUpperCase() + language.slice(1)}</strong></p>
        <p style="font-size: 36px; color: #333;">Score: <strong style="color: #007bff;">${score} / ${questions.length}</strong></p>
        <p style="font-size: 28px; color: #666;">Issued on: ${new Date().toLocaleDateString()}</p>
        <div style="border-top: 5px dashed #007bff; margin-top: 100px; padding-top: 30px;">
          <p style="font-size: 24px; color: #666;">Thank you for participating!</p>
        </div>
      </div>
    `;

    const options = {
      filename: `Quiz_Certificate_${language}.pdf`,
      margin: [0, 0, 0, 0], // Remove margin
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, // Landscape format
    };

    html2pdf().from(certificateContent).toPdf().get('pdf').then(function (pdf) {
      pdf.save(options.filename); // Download the PDF certificate
    });
  };

  return (
    <Container>
      <h1 className="mt-4">Quiz on {language.charAt(0).toUpperCase() + language.slice(1)}</h1>
      {!quizCompleted ? (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{questions[currentQuestionIndex]?.question}</Card.Title>
            <ListGroup>
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <ListGroup.Item key={index} action onClick={() => handleAnswer(option)}>
                  {option}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Quiz Completed!</Card.Title>
            <p>Your Score: {score} / {questions.length}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>Take Quiz Again</Button>
            <Button variant="success" className="mt-3" onClick={generateCertificate}>
              Download Certificate
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Quiz;
