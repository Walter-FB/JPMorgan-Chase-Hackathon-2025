import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import "./App.css"
import HeaderComponent from "./components/HeaderComponent"
import MainPageComponent from "./pages/MainPageComponent"
import ProfileScreen from "./pages/ProfileScreen"
import DogScreen from "./pages/DogScreen"
import SearchScreen from "./pages/SearchScreen"
import LoginScreen from './pages/LoginScreen'

import { useState } from 'react'

function App() {
  return (
    <Router>
      <header className="border-b-1 border-black shadow">
        <HeaderComponent
        />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<MainPageComponent />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/dog/:id" element={<DogScreen />} />
          <Route
            path="/login"
            element={<LoginScreen />}
          />
          <Route path="/busqueda" element={<SearchScreen/>} />

        </Routes>
      </main>
    </Router>
  );
}

export default App