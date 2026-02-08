import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./components/Header/HeaderActions/HomePage/HomePage";
import Contacts from "./components/Header/HeaderActions/Contacts/Contacts";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import MassagePage from "./components/Header/HeaderActions/HomePage/MassagePage/MassagePage";
import GiftCertificatePage from "./components/Header/HeaderActions/GiftCertificatePage/GiftCertificatePage";

import ScrollToTop from "./components/ScrollToTop";
import ScrollToSection from "./components/ScrollToSection";

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <ScrollToTop />
      <ScrollToSection />

      <main>
        <Routes location={location} key={location.pathname}>

          {/* 🌍 PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/certificates" element={<GiftCertificatePage />} />

          <Route path="/massagePage" element={<MassagePage />} />
          <Route path="/massage/:type" element={<MassagePage />} />

          {/* ❌ 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      </>
  );
}

export default App;

