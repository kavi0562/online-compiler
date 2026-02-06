import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";

const CompilerPage = lazy(() => import("./pages/CompilerPage"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/compiler/:lang"
          element={
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Compiler...</div>}>
              <CompilerPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
