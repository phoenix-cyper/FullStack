import React from 'react';
import './App.css';
import PostComposer from './components/PostComposer';
import PostList from './components/PostList';
import Header from './components/Header';
import FilterBar from './components/FilterBar'; // Import it

function App() {
  return (
    <div className="App">
      <div className="background-circle circle1"></div>
      <div className="background-circle circle2"></div>

      <header className="hero">
        <h1>🚀 Social Media Post Manager</h1>
        <p>Redux Toolkit | Memoization | Global State</p>
      </header>

      <Header />
      <PostComposer />
      
      {/* Add the Filter Bar here */}
      <FilterBar />
      
      <PostList />
    </div>
  );
}

export default App;