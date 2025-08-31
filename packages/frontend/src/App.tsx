import { useEffect, useState } from 'react';
import { FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
import './App.css';
import EmailModal from './components/EmailModal';
import EmailCard from './components/EmailCard';

function App() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    fetchSentEmails();
  }, [isModalOpen]);

  const fetchSentEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/nylas/sent-emails');
      if (!response.ok) {
        throw new Error('Failed to fetch sent emails');
      }

      const data = await response.json();
      setEmails(data.messages);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error('Failed to fetch emails', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation Bar */}
      <div className="navbar bg-base-200 shadow-lg">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">
            <FaEnvelope className="mr-2" />
            Nylas Attachment Test
          </a>
        </div>

        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Email Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <FaEnvelope className="mr-2" />
            Compose Email
          </button>
        </div>

        {/* Email List Content */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Emails</h2>
            {loading && (
              <div className="flex justify-center items-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>          
            )}

            {emails && <EmailCard emails={emails} />}
          </div>
        </div>
      </div>

      {/* Compose Email Modal */}
      {isModalOpen && <EmailModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}

export default App;
