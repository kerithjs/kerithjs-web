import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import DocsLayout from "@/layouts/DocsLayout";
import DocsHome from "@/pages/docs/DocsHome";
import DocsNotFound from "@/pages/docs/DocsNotFound";
import DocPage from "@/pages/docs/DocPage";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/docs" replace />} />

        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsHome />} />
          <Route path=":slug" element={<DocPage />} />
          <Route path="404" element={<DocsNotFound />} />
          <Route path="*" element={<DocsNotFound />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
