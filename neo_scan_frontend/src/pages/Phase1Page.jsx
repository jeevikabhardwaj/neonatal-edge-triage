
function Phase1Page() {
  return (
    <div className="page-container phase1-page">
      <h1 className="page-heading">Normal vs Abnormal lung ultrasound classification</h1>
      <p className="page-explanation">
        This page provides an interface for the NeoScan AI Phase 1 research prototype. It allows for the classification of lung ultrasound images as 'Normal' or 'Abnormal'. The results are for research purposes only and should not be used for clinical diagnosis. Due to the prototype nature, upload logic and API integration are not yet live on this interface.
      </p>

      <div className="content-section upload-area">
        <h2 className="section-heading">Image Upload Area</h2>
        <div className="placeholder-box">
          <p>Placeholder for image upload controls (e.g., drag-and-drop, file input).</p>
        </div>
      </div>

      <div className="content-section preview-area">
        <h2 className="section-heading">Image Preview Area</h2>
        <div className="placeholder-box">
          <p>Placeholder for displaying the uploaded image.</p>
        </div>
      </div>

      <div className="content-section action-area">
        <button className="button primary-button" disabled>Analyze Image (Placeholder)</button>
      </div>

      <div className="content-section loading-area">
        <h2 className="section-heading">Loading State Area</h2>
        <div className="placeholder-box">
          <p>Placeholder for displaying loading indicators during analysis.</p>
        </div>
      </div>

      <div className="content-section results-area">
        <h2 className="section-heading">Classification Results</h2>
        <div className="placeholder-box">
          <p>Placeholder for overall classification (Normal/Abnormal).</p>
          <p>Normal Probability: [Placeholder]%</p>
          <p>Abnormal Probability: [Placeholder]%</p>
        </div>
      </div>

      <div className="content-section visualization-area">
        <h2 className="section-heading">Grad-CAM Visualization</h2>
        <div className="placeholder-box">
          <p>Placeholder for displaying the Grad-CAM heatmap overlayed on the original image.</p>
        </div>
      </div>

      <div className="research-disclaimer-section">
        <p className="research-disclaimer-text">
          This is a research prototype. It has not undergone clinical validation and should not be used for medical diagnosis, treatment decisions, or any clinical purpose. It does not provide neonatal RDS diagnosis, clinical diagnosis, disease probability, or patient risk prediction.
        </p>
      </div>
    </div>
  );
}

export default Phase1Page;
