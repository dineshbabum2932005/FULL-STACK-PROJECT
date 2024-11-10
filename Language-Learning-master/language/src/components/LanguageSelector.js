// src/components/LanguageSelector.js
import React, { useState } from 'react';
import { Form, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
function LanguageSelector({ onSelectLanguage }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    setSelectedLanguage(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLanguage) {
      onSelectLanguage(selectedLanguage);
      navigate(`/quiz/${selectedLanguage}`);
    }
  };
  return (
    <Container className="my-4">
      <h2>Select a Language</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="languageSelect">
          <Form.Label>Select a language</Form.Label>
          <Form.Control as="select" value={selectedLanguage} onChange={handleChange}>
            <option value="">--Choose a language--</option>
            <option value="english">English</option>
            <option value="french">French</option>
            <option value="spanish">Spanish</option>
            <option value="hindi">Hindi</option>
            <option value="japanese">Japanese</option>
            <option value="chinese">Chinese</option>
            <option value="german">German</option>
            <option value="italian">Italian</option>
            <option value="korean">Korean</option>
            <option value="russian">Russian</option>
            {/* Add more languages as needed */}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3" disabled={!selectedLanguage}>
          Start Quiz
        </Button>
      </Form>
    </Container>
  );
}
export default LanguageSelector;