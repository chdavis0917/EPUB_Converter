import React, { useState, useCallback } from 'react';
import './App.css';
import ePub from 'epubjs/lib/index';
import Dropzone from 'react-dropzone';

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

    const book = await ePub(epubFile);
    // TODO: Modify book contents

    const blobUrl = window.URL.createObjectURL(book.toBlob());
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${book.filename()}-converted.epub`;
    link.click();
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
