import { ReactNode } from "react";

interface CommonModalProps {
    show: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
}

export default function CommonModal({ show, onClose, title, children, footer }: CommonModalProps) {
    if (!show) return null;

    return (
        <div className="modal show fade d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content bg-dark text-white">
                    {title && (
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                    )}
                    <div className="modal-body">{children}</div>
                    {footer && <div className="modal-footer">{footer}</div>}
                </div>
            </div>
        </div>
    );
}
