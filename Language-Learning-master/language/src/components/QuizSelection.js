// src/components/QuizSelection.js

import React from 'react';
import LanguageSelector from './LanguageSelector';

function QuizSelection() {
  const handleSelectLanguage = (language) => {
    // Additional logic can be implemented here if needed
    console.log(`Selected language: ${language}`);
  };

  return (
    <div className="mt-4">
      <LanguageSelector onSelectLanguage={handleSelectLanguage} />
    </div>
  );
}

export default QuizSelection;
