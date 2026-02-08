import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import { uk } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "./ScheduleModal.css";
import "./CalendarCustom.css";

const HOURS = Array.from({ length: 13 }, (_, i) => `${i + 9}:00`);

const MASTERS = [
  { id: 1, name: "Олена", photo: "/images/HomePage/teams/teams-1.png" },
  { id: 2, name: "Ірина", photo: "/images/HomePage/teams/teams-2.png" },
  { id: 3, name: "Марія", photo: "/images/HomePage/teams/teams-3.png" },
];

const ScheduleModal = ({ onClose, onSave }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [master, setMaster] = useState(null);
  const [availability, setAvailability] = useState([]);
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

  const hoursRef = useRef(null);
const today = new Date();
const isToday =
  date &&
  date.getFullYear() === today.getFullYear() &&
  date.getMonth() === today.getMonth() &&
  date.getDate() === today.getDate();

const currentHour = today.getHours();

  /* =========================
     LOAD AVAILABILITY
  ========================= */
  useEffect(() => {
    if (!date) return;

    fetch(
      `http://localhost:5000/availability?date=${date.toLocaleDateString(
        "en-CA"
      )}`
    )
      .then((res) => res.json())
      .then(setAvailability);
  }, [date]);

  /* =========================
     DERIVED DATA
  ========================= */

  // години, які зайняті ВСІМА майстрами
  const fullyBusyHours = HOURS.filter(
    (h) => availability.filter((a) => a.time === h).length === MASTERS.length
  );

  // показуємо ТІЛЬКИ вільні години
const availableHours = HOURS.filter((h) => {
  const hourNumber = parseInt(h.split(":")[0], 10);

  // ❌ повністю зайнята всіма майстрами
  if (fullyBusyHours.includes(h)) return false;

  // ❌ сьогодні і час уже минув
  if (isToday && hourNumber <= currentHour) return false;


  return true;
});


  // показуємо ТІЛЬКИ вільних майстрів на обраний час
  const availableMasters = time
    ? MASTERS.filter(
        (m) =>
          !availability.some(
            (a) => a.time === time && a.master_id === m.id
          )
      )
    : [];

  const isValid = date && time && master;

  /* =========================
     RENDER
  ========================= */

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card schedule">
        <h2 className="modal-title">Оберіть дату та час</h2>

        {/* CALENDAR */}
        <div className="calendar">
<DayPicker
  mode="single"
  selected={date}
  locale={uk}
  disableNavigationFocus
  fromDate={todayStart}
  disabled={{ before: todayStart }}
  onSelect={(day) => {
    if (!day) return;
    setDate(day);
    setTime("");
    setMaster(null);
    document.activeElement?.blur();
    setTimeout(() => {
      hoursRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }}
/>

        </div>

        {/* HOURS */}
        <div className="hours" ref={hoursRef}>
          {date && availableHours.length === 0 && (
            <p className="empty">
              На цю дату немає доступних годин
            </p>
          )}
{date && availableHours.length === 0 && (
  <p className="empty">
    На цю дату немає доступних годин
  </p>
)}
          {availableHours.map((h) => (
            <button
              key={h}
              className={`hour ${time === h ? "active" : ""}`}
              onClick={() => {
                setTime(h);
                setMaster(null);
              }}
            >
              {h}
            </button>
          ))}
        </div>

        {/* MASTERS */}
        <div className="masters">
          {time && availableMasters.length === 0 && (
            <p className="empty">
              Немає доступних майстрів на обраний час
            </p>
          )}

          {availableMasters.map((m) => (
            <button
              key={m.id}
              className={`master ${master?.id === m.id ? "active" : ""}`}
              onClick={() => setMaster(m)}
            >
              <img src={m.photo} alt={m.name} />
              <span>{m.name}</span>
            </button>
          ))}
        </div>

        <button
          className="modal-submit"
          disabled={!isValid}
          onClick={() =>
            onSave({
              date: date.toLocaleDateString("en-CA"),
              time,
              master,
            })
          }
        >
          Зберегти
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ScheduleModal;
