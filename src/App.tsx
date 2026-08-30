import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { SOSProvider } from '@/context/SOSContext';
import AppRoutes from '@/router/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SOSProvider>
          <AppRoutes />
        </SOSProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
