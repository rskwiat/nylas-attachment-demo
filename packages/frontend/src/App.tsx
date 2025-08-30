import { useState } from 'react';
import { FaEnvelope, FaPaperclip, FaUser, FaCog, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import './App.css';
import EmailModal from './components/EmailModal';

interface EmailForm {
  to: string;
  subject: string;
  body: string;
}

function App() {
  const [theme, setTheme] = useState('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState<EmailForm>({
    to: '',
    subject: '',
    body: ''
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleInputChange = (field: keyof EmailForm, value: string) => {
    setEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendEmail = async () => {
    try {
      // Here you would make the API call to your backend
      console.log('Sending email:', emailForm);
      
      // Close modal and reset form
      setIsModalOpen(false);
      setEmailForm({ to: '', subject: '', body: '' });
      
      // Show success message (you can use a toast library or alert)
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmailForm({ to: '', subject: '', body: '' });
  };

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
            <p>Fetch all emails sent by nylas here</p>
          </div>
        </div>
      </div>

      {/* Compose Email Modal */}
      {isModalOpen && <EmailModal />}
    </div>
  );
}

export default App;
