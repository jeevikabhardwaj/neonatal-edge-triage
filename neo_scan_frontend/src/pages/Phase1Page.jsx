import { useState, useEffect } from 'react';
import { predictPhase1 } from '../services/api';

function Phase1Page() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Selected file must be an image.');
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      setResult(null);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await predictPhase1(selectedFile);
      setResult(response);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    setResult(null);
    setLoading(false);
    setError('');
  };

  return (
    <div className="page-container phase1-page">
      <h1 className="page-heading">Normal vs Abnormal lung ultrasound classification</h1>
      <p className="page-explanation">
        This page provides an interface for the NeoScan AI Phase 1 research prototype.
        It evaluates lung ultrasound frames to classify them as Normal or Abnormal, illustrating model interpretability through Grad-CAM localization heatmaps.
      </p>

      {!previewUrl && !result && !loading && (
        <div className="content-section upload-area">
          <h2 className="section-heading">Select Lung Ultrasound Image</h2>
          <div className="placeholder-box">
            <input
              type="file"
              accept="image/*"
              id="file-upload-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload-input" className="button secondary-button" style={{ cursor: 'pointer' }}>
              Choose image file
            </label>
          </div>
        </div>
      )}

      {error && (
        <div className="content-section" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2', padding: '1.5rem' }}>
          <p style={{ color: '#b91c1c', fontWeight: '600' }}>{error}</p>
          <button className="button secondary-button" style={{ marginTop: '1rem' }} onClick={() => setError('')}>
            Dismiss
          </button>
        </div>
      )}

      {previewUrl && !result && !loading && (
        <div className="content-section preview-area">
          <h2 className="section-heading">Image Preview</h2>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
            <img
              src={previewUrl}
              alt="Selected lung ultrasound preview"
              style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            />
          </div>
          <div className="action-area" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="button primary-button"
              onClick={handleAnalyze}
              disabled={loading}
            >
              Analyze image
            </button>
            <button
              className="button secondary-button"
              onClick={resetState}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="content-section loading-area">
          <div className="placeholder-box">
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Analyzing image...</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              Processing pixel values, applying neural network feed-forward operations, and computing backpropagation gradients for Grad-CAM generation.
            </p>
          </div>
        </div>
      )}

      {result && (
        <div className="content-section results-area">
          <h2 className="section-heading">Classification Results</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '1.5rem 0' }} className="results-grid">
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Predicted Class
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '800', color: result.predicted_class_index === 1 ? '#b91c1c' : '#15803d', marginTop: '0.25rem' }}>
                  {result.predicted_class_name}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>Normal Probability:</span>
                  <strong style={{ marginLeft: '0.5rem' }}>{(result.normal_probability * 100).toFixed(1)}%</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>Abnormal Probability:</span>
                  <strong style={{ marginLeft: '0.5rem' }}>{(result.abnormal_probability * 100).toFixed(1)}%</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <p>Source file: {result.filename}</p>
                  <p>Dimensions: {result.original_width} x {result.original_height} px</p>
                </div>
              </div>
            </div>

            <div className="visualization-area" style={{ gridColumn: 'span 2' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Interpretability Visualization (Grad-CAM)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Original Ultrasound</p>
                  <img
                    src={previewUrl}
                    alt="Original ultrasound"
                    style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '220px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Grad-CAM Heatmap</p>
                  <img
                    src={`data:image/png;base64,${result.gradcam_image}`}
                    alt="Grad-CAM heatmap"
                    style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '220px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Grad-CAM Overlay</p>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#000' }}>
                    <canvas
                      ref={(canvas) => {
                        if (!canvas) return;
                        const ctx = canvas.getContext('2d');
                        const imgOrig = new Image();
                        const imgHeat = new Image();
                        let origLoaded = false;
                        let heatLoaded = false;
                        
                        const drawOverlay = () => {
                          if (origLoaded && heatLoaded) {
                            canvas.width = imgOrig.naturalWidth || 224;
                            canvas.height = imgOrig.naturalHeight || 224;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(imgOrig, 0, 0, canvas.width, canvas.height);
                            
                            // Create offscreen canvas to colorize grayscale heatmap
                            const offscreen = document.createElement('canvas');
                            offscreen.width = canvas.width;
                            offscreen.height = canvas.height;
                            const oCtx = offscreen.getContext('2d');
                            oCtx.drawImage(imgHeat, 0, 0, canvas.width, canvas.height);
                            
                            const imgData = oCtx.getImageData(0, 0, canvas.width, canvas.height);
                            const data = imgData.data;
                            
                            // Standard JET blue-to-red lookup visualization
                            for (let i = 0; i < data.length; i += 4) {
                              const v = data[i];
                              let r = 0, g = 0, b = 0;
                              if (v < 128) {
                                b = 255;
                                g = Math.round(v * 2);
                              } else {
                                r = Math.round((v - 128) * 2);
                                g = Math.round((255 - v) * 2);
                              }
                              data[i] = r;
                              data[i+1] = g;
                              data[i+2] = b;
                            }
                            oCtx.putImageData(imgData, 0, 0);
                            
                            // Overlay colorized heatmap with 35% opacity
                            ctx.globalAlpha = 0.35;
                            ctx.drawImage(offscreen, 0, 0);
                            ctx.globalAlpha = 1.0;
                          }
                        };
                        
                        imgOrig.onload = () => { origLoaded = true; drawOverlay(); };
                        imgHeat.onload = () => { heatLoaded = true; drawOverlay(); };
                        
                        imgOrig.src = previewUrl;
                        imgHeat.src = `data:image/png;base64,${result.gradcam_image}`;
                      }}
                      style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '220px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.4' }}>
                The Grad-CAM system highlights image regions that contributed to the model's prediction. The color-coded overlay maps areas of high model focus (Red represents high influence, Blue indicates baseline contribution). Provided for model interpretability; not a clinical finding or medical biomarker.
              </p>
            </div>
          </div>

          <div className="action-area" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="button secondary-button" onClick={resetState}>
              Choose another image
            </button>
          </div>
        </div>
      )}

      <div className="research-disclaimer-section">
        <p className="research-disclaimer-text">
          <strong>Research Prototype Disclaimer:</strong> This application is a scientific research prototype and is not clinically validated. It does not provide medical advice or diagnostic services. This model should not be used as a substitute for professional clinical judgment, nor does it guarantee the localization or diagnostic verification of neonatal RDS or any other respiratory condition.
        </p>
      </div>
    </div>
  );
}

export default Phase1Page;