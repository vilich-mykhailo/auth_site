import { createPortal } from "react-dom";
import "./SuccessModal.css";

const SuccessModal = ({ onClose }) => {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card success" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Готово 💚</h2>

        <p className="success-text">
          Ви успішно записались!  
          Ми звʼяжемось з вами найближчим часом.
        </p>

        <button className="modal-submit" onClick={onClose}>
          Закрити
        </button>
      </div>
    </div>,
    document.body
  );
};

export default SuccessModal;
