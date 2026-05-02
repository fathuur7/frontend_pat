"use client";

import React from "react";
import { useAuthForm } from "@/hooks/useAuthForm";
import RegisterView from "./RegisterView";

export default function RegisterPage() {
  // Logic
  const { 
    showPassword, 
    togglePasswordVisibility, 
    isLoading,
    error,
    name, setName,
    email, setEmail,
    password, setPassword,
    handleFormSubmit 
  } = useAuthForm('register');

  // Rendering purely delegates to View
  return (
    <RegisterView
      showPassword={showPassword}
      onTogglePassword={togglePasswordVisibility}
      isLoading={isLoading}
      error={error}
      name={name} setName={setName}
      email={email} setEmail={setEmail}
      password={password} setPassword={setPassword}
      onSubmit={handleFormSubmit}
    />
  );
}
