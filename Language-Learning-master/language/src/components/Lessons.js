//src\components\Lessons.js
import React, { useState, useEffect } from 'react';
import { Button, Container, Card, Badge, Form, ProgressBar, ListGroup, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import lessonsData from '../data/lessonsData';

function Lessons({ user }) {
  const navigate = useNavigate(); // Initialize navigate
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [audioCompletion, setAudioCompletion] = useState(new Set()); // Track played audios
  const [allSentencesPlayed, setAllSentencesPlayed] = useState(false); // Track if all sentences have been pronounced
  const [showCompletionMessage, setShowCompletionMessage] = useState(false); // Control visibility of completion message

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[user] && users[user].completedLessons && users[user].completedLessons[selectedLanguage]) {
      setCompletedLessons(users[user].completedLessons[selectedLanguage]);
    } else {
      setCompletedLessons([]);
    }
    setCurrentLessonIndex(0);
    setAllSentencesPlayed(false); // Reset on language change
    setShowCompletionMessage(false); // Reset on language change
  }, [selectedLanguage, user]);

  useEffect(() => {
    setAudioCompletion(new Set()); // Reset audio completion tracking on lesson change
    setAllSentencesPlayed(false); // Reset sentence tracking
    setShowCompletionMessage(false); // Reset completion message
  }, [currentLessonIndex]);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleCompleteLesson = (lessonId) => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[user]) {
      if (!users[user].completedLessons) {
        users[user].completedLessons = {};
      }
      if (!users[user].completedLessons[selectedLanguage]) {
        users[user].completedLessons[selectedLanguage] = [];
      }

      if (!users[user].completedLessons[selectedLanguage].includes(lessonId)) {
        users[user].completedLessons[selectedLanguage].push(lessonId);
        setCompletedLessons([...completedLessons, lessonId]);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Lesson completed!');
      } else {
        alert('You have already completed this lesson.');
      }
    }
  };

  const handleNextLesson = () => {
    const lessons = lessonsData[selectedLanguage];
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const getLanguageCode = (language) => {
    const languageMap = {
      english: 'en-US',
      french: 'fr-FR',
      spanish: 'es-ES',
      hindi: 'hi-IN',
      japanese: 'ja-JP',
      chinese: 'zh-CN',
      german: 'de-DE',
      italian: 'it-IT',
      korean: 'ko-KR',
      russian: 'ru-RU',
      portuguese: 'pt-PT',
      arabic: 'ar-SA',
      dutch: 'nl-NL',
      turkish: 'tr-TR',
      // Add more language mappings as needed
    };
    return languageMap[language] || 'en-US';
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(selectedLanguage);
      utterance.onend = () => checkAllSentencesPlayed(); // Check if all sentences have been played
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech is not supported in this browser.');
    }
  };

  const checkAllSentencesPlayed = () => {
    const lesson = lessonsData[selectedLanguage][currentLessonIndex];
    const sentences = lesson.content.split('\n\n').flatMap(section => section.split('\n').filter(line => line.trim()).slice(1));

    if (audioCompletion.size === sentences.length) {
      setAllSentencesPlayed(true);
      setShowCompletionMessage(true); // Show the completion message
    }
  };

  const renderLessonContent = (content) => {
    const sections = content.split('\n\n');

    return (
      <div style={{ color: 'black' }}>
        {sections.map((section, index) => {
          const lines = section.split('\n').filter(line => line.trim());

          return (
            <div key={index} style={{ marginBottom: '1rem' }}>
              {lines.length > 0 && (
                <h4 style={{ margin: '0.5rem 0', cursor: 'pointer' }} onClick={() => speakText(lines[0].replace(/#/g, '').trim())}>
                  {lines[0].replace(/#/g, '').trim()} {/* Clickable heading */}
                </h4>
              )}
              <ul>
                {lines.slice(1).map((line, lineIndex) => {
                  const cleanedLine = line.replace(/[*#]/g, '').trim(); // Remove unnecessary characters

                  return (
                    <li
                      key={lineIndex}
                      style={{ cursor: 'pointer', listStyleType: 'disc' }}
                      onClick={() => handleSentenceClick(cleanedLine)} // Click handler for the entire line
                    >
                      {cleanedLine} {/* Display the line */}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  const handleSentenceClick = (sentence) => {
    speakText(sentence);
    setAudioCompletion(prev => new Set(prev).add(sentence)); // Track played sentence
  };

  const renderLesson = () => {
    const lessons = lessonsData[selectedLanguage];
    if (!lessons || lessons.length === 0) {
      return <p>No lessons available for the selected language.</p>;
    }

    const lesson = lessons[currentLessonIndex];
    const isCompleted = completedLessons.includes(lesson.id);
    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    const progressPercentage = (completedCount / totalLessons) * 100;

    return (
      <Card className="mb-4">
        <Card.Body>
          <Card.Title
            style={{ cursor: 'pointer' }}
            onClick={() => speakText(lesson.title)} // Speak lesson title on click
          >
            {lesson.title}
            {isCompleted && <Badge bg="success" className="ms-2">Completed</Badge>}
          </Card.Title>

          {renderLessonContent(lesson.content)}

          {lesson.audioUrl && (
            <div className="mt-3">
              <audio controls>
                <source src={lesson.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <Button
            variant="success"
            className="mt-3"
            onClick={() => handleCompleteLesson(lesson.id)}
            disabled={isCompleted || !allSentencesPlayed} // Complete button disabled unless all sentences are played
          >
            {isCompleted ? 'Completed' : 'Complete Lesson'}
          </Button>

          {showCompletionMessage && (
            <Alert variant="success" className="mt-3">
              Topic completed! 🎉
            </Alert>
          )}
        </Card.Body>
        <Card.Footer>
          <ProgressBar now={progressPercentage} label={`${completedCount} / ${totalLessons} Lessons Completed`} />
        </Card.Footer>
      </Card>
    );
  };

  const renderLessonList = () => {
    const lessons = lessonsData[selectedLanguage];
    if (!lessons || lessons.length === 0) {
      return <p>No lessons available for the selected language.</p>;
    }

    return (
      <ListGroup>
        {lessons.map((lesson, index) => (
          <ListGroup.Item
            key={lesson.id}
            active={index === currentLessonIndex}
            variant={completedLessons.includes(lesson.id) ? 'success' : ''}
            action
            onClick={() => {
              setCurrentLessonIndex(index);
              speakText(lesson.title); // Speak lesson title on click
            }}
          >
            {lesson.title}
            {completedLessons.includes(lesson.id) && <Badge bg="success" className="ms-2">Completed</Badge>}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  const allLessonsCompleted = completedLessons.length === lessonsData[selectedLanguage].length; // Check if all lessons are completed

  return (
    <Container>
      <h1 className="mt-4">Lessons in {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</h1>
      <Form.Group controlId="languageSelect">
        <Form.Label>Select Language</Form.Label>
        <Form.Control as="select" value={selectedLanguage} onChange={handleLanguageChange}>
          {Object.keys(lessonsData).map((language) => (
            <option key={language} value={language}>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Row>
        <Col md={4}>
          <h3>Lesson List</h3>
          {renderLessonList()}
        </Col>
        <Col md={8}>
          <h3>Lesson Content</h3>
          {renderLesson()}
          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={handlePreviousLesson} disabled={currentLessonIndex === 0}>
              Previous
            </Button>
            <Button variant="secondary" onClick={handleNextLesson} disabled={currentLessonIndex === lessonsData[selectedLanguage].length - 1}>
              Next
            </Button>
          </div>
          {allLessonsCompleted && (
            <Button
              variant="primary"
              className="mt-3"
              onClick={() => navigate(`/quiz/${selectedLanguage}`)} // Use the selected language for navigation
            >
              Attend Quiz
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Lessons;