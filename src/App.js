import React, { useState, useCallback } from 'react';
import './App.css';
import ePub from 'epubjs/lib/index';
import Dropzone from 'react-dropzone';
import { convertEpub } from './zipUtils';

function App() {
  const [epubFile, setEpubFile] = useState(null);

  const handleDrop = useCallback((acceptedFiles) => {
    setEpubFile(acceptedFiles[0]);
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    if (!epubFile) {
      return;
    }

    await convertEpub(epubFile);
  }, [epubFile]);

  return (
    <div className="App">
      <h1>EPUB Conversion App</h1>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop an EPUB file here, or click to select a file.</p>
          </div>
        )}
      </Dropzone>
      {epubFile && (
        <div>
          <p>Selected file: {epubFile.name}</p>
          <button onClick={handleSubmit}>Convert</button>
        </div>
      )}
    </div>
  );
}

export default App;
