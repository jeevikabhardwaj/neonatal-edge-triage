
function PrivacyPage() {
  return (
    <div className="page-container privacy-page">
      <h1 className="page-heading">Privacy Policy for NeoScan AI</h1>

      <section className="policy-section">
        <h2 className="section-heading">Introduction</h2>
        <p className="section-text">
          This Privacy Policy outlines the practices of the NeoScan AI research prototype regarding the collection, use, and handling of information when you use our web application.
        </p>
      </section>

      <section className="policy-section">
        <h2 className="section-heading">Information Handling</h2>
        <p className="section-text">
          Uploaded images are sent to the NeoScan AI analysis API for processing. The application itself does not provide user accounts or an application-level image storage feature. Requests may be processed by the third-party infrastructure used to operate the service, subject to that provider's systems and policies.
        </p>
      </section>

      <section className="policy-section">
        <h2 className="section-heading">Data Retention</h2>
        <p className="section-text">
          The application itself does not provide a user-facing feature for storing uploaded images or retrieving them later. Uploaded images are submitted to the analysis API for processing. Because the service relies on third-party infrastructure, users should review the applicable policies of the infrastructure providers for information about their handling of requests and technical logs.
        </p>
      </section>

      <section className="policy-section">
        <h2 className="section-heading">Third-Party Infrastructure and Technical Information</h2>
        <p className="section-text">
          The NeoScan AI application is hosted on third-party cloud infrastructure. Like most online services, these infrastructure providers may automatically collect standard technical information related to network requests, such as IP addresses, access times, and browser types, for operational, security, and performance monitoring purposes. This information is handled by the respective providers according to their own privacy policies.
        </p>
      </section>

      <section className="policy-section">
        <h2 className="section-heading">Research Prototype Disclaimer</h2>
        <p className="section-text">
          NeoScan AI is a research prototype. This privacy policy reflects its current functionality. As a research project, its features and underlying data handling mechanisms may evolve. Any significant changes to how information is handled will necessitate an update to this policy.
        </p>
      </section>

      <section className="policy-section">
        <h2 className="section-heading">Policy Updates</h2>
        <p className="section-text">
          This policy may be updated periodically to reflect changes in our practices or legal requirements. We encourage users to review this policy regularly. Continued use of the service implies acceptance of the updated policy.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPage;
