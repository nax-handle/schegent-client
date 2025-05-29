export interface HomeProps {
  events: {
    date: number;
    time: string;
    title: string;
    startHour: number;
    duration: number;
  }[];
}

export interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  isActive: string | true;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}
