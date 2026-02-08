import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./ReserveModal.css";
import ScheduleModal from "./ScheduleModal/ScheduleModal";

const ReserveModal = ({ massage, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [schedule, setSchedule] = useState(null);
  const [isScheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      setServerError("");

      const res = await fetch("http://localhost:5000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          massage: massage.title,
          date: schedule.date,
          time: schedule.time,
          masterId: schedule.master.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Помилка сервера");
      }

      onSuccess();
    } catch (err) {
      setServerError(err.message || "Не вдалося зберегти запис");
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
  const newErrors = {};

  if (!name.trim()) newErrors.name = "Введіть імʼя";
  if (!phone.trim()) newErrors.phone = "Введіть номер телефону";

  if (!email.trim()) {
    newErrors.email = "Введіть email";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    newErrors.email = "Некоректний email";
  }

  if (!schedule) {
    newErrors.schedule = "Оберіть дату та час";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Запис</h2>
        <p className="modal-massage">{massage.title}</p>
        <span className="modal-price">{massage.price}</span>

        <input
          className={`modal-input ${errors.name ? "error" : ""}`}
          placeholder="Ваше імʼя"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: null }));
          }}
        />
        {errors.name && <p className="input-error">{errors.name}</p>}

        <input
          className={`modal-input ${errors.phone ? "error" : ""}`}
          placeholder="+380 ХХХ ХХХ ХХХ"
          value={phone}
          onFocus={() => {
            if (!phone) setPhone("+380");
          }}
          onChange={(e) => {
            const value = e.target.value;

            // дозволяємо повністю очистити
            if (value === "") {
              setPhone("");
              return;
            }

            // дозволяємо тільки + і цифри
            if (!/^\+?\d*$/.test(value)) return;

            setPhone(value);
            setErrors((prev) => ({ ...prev, phone: null }));
          }}
        />
        {errors.phone && <p className="input-error">{errors.phone}</p>}

        <input
          type="email"
          className={`modal-input ${errors.email ? "error" : ""}`}
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: null }));
          }}
        />
        {errors.email && <p className="input-error">{errors.email}</p>}

        <button
          type="button"
          className="modal-submit secondary"
          onClick={() => setScheduleOpen(true)}
        >
          {schedule
            ? `${schedule.date} • ${schedule.time} • ${schedule.master.name}`
            : "Обрати дату та час"}
        </button>
        {isScheduleOpen && (
          <ScheduleModal
            onClose={() => setScheduleOpen(false)}
            onSave={(data) => {
              setSchedule(data);
              setScheduleOpen(false);
            }}
          />
        )}

        <button
          className="modal-submit"
          onClick={handleSubmit}
          disabled={isLoading || !schedule}
        >
          {isLoading ? "Зачекайте..." : "Записатись"}
        </button>
        {serverError && (
          <p className="input-error" style={{ textAlign: "center" }}>
            {serverError}
          </p>
        )}

        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default ReserveModal;
