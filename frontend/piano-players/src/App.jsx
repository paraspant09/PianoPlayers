import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import LikesState from './contexts/LikesState';

function App() {
  return (
    <LikesState>
      <BrowserRouter>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/search" element={<Search />}/>
              <Route path="/dashboard" element={<Dashboard />}/>
              <Route path="/about" element={<About />}/>
              <Route path="/contact" element={<Contact />}/>
              <Route path="/signin" element={<SignIn />}/>
              <Route path="*" element={<NotFound />}/>
            </Routes>
          </div>
      </BrowserRouter>
    </LikesState>
  );
}

export default App;
