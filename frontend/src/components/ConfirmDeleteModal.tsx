import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ConfirmDeleteModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    itemName?: string; // Опциональное имя элемента для более точного сообщения
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
                                                                   show,
                                                                   onHide,
                                                                   onConfirm,
                                                                   itemName
                                                               }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Подтверждение удаления</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Вы уверены, что хотите удалить{itemName ? ` "${itemName}"` : ''}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Удалить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDeleteModal;