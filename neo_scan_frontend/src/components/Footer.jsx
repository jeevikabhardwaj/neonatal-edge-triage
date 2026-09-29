import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__title">NeoScan AI</p>
        <p className="site-footer__tagline">Lung Ultrasound Research Prototype</p>
        <nav className="site-footer__nav">
          <ul className="site-footer__links">
            <li><Link to="/" className="site-footer__link">Home</Link></li>
            <li><Link to="/phase1" className="site-footer__link">Phase 1</Link></li>
            <li><Link to="/method" className="site-footer__link">Method</Link></li>
            <li><Link to="/privacy" className="site-footer__link">Privacy</Link></li>
            <li><Link to="/terms" className="site-footer__link">Terms</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
