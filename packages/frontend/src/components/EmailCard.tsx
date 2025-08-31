import { FaPaperclip } from "react-icons/fa";
function EmailCard ({ emails }) {
  return emails.map((email) => {
    return (
      <div key={email.id} className="card bg-base-200 shadow-sm">
        <div>
          To: {email.to?.map(recipient => recipient.email).join(', ')}
        </div>
        <div>
          <h3 className="font-semibold">{email.subject}</h3>
          <p className="text-sm mt-1">{email.snippet}</p>
        </div>
        {email.attachments && email.attachments.length > 0 && (
          <div className="flex items-center">
            <FaPaperclip className="mr-1" />
            <span>{email.attachments.length}</span>
          </div>
        )}
      </div>
    );
  })
}

export default EmailCard;
