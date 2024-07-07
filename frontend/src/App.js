import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import InstructionPage from './pages/InstructionPage';
import LandingPage from './pages/LandingPage';
import NavSection from './pages/NavBarSection/Navbar';
import AssessmentCrud from './pages/CrudOpertations/AssessmentCrud';
import CreateAssessment from './pages/CrudOpertations/CreateAssessment';
import UpdateAssessment from './pages/CrudOpertations/UpdateAssessment';
import Reports from './pages/Reports/Reports';
import AssessmentPage from './pages/CrudOpertations/AssessmentPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<><NavSection /><LandingPage /></>} />
          <Route path="/instructions" element={<><NavSection /><InstructionPage /></>} />
          <Route path="/assessment" element={<><NavSection /><AssessmentCrud /></>} />
          <Route path="/take-assessment" element={<><NavSection /><AssessmentPage /></>} /> {/* New Route */}
          <Route path='/create' element={<><NavSection /> <CreateAssessment /> </>} />
          <Route path='/update/:id' element={<><NavSection /> <UpdateAssessment /></>} />
          <Route path='/reports' element={<><NavSection /> <Reports /> </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
