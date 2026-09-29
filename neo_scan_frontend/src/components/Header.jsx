import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">NeoScan AI</Link>
        <nav className="site-nav">
          <ul className="site-nav__list">
            <li><Link to="/" className="site-nav__link">Home</Link></li>
            <li><Link to="/phase1" className="site-nav__link">Phase 1</Link></li>
            <li><Link to="/method" className="site-nav__link">Method</Link></li>
            <li><Link to="/privacy" className="site-nav__link">Privacy</Link></li>
            <li><Link to="/terms" className="site-nav__link">Terms</Link></li>
          </ul>
        </nav>
        <Link to="/phase1" className="site-header__cta">Analyze an image</Link>
      </div>
    </header>
  );
}

export default Header;
