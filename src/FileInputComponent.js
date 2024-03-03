import React, { useState } from 'react';

function FileInputComponent({ handleFileChange }) {
    const placeHolder = 'Escolha o arquivo...';
    const [fileName, setFileName] = useState(placeHolder); // Initial label text

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name); // Update label with file name
        } else {
            setFileName(placeHolder); // Reset if no file is selected
        }
        handleFileChange(event); // Call the passed handler
    };

    return (
        <div className="input-group" style={{ padding: '25px', margin: 'auto', maxWidth: 'min(540px, 85vw)' }}>
            <div className="custom-file" style={{ display: 'flex' }}>
                <input
                    type="file"
                    className="custom-file-input"
                    id="customFile"
                    onChange={handleChange}
                    style={{ display: 'none' }} // Hide the default file input
                />
                {/* Use a button instead of a label to make it look like a primary button */}
                <button
                    className="btn btn-success"
                    onClick={() => document.getElementById('customFile').click()} // Trigger file input click
                    type="button"
                >
                    <i className="fas fa-upload"></i> {fileName}
                </button>
            </div>
        </div>
    );
}

export default FileInputComponent;
