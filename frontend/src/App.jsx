import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import ChatBot from "./components/chatbot/Chatbot";
import ScrollToTop from "./components/about-us/ScrollToTop";
import Footer from "./components/Footer";


function App() {
  return (
    <div className="app-layout">
    
      <ScrollToTop />
      <Header />
      <ChatBot />
      <Outlet />
      <Footer />
    
    </div>
  );
}

export default App;
