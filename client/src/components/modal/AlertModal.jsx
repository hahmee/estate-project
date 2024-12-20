import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./alertModal.scss";
import Button from "../../UI/Button.jsx"; // 스타일링 파일

const AlertModal = ({title, message, onClose, onClickYes, children}) => {

    // Portal을 통해 모달을 렌더링할 DOM 노드
    const modalRoot = document.getElementById("modal-root");

    useEffect(() => {
        // 모달이 열리면 body 스크롤 방지
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // 모달 컴포넌트
    const modalContent = (
        <div className="alert-modal-overlay" onClick={onClose}>
            <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
                {title && <h2 className="alert-modal-title">{title}</h2>}
                <p className="alert-modal-message">{message}</p>
                {children}
                <div className="alert-modal-footer">
                    <Button outlined onClick={onClose}>
                        No
                    </Button>
                    <Button onClick={onClickYes}>
                        Yes
                    </Button>

                </div>

            </div>
        </div>
    );

    // Portal을 사용해 모달을 modalRoot에 렌더링
    return ReactDOM.createPortal(modalContent, modalRoot);
};

AlertModal.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default AlertModal;
