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
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  gender: 0 | 1 | 2;
  date_of_birth: string | null;
  address: string | null;
}
