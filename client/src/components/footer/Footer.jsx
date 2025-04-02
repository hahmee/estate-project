import React from 'react';
import './footer.scss';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__section">
                    <h3 className="footer__title">회사 정보</h3>
                    <ul className="footer__list">
                        <li><a href="/about">회사 소개</a></li>
                        <li><a href="/contact">연락처</a></li>
                        <li><a href="/careers">채용 정보</a></li>
                    </ul>
                </div>
                <div className="footer__section">
                    <h3 className="footer__title">고객 지원</h3>
                    <ul className="footer__list">
                        <li><a href="/faq">자주 묻는 질문</a></li>
                        <li><a href="/support">고객 지원</a></li>
                        <li><a href="/terms">이용 약관</a></li>
                    </ul>
                </div>
                <div className="footer__section">
                    <h3 className="footer__title">소셜 미디어</h3>
                    <ul className="footer__list">
                        <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer__bottom">
                <p>&copy; {new Date().getFullYear()} Real-Estate. 모든 권리 보유.</p>
            </div>
        </footer>
    );
}

export default Footer;
