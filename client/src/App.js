import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './views/Home';
import InventoryList from './views/InventoryList';
import AddItem from './views/AddItem';
import EditItem from './views/EditItem';
import RecipeSuggestions from './views/RecipeSuggestions';
import RecipeChat from './views/RecipeChat';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/edit-item/:id" element={<EditItem />} />
            <Route path="/recipe-suggestions" element={<RecipeSuggestions />} />
            <Route path="/recipe-chat" element={<RecipeChat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;