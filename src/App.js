import React from 'react';
import './App.css';
import Routes from './routes';

// componente stateless podem ser usar um sintax-sugar
// dezindo a uma função ou a uma const que recepe o return da função
// const App = function() {
//   return <Main />;
// };
const App = () => <Routes />;

export default App;
