
function TermsPage() {
  return (
    <div className="page-container terms-page">
      <h1 className="page-heading">Terms and Conditions for NeoScan AI</h1>

      <section className="terms-section">
        <h2 className="section-heading">1. Research Prototype Status</h2>
        <p className="section-text">
          NeoScan AI is a research prototype. Its purpose is to explore the application of artificial intelligence in lung ultrasound image classification. It is under continuous development and is provided for informational and research purposes only.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">2. Intended Use</h2>
        <p className="section-text">
          The Service is intended for use by researchers and individuals interested in AI-assisted image analysis. It is designed to classify lung ultrasound images as 'Normal' or 'Abnormal' and to provide Grad-CAM visualizations. It is not intended for high-stakes decision-making or any clinical application.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">3. No Medical Diagnosis or Advice</h2>
        <p className="section-text">
          The results provided by NeoScan AI do not constitute medical advice, diagnosis, or treatment. The Service is not a medical device, nor is it a substitute for professional medical judgment. Always consult with a qualified healthcare professional for any medical concerns or conditions.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">4. No Guarantee of Accuracy or Availability</h2>
        <p className="section-text">
          The accuracy, reliability, or completeness of the analysis provided by the Service cannot be guaranteed. The Service is provided "as is" and "as available" without any warranties. We do not guarantee uninterrupted, secure, or error-free operation of the Service.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">5. User Responsibilities and Acceptable Use</h2>
        <ul className="list-details">
          <li>Users should only upload images they are authorized to submit for processing.</li>
          <li>Users agree not to upload images containing Protected Health Information (PHI) or Personally Identifiable Information (PII) without explicit authorization and compliance with all applicable regulations.</li>
          <li>Users agree not to use the Service for any unlawful, unethical, or malicious purposes.</li>
          <li>Users agree not to attempt to interfere with the Service's proper functioning or security.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">6. Third-Party Infrastructure</h2>
        <p className="section-text">
          The Service relies on third-party cloud infrastructure for hosting and processing. While we select reputable providers, we are not responsible for the performance, security, or data handling practices of these external services.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">7. Intellectual Property</h2>
        <p className="section-text">
          The NeoScan AI prototype and its software components are provided subject to the applicable rights and licenses associated with the project and its dependencies.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">8. Service Availability</h2>
        <p className="section-text">
          We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice, for any reason. We will not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">9. Limitation of Responsibility</h2>
        <p className="section-text">
          To the fullest extent permitted by law, the developers of NeoScan AI shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of, or inability to use, the Service.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="section-heading">10. Future Changes and Review</h2>
        <p className="section-text">
          These Terms and Conditions may be revised as the NeoScan AI project evolves. Users are encouraged to review them periodically. For final deployment contexts, a comprehensive legal review of these terms will be essential to ensure compliance with relevant regulations.
        </p>
      </section>
    </div>
  );
}

export default TermsPage;
