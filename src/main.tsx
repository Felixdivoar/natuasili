import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "@/utils/interactiveChips";

// Initialize booking system after React renders
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure React components are fully rendered
  setTimeout(() => {
    // Trigger booking system initialization for any React-rendered components
    const event = new CustomEvent('reactComponentsReady');
    document.dispatchEvent(event);
  }, 500);
});

createRoot(document.getElementById("root")!).render(<App />);
