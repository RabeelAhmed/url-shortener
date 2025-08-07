import { Toaster } from 'react-hot-toast';
import UrlShortener from './components/UrlShortener';


function App() {
  return (
    <div className="min-h-screen bg-gray-700 sm:bg-gray-50 dark:bg-gray-800 sm:dark:bg-gray-800">
  {/* Background Image Container for larger screens only */}
  <div className="hidden sm:block fixed inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-xs"></div>
    <img 
      src="/background.jpg"
      alt="Background"
      className="w-full h-full object-cover"
    />
  </div>

  <main className="container mx-auto px-4 py-8 relative">
    <h1 className="text-4xl font-bold text-center text-white mb-2 drop-shadow-lg">
      URL Shortener
    </h1>
    <p className="text-center text-gray-200 mb-8 drop-shadow">
      Shorten your long URLs quickly and easily
    </p>
    
    <UrlShortener />
  </main>

  <Toaster position="top-center" />
</div>

  );
}

export default App;