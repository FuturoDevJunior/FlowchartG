import React, { useState } from 'react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { signInWithEmail } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signInWithEmail(email);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        
        {success ? (
          <div className="mb-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>Magic link sent! Check your email to sign in.</p>
            </div>
            <Button onClick={onClose} variant="primary" fullWidth>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email to receive a magic link for signing in.
            </p>
            
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              error={error || undefined}
            />
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={onClose} variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;