import React, { useState } from 'react';

function FileInputComponent({ handleFileChange }) {
    const placeHolder = 'Escolha o arquivo...';
    const [fileName, setFileName] = useState(placeHolder); // Initial label text
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [pdfName, setPdfName] = useState('');

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name); // Update label with file name
        } else {
            setFileName(placeHolder); // Reset if no file is selected
        }
        handleFileChange(event); // Call the passed handler
    };

    const capturePDF = () => {
        let pdfName = fileName.split('.')[0] + "_charts.pdf";
        setPdfName(pdfName);
        setTimeout(() => {
            setPdfName('');
        }, 75);
        setTimeout(() => {
            setLoadingPdf(true);
            window.html2canvas(document.body).then(canvas => {
                // Convert the canvas to an image
                const imgData = canvas.toDataURL('image/png');

                // Create a PDF
                const pdf = new window.jsPDF({
                    orientation: "portrait",
                    unit: "in",
                    format: [canvas.width / 96, canvas.height / 96] // Convert pixels to inches for PDF
                });

                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save(pdfName);
                setLoadingPdf(false);
            });
        }, 50);
    }

    return (
        pdfName ?
            <button style={{marginTop: 20}}
                className="btn btn-secondary"
                type="button"
            >
                <i className="fas fa-file-pdf"></i> {pdfName}
            </button>
            :
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
                {fileName != placeHolder ?
                    <button
                        className='btn btn-danger'
                        onClick={() => capturePDF()}
                        type='button'>
                        <i className={loadingPdf ? "fas fa-spinner fa-spin" : "fas fa-file-pdf"}></i> Gerar PDF
                    </button>
                    : null}
            </div>
    );
}

export default FileInputComponent;
