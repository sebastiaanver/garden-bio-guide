import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChallengesAcceptedScreen from "./components/ChallengesAcceptedScreen";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/success" element={<ChallengesAcceptedScreen />} />
      </Routes>
    </Router>
  );
}

export default App;