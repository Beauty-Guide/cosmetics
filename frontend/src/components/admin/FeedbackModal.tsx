import React from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog';
import {Button} from "@/components/ui/button.tsx";

interface FeedbackModalProps {
    message: string | null;
    error: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({message, error, open, onOpenChange}) => {
    const isSuccess = !!message;
    const title = isSuccess ? 'Успех' : 'Ошибка';
    const buttonText = isSuccess ? 'Закрыть' : 'Понятно';
    const buttonVariant = isSuccess ? 'success' : 'destructive';

    if (!message && !error) return null;

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            if (!newOpen) {
                // Очищаем сообщения при закрытии
                onOpenChange(false);
                return;
            }
            onOpenChange(true);
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {message && <p className="text-green-600">{message}</p>}
                    {error && <p className="text-red-600">{error}</p>}
                </div>
                <div className="flex justify-end">
                    <Button variant={buttonVariant} onClick={() => onOpenChange(false)}>
                        {buttonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FeedbackModal;