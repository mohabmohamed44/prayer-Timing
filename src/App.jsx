import { Container } from '@mui/material';
import './App.css';
import MainContent from './Components/MainContent/MainContent';
function App() {
  return (
    <>
     <div className='mainContentStyles'>
      <Container maxWidth="2xl" spacing={4}> 
        <MainContent />
      </Container>
     </div>
    </>
  )
}

export default App
