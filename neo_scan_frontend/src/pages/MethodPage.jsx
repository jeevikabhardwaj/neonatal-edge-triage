
function MethodPage() {
  return (
    <div className="page-container method-page">
      <h1 className="page-heading">NeoScan AI Phase 1: Methodology Overview</h1>

      <section className="method-section">
        <h2 className="section-heading">Phase 1 Task</h2>
        <p className="section-text">
          Binary classification of lung ultrasound images: Normal vs. Abnormal.
        </p>
      </section>

      <section className="method-section">
        <h2 className="section-heading">Model Architecture</h2>
        <p className="section-text">
          The classification model used is MobileNetV3-Small. It was initialized with ImageNet pre-trained weights and subsequently fine-tuned on a specialized dataset for the lung ultrasound classification task.
        </p>
      </section>

      <section className="method-section">
        <h2 className="section-heading">Input Data</h2>
        <p className="section-text">
          The model processes 224 x 224 pixel RGB lung ultrasound images.
        </p>
      </section>

      <section className="method-section">
        <h2 className="section-heading">Interpretability</h2>
        <p className="section-text">
          Grad-CAM (Gradient-weighted Class Activation Mapping) is employed to provide visual interpretability, highlighting regions within the input image that are most influential to the model's classification decision.
        </p>
      </section>

      <section className="method-section">
        <h2 className="section-heading">Dataset & Domain Adaptation</h2>
        <p className="section-text">
          The primary dataset utilized for training is a public POCUS (Point-of-Care Ultrasound) lung ultrasound dataset. This source dataset consists of adult POCUS data. To enhance its relevance for neonatal applications, synthetic image transformations were applied during the training phase to introduce variations characteristic of the neonatal domain. It is important to note that these synthetic transformations are not real neonatal clinical data.
        </p>
      </section>

      <section className="research-disclaimer-section">
        <h2 className="section-heading">Research Prototype Disclaimer</h2>
        <p className="research-disclaimer-text">
          NeoScan AI Phase 1 is a research prototype. It is not a clinically validated neonatal diagnostic system and should not be used for medical diagnosis, treatment, or patient management decisions. It does not claim neonatal RDS detection.
        </p>
      </section>
    </div>
  );
}

export default MethodPage;
