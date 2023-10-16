import React, { useState } from 'react';
import FUVFileUploader from './FUVFileUploader';

function FUVGraph() {
    const [fileUrl, setFileUrl] = useState(null);

    const handleFileUploaded = (url) => {
        setFileUrl(url);
    };

    return (
        <div>
            <h1>FUV Graph Viewer</h1>
            <FUVFileUploader onFileUploaded={handleFileUploaded} />
            {fileUrl && (
                <div>
                    <p>File uploaded successfully! URL: {fileUrl}</p>
                    {/* ここでfileUrlを使用して、例えばグラフの描画などの処理を行うことができます。 */}
                </div>
            )}
        </div>
    );
}

export default FUVGraph;
