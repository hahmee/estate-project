import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./alertModal.scss";
import Button from "../../UI/Button.jsx";

const AlertModal = ({ title, message, onClose, onClickYes, children }) => {
    const [modalRoot, setModalRoot] = useState(null);

    useEffect(() => {
        setModalRoot(document.getElementById("modal-root")); // 🔥 useEffect로 늦게 실행

        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    if (!modalRoot) return null; // ✅ 없으면 렌더 X

    const modalContent = (
        <div className="alert-modal-overlay" onClick={onClose}>
            <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
                {title && <h2 className="alert-modal-title">{title}</h2>}
                <p className="alert-modal-message">{message}</p>
                {children}
                <div className="alert-modal-footer">
                    <Button outlined onClick={onClose}>No</Button>
                    <Button onClick={onClickYes}>Yes</Button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, modalRoot);
};

AlertModal.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default AlertModal;
