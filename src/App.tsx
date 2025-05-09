import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="watch/:showId/:seasonId/:episodeId" element={<Watch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
