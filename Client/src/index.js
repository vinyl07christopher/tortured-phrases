import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./fileupload";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
