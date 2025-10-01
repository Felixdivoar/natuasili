import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/tapProbe' // Make tap probe available globally for debugging
import './utils/bookNowTestUtils' // Make Book Now testing utilities available
import "@/utils/interactiveChips";
import { initPerformanceMonitor } from './utils/performanceMonitor';

// Initialize performance monitoring
initPerformanceMonitor();

createRoot(document.getElementById("root")!).render(<App />);
