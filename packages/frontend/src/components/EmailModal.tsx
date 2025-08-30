import { useState } from 'react';

import { FaEnvelope, FaPaperclip, FaUser, FaCog, FaMoon, FaSun, FaTimes } from 'react-icons/fa';

interface EmailForm {
  subject: string;
  body: string;
}

interface EmailFormProps {
  setIsModalOpen: (value: boolean) => void;
}


function EmailModal({ setIsModalOpen }: EmailFormProps) {
    const [emailForm, setEmailForm] = useState<EmailForm>({
    subject: '',
    body: ''
  });

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setEmailForm({ subject: '', body: '' });
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
        setEmailForm({ subject: '', body: '' });
        
        // Show success message (you can use a toast library or alert)
        alert('Email sent successfully!');
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email');
      }
    };

  return (
    <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Compose Email</h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={handleCloseModal}
              >
                <FaTimes />
              </button>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
              {/* To Field */}

              {/* Subject Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter email subject"
                  className="input input-bordered w-full"
                  value={emailForm.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                />
              </div>

              {/* Attachment Section (for future use) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Attachments</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    multiple
                  />
                  <button className="btn btn-outline">
                    <FaPaperclip />
                  </button>
                </div>
              </div>

              {/* Body Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder="Enter your message here..."
                  value={emailForm.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                ></textarea>
              </div>


            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSendEmail}
                // disabled={!emailForm.to || !emailForm.subject || !emailForm.body}
              >
                <FaEnvelope className="mr-2" />
                Send Email
              </button>
            </div>
          </div>
        </div>
  )
};

export default EmailModal;
