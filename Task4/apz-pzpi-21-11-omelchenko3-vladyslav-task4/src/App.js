import React from 'react';
import './i18n';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Homepage';
import GymList from './components/GymList';
import GymDetail from './components/GymDetail';
import TrainingList from './components/TrainingList';
import TrainingDetail from './components/TrainingDetail';
import ZoneDetail from './components/ZoneDetail';
import OwnerGyms from './components/OwnerGyms';
import GymZones from './components/GymZones';
import GymCoaches from './components/GymCoaches';
import CoachGyms from './components/CoachGyms';
import CoachTrainings from './components/CoachTrainings';
import ClientReservations from './components/ClientReservations';
import GymTrainings from './components/GymTrainings';
import EditGym from './components/EditGym';
import EditZone from './components/EditZone';
import CreateGym from './components/CreateGym';
import CreateZone from './components/CreateZone';
import CreateTraining from './components/CreateTraining';
import EditTraining from './components/EditTraining';
import AddCoach from './components/AddCoach';
import SensorData from './components/SensorData';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login/" element={<Login />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/homepage/" element={<Homepage />} />
          <Route path="/gyms/" element={<GymList />} />
          <Route path="/gym/:id" element={<GymDetail />} />
          <Route path="/trainings/" element={<TrainingList />} />
          <Route path="/training/:id/" element={<TrainingDetail />} />
          <Route path="/zone/:id/" element={<ZoneDetail />} />

          <Route path="/owner_gyms/:userId/" element={<OwnerGyms />} />
          <Route path="/coach_gyms/:userId/" element={<CoachGyms />} />
          <Route path="/coach_trainings/:userId/" element={<CoachTrainings />} />
          <Route path="/client_reservations/:userId/" element={<ClientReservations />} />

          <Route path="/gym_trainings/:id/" element={<GymTrainings />} />
          <Route path="/gym_zones/:gymId" element={<GymZones />} />
          <Route path="/gym_coaches/:gymId" element={<GymCoaches />} />
          
          <Route path="/add_gym_coach/:gymId" element={<AddCoach />} />

          <Route path="/create_gym/" element={<CreateGym />} />
          <Route path="/edit_gym/:gymId/" element={<EditGym />} />
          <Route path="/edit_zone/:zoneId/" element={<EditZone />} />
          <Route path="/create_zone/:gymId/" element={<CreateZone />} />

          <Route path="/create_training/" element={<CreateTraining />} />
          <Route path="/create_training/gym/:gymId" element={<CreateTraining />} />
          <Route path="/create_training/zone/:zoneId" element={<CreateTraining />} />
          <Route path="/create_training/gym/:gymId/zone/:zoneId" element={<CreateTraining />} />
          <Route path="/edit_training/:trainingId/" element={<EditTraining />} />

          <Route path="/coach_trainings/gym/:gymId" element={<CoachTrainings />} />
          <Route path="/coach_trainings/zone/:zoneId" element={<CoachTrainings />} />

          <Route path="/zone/:zoneId/sensor-data" element={<SensorData />} />
          
          <Route exact path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;