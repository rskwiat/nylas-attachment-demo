import { useState } from 'react';
import { FaEnvelope, FaPaperclip, FaUser, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('emails');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation Bar */}
      <div className="navbar bg-base-200 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Emails</a></li>
              <li><a>Attachments</a></li>
              <li><a>Settings</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">
            <FaEnvelope className="mr-2" />
            Nylas Attachment
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a 
                className={`btn btn-ghost ${activeTab === 'emails' ? 'btn-active' : ''}`}
                onClick={() => setActiveTab('emails')}
              >
                <FaEnvelope className="mr-2" />
                Emails
              </a>
            </li>
            <li>
              <a 
                className={`btn btn-ghost ${activeTab === 'attachments' ? 'btn-active' : ''}`}
                onClick={() => setActiveTab('attachments')}
              >
                <FaPaperclip className="mr-2" />
                Attachments
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <FaUser className="w-6 h-6 m-2" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a><FaCog className="mr-2" />Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {activeTab === 'emails' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Email Management</h1>
              <button className="btn btn-primary">
                <FaEnvelope className="mr-2" />
                Compose Email
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat bg-base-200 rounded-lg shadow">
                <div className="stat-figure text-primary">
                  <FaEnvelope className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Emails</div>
                <div className="stat-value text-primary">127</div>
                <div className="stat-desc">21% more than last month</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg shadow">
                <div className="stat-figure text-secondary">
                  <FaPaperclip className="w-8 h-8" />
                </div>
                <div className="stat-title">Attachments</div>
                <div className="stat-value text-secondary">43</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg shadow">
                <div className="stat-figure text-accent">
                  <FaUser className="w-8 h-8" />
                </div>
                <div className="stat-title">Connected Accounts</div>
                <div className="stat-value text-accent">3</div>
                <div className="stat-desc">↘︎ 90 (14%)</div>
              </div>
            </div>

            {/* Email List */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Recent Emails</h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th></th>
                        <th>From</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Attachments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>1</th>
                        <td>john@example.com</td>
                        <td>Project Update</td>
                        <td>2025-08-29</td>
                        <td>
                          <div className="badge badge-primary">
                            <FaPaperclip className="mr-1" />
                            2
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>2</th>
                        <td>sarah@company.com</td>
                        <td>Meeting Notes</td>
                        <td>2025-08-28</td>
                        <td>
                          <div className="badge badge-secondary">
                            <FaPaperclip className="mr-1" />
                            1
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>3</th>
                        <td>team@workspace.com</td>
                        <td>Weekly Report</td>
                        <td>2025-08-27</td>
                        <td>
                          <div className="badge badge-accent">
                            <FaPaperclip className="mr-1" />
                            5
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attachments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Attachment Management</h1>
              <button className="btn btn-secondary">
                <FaPaperclip className="mr-2" />
                Upload File
              </button>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Recent Attachments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="card bg-base-100 shadow-md">
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <FaPaperclip className="text-2xl text-primary" />
                          <div className="badge badge-outline">PDF</div>
                        </div>
                        <h3 className="font-semibold">Document_{item}.pdf</h3>
                        <p className="text-sm opacity-70">2.4 MB</p>
                        <div className="card-actions justify-end mt-2">
                          <button className="btn btn-sm btn-outline">Download</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast/Alert Example */}
      <div className="toast toast-top toast-end">
        <div className="alert alert-info">
          <span>Welcome to Nylas Attachment Manager!</span>
        </div>
      </div>
    </div>
  );
}

export default App;
