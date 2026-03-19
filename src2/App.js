import { useState } from "react";

// Styles
import "./styles/tokens.css";
import "./styles/global.css";

// Layout
import Sidebar from "./components/Sidebar";
import TopBar  from "./components/TopBar";

// Pages
import Dashboard     from "./pages/Dashboard";
import ProductsPage  from "./pages/ProductsPage";
import ApplyPage     from "./pages/ApplyPage";
import PoliciesPage  from "./pages/PoliciesPage";
import ClaimsPage    from "./pages/ClaimsPage";
import PaymentsPage  from "./pages/PaymentsPage";
import DocumentsPage from "./pages/DocumentsPage";
import ProfilePage   from "./pages/ProfilePage";

export default function App() {
  const [page, setPage]                 = useState("dashboard");
  const [selectedProduct, setProduct]   = useState(null);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard setPage={setPage} />;
      case "products":  return <ProductsPage setPage={setPage} setSelectedProduct={setProduct} />;
      case "apply":     return <ApplyPage product={selectedProduct} setPage={setPage} />;
      case "policies":  return <PoliciesPage setPage={setPage} />;
      case "claims":    return <ClaimsPage />;
      case "payments":  return <PaymentsPage />;
      case "documents": return <DocumentsPage />;
      case "profile":   return <ProfilePage />;
      default:          return <Dashboard setPage={setPage} />;
    }
  };

  return (
    // bg-[#F7F3ED] = --cream
    <div className="flex min-h-screen bg-[#F7F3ED] font-['DM_Sans']">
      <Sidebar page={page} setPage={setPage} />
      <div className="ml-[280px] flex-1 min-h-screen flex flex-col">
        <TopBar page={page} setPage={setPage} />
        {renderPage()}
      </div>
    </div>
  );
}