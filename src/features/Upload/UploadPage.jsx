import React, { useState } from 'react';
import { createPost } from '../../core/services/postService';

const CONTENT_TYPES = [
  { value: '', label: 'Select content type' },
  { value: 'post', label: 'Post' },
  { value: 'story', label: 'Story' },
];

const UploadPage = () => {
  const [contentType, setContentType] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage('');
    try {
      // For MVP: do NOT upload file, only send text data
      await createPost({ contentType, caption /*, file (add later) */ });
      setMessage('Submitted! Pending admin approval.');
      setCaption('');
      setContentType('');
      setFile(null);
    } catch (err) {
      setError(err.message || 'Failed to submit content');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-page">
      <h2>Share Your Story</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Content Type</label>
          <select value={contentType} onChange={e => setContentType(e.target.value)} required>
            {CONTENT_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Caption</label>
          <textarea
            maxLength={500} rows={4}
            placeholder="Share your thoughts, experiences, or important updates..."
            value={caption}
            onChange={e => setCaption(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image or Video (optional)</label>
          <input type="file" accept="image/*,video/*" disabled /* Add handling later */ />
        </div>
        <button type="submit" disabled={submitting}>Submit for Approval</button>
      </form>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="pending-info">
        <strong>Pending Admin Approval</strong>
        <p>All content is reviewed by admins before being visible to the community. This helps maintain quality and community guidelines.</p>
      </div>
    </div>
  );
};

export default UploadPage;
