export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
}

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  owner: User;
  uploadedAt: Date;
  description?: string;
  tags?: string[];
}

export interface Post {
  id: string;
  author: User;
  text: string;
  photos?: Photo[];
  createdAt: Date;
}