import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface FeedbackModalProps {
    message: string | null;
    error: string | null;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ message, error, onClose }) => {
    const show = !!message || !!error;

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{message ? 'Успех' : 'Ошибка'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant={message ? "success" : "danger"} onClick={onClose}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FeedbackModal;