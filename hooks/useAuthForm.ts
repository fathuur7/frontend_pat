import { useState } from "react";
import { useRouter } from "next/navigation";

export type AuthActionType = 'login' | 'register';

export function useAuthForm(actionType: AuthActionType) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Request States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = actionType === 'login' ? '/api/auth/login' : '/api/auth/register';
      const bodyData = actionType === 'login' 
        ? { email, password }
        : { name, email, password };

      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please try again.');
      }

      // Success! Save token and redirect
      if (data.data?.token) {
        localStorage.setItem('nadasaku_token', data.data.token);
      }
      
      // Redirect to homepage
      router.push('/');
      
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // UI State
    showPassword,
    togglePasswordVisibility,
    isLoading,
    error,
    
    // Form Data
    name, setName,
    email, setEmail,
    password, setPassword,
    
    // Actions
    handleFormSubmit,
  };
}

