// App.tsx
import React from 'react';
import ChessGame from './components/ChessGame';
import './App.css'

const App: React.FC = () => {
    return (
            <div className="app">
                <ChessGame />
            </div>
    );
};

export default App;
