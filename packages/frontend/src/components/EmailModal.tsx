import { useState, useRef } from 'react';

import { FaEnvelope, FaPaperclip, FaTimes, FaTrash } from 'react-icons/fa';

interface EmailForm {
  subject: string;
  body: string;
}

interface EmailFormProps {
  setIsModalOpen: (value: boolean) => void;
}

function EmailModal({ setIsModalOpen }: EmailFormProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleAttachment = () => {
    fileInput.current?.click();
  }

  const [emailForm, setEmailForm] = useState<EmailForm>({
    subject: '',
    body: ''
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmailForm({ subject: '', body: '' });
    setAttachments([]);
};

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>{
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64)
      };
      reader.onerror = error => reject(error);
    })
  }

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      setAttachments((prev) => {
        const existingNames = prev.map(file => file.name);
        const uniqueNewFiles = newFiles.filter(file => !existingNames.includes(file.name));
        return [...prev, ...uniqueNewFiles];
      });
    }
    
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllAttachments = () => {
    setAttachments([]);
  };

  const handleInputChange = (field: keyof EmailForm, value: string) => {
      setEmailForm(prev => ({
        ...prev,
        [field]: value
      }));
    };
  
  const handleSendEmail = async () => {
    try {

      let attachmentDataArray: any[] = [];

      if (attachments.length > 0) {
        attachmentDataArray = await Promise.all(
          attachments.map(async (file) => {
            const base64Content = await fileToBase64(file);
            return {
              filename: file.name,
              content: base64Content,
              contentType: file.type || 'application/octet-stream',
              size: file.size,
            };
          })
        );
      }

      console.log('Sending email:', emailForm);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestBody: any = {
        subject: emailForm.subject,
        body: emailForm.body
      };

      if (attachmentDataArray.length > 0) {
        requestBody.attachments = attachmentDataArray;
      }

      const response = await fetch('api/nylas/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      const result = await response.json();
      console.log('Email sent ===', result);
      // Close modal and reset form
      setIsModalOpen(false);
      setEmailForm({ subject: '', body: '' });      
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  return (
    <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Compose Email</h3>

              <div>
                <input
                  type='file'
                  onChange={handleFileChange}
                  ref={fileInput}
                  style={{ display: 'none' }}
                />
                <button className="btn btn-outline" onClick={() => handleAttachment()}>
                  <FaPaperclip />
                </button>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={handleCloseModal}
              >
                <FaTimes />
              </button>
              </div>

            </div>

            <div className="space-y-4">
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

          {attachments.length > 0 && (
            <div className="form-control">
              <div className="flex justify-between items-center mb-2">
                <button 
                  className="btn btn-xs btn-ghost" 
                  onClick={clearAllAttachments}
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto rounded p-2 bg-base-200">
                <div className="space-x-2 text-sm font-bold">
                  Attachments:
                </div>
                {attachments?.map((file, index) => (
                  <div key={index} className="flex justify-between items-center bg-base-100 p-2 rounded">
                    <div className="flex items-center space-x-2 flex-1">
                      <FaPaperclip className="text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <div 
                          className="text-sm font-medium truncate cursor-pointer hover:text-primary"
                          title={file.name}
                          onClick={() => {
                            window.open(URL.createObjectURL(file), '_blank');
                          }}
                        >
                          {file.name}
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-xs btn-ghost text-error" 
                      onClick={() => removeAttachment(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

              <div className="form-control flex flex-col">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32 resize-none w-[100%]"
                  placeholder="Enter your message here..."
                  value={emailForm.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-primary"
                onClick={handleSendEmail}
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
