
import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Achievement {
  title: string;
  impact: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}