import React, { useState } from 'react';
import FUVFileUploader from './FUVFileUploader';
import FUVFileKK from './FUVFileKK';
import SecondDerivativeGraphComponent from '../Static/Derivative/SecondDerivativeGraphComponent';
import FUVSecondDerivative from './FUVSecondDerivative';


function FUVGraph() {
    const [fileUrl, setFileUrl] = useState(null);

    const handleFileUploaded = (url) => {
        setFileUrl(url);
    };

    return (
        <div>
            <FUVFileUploader onFileUploaded={handleFileUploaded} />
            {fileUrl && (
                <div>
                    <p>File uploaded successfully! URL: {fileUrl}</p>
                    {/* ここでfileUrlを使用して、例えばグラフの描画などの処理を行うことができます。 */}
                </div>
            )}
            <FUVFileKK />
            <FUVSecondDerivative />

        </div>
    );
}

export default FUVGraph;
