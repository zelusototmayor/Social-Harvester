import React from 'react';

export enum Platform {
  Instagram = 'Instagram',
  TikTok = 'TikTok'
}

export interface WaitlistForm {
  email: string;
  platform: Platform;
}

// Retaining this interface if needed for other services, 
// but it is no longer used in the main view.
export interface GeneratedInteraction {
  comment: string;
  username: string;
  reply: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}