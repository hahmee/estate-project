import React, { useState } from 'react';
import AlertModal from './AlertModal';

export default {
    title: 'Components/AlertModal',
    component: AlertModal,
};

export const Default = () => {
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);
    const handleYes = () => {
        alert('Yes clicked!');
        setOpen(false);
    };

    return (
        <>
            <button onClick={() => setOpen(true)}>모달 열기</button>
            {open && (
                <AlertModal
                    title="경고"
                    message="정말로 삭제하시겠습니까?"
                    onClose={handleClose}
                    onClickYes={handleYes}
                >
                    <p style={{ color: 'red', marginBottom: '1rem' }}>이 작업은 되돌릴 수 없습니다.</p>
                </AlertModal>
            )}
        </>
    );
};
