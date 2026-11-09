import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@/App.css";
import { SiteContentProvider } from "@/context/SiteContent";
import { LangProvider } from "@/context/Lang";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Programme from "@/pages/Programme";
import InfoPage from "@/pages/InfoPage";
import Projects from "@/pages/Projects";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import AdminGate from "@/admin/AdminGate";

function PublicRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/ai-vista-360" element={<Programme kind="ai" />} />
        <Route path="/ai-training" element={<Navigate to="/ai-vista-360" replace />} />
        <Route path="/vedic-maths" element={<Programme kind="vedic" />} />
        <Route path="/kids-programming" element={<InfoPage type="kids" />} />
        <Route path="/online-classes" element={<InfoPage type="online" />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <LangProvider>
    <SiteContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminGate />} />
          <Route path="/admin-sign-up/*" element={<AdminGate />} />
          <Route path="/sign-in/*" element={<Navigate to="/admin" replace />} />
          <Route path="/sign-up/*" element={<Navigate to="/admin-sign-up" replace />} />
          <Route path="*" element={<PublicRoutes />} />
        </Routes>
      </BrowserRouter>
    </SiteContentProvider>
    </LangProvider>
  );
}
