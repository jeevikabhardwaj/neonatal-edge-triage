import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <p className="eyebrow">LUNG ULTRASOUND RESEARCH PROTOTYPE</p>
        <h1 className="hero-heading">AI-assisted lung ultrasound classification</h1>
        <p className="hero-supporting-text">
          NeoScan AI Phase 1 analyzes a lung ultrasound image and classifies it as Normal or Abnormal, with a confidence breakdown and Grad-CAM visualization for model interpretability.
        </p>
        <div className="hero-actions">
          <Link to="/phase1" className="button primary-button">Analyze an image</Link>
          <Link to="/method" className="button secondary-button">View methodology</Link>
        </div>
      </section>

      <section className="workflow-section">
        <h2 className="section-heading">How it works</h2>
        <div className="workflow-steps">
          <div className="workflow-step">
            <span className="step-number">01</span>
            <h3 className="step-title">Upload</h3>
            <p className="step-description">Add a lung ultrasound image.</p>
          </div>
          <div className="workflow-step">
            <span className="step-number">02</span>
            <h3 className="step-title">Analyze</h3>
            <p className="step-description">The Phase 1 model processes the image.</p>
          </div>
          <div className="workflow-step">
            <span className="step-number">03</span>
            <h3 className="step-title">Review</h3>
            <p className="step-description">View the classification, probabilities, and Grad-CAM visualization.</p>
          </div>
        </div>
      </section>

      <section className="research-statement-section">
        <p className="research-statement">
          NeoScan AI is a research prototype exploring AI-assisted lung ultrasound image classification, with synthetic adaptations intended to investigate its potential relevance to neonatal settings.
        </p>
      </section>
    </div>
  );
}

export default HomePage;
