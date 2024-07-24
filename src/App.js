'use strict';
import logo from './logo.svg';
import ChessGame from './chess';
import './App.css';
import ConnectFour from './connetct';
import Main from './web.jsx'
import ComprehensiveFactoringFlowchart from './unit1assignment.jsx'
import SnakeGame from './snake.jsx';
import MemoryGame from './match';
import Appone from './ttt';
import BlockPuzzleGame from './puzzle';
import LandingPage1 from './www';
import App3 from './opp';
import Page from './page';
import Connect42 from './ct42';
function App() {
  return (
    <>
    <Connect42/>
    <ChessGame/>
    <MemoryGame/>
   <LandingPage1/>
   <SnakeGame/>
   <Appone/>
   <ConnectFour/>
    {/*<MemoryGame/>
   <ConnectFour/>
   <ChessGame/>
   */ }
   
   <Main/>
   <Page/>
   <ChessGame/>

   
   </>
  );
}

export default App;
