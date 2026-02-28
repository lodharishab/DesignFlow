export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  roles: string[];
  avatarUrl: string;
  avatarHint: string;
  joinDate: Date;
  lastLogin: Date | null;
  status: 'Active' | 'Suspended';
}

export const initialUsersData: User[] = [
  { id: 'usr001', name: 'Priya Sharma', email: 'priya.sharma@example.in', mobileNumber: '9820098200', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman client', joinDate: new Date(2023, 0, 15), lastLogin: new Date(2024, 5, 1), status: 'Active' },
  { id: 'des002', name: 'Rohan Kapoor', email: 'rohan.designer@example.in', mobileNumber: '9987654321', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man designer', joinDate: new Date(2022, 11, 5), lastLogin: new Date(2024, 5, 3), status: 'Active' },
  { id: 'usr003', name: 'Aarav Patel', email: 'aarav.patel@example.in', mobileNumber: '9765432109', roles: ['Client', 'Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian person avatar', joinDate: new Date(2023, 2, 20), lastLogin: new Date(2024, 4, 28), status: 'Suspended' },
  { id: 'staff001', name: 'Aditi Singh', email: 'aditi.admin@example.in', mobileNumber: '9654321098', roles: ['Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman admin', joinDate: new Date(2022, 5, 10), lastLogin: new Date(2024, 5, 4), status: 'Active' },
  { id: 'usr005', name: 'Vikram Kumar', email: 'vikram.guest@example.in', mobileNumber: '9500195001', roles: ['Guest'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man silhouette', joinDate: new Date(2024, 0, 1), lastLogin: null, status: 'Active' },
  { id: 'usr006', name: 'Sneha Reddy', email: 'sneha.client@example.in', mobileNumber: '9123456789', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman professional', joinDate: new Date(2023, 4, 12), lastLogin: new Date(2024, 5, 2), status: 'Active' },
  { id: 'des007', name: 'Arjun Desai', email: 'arjun.creator@example.in', mobileNumber: '9234567890', roles: ['Designer'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man creative', joinDate: new Date(2023, 7, 22), lastLogin: new Date(2024, 4, 30), status: 'Active' },
  { id: 'usr008', name: 'Meera Iyer', email: 'meera.iyer@example.in', mobileNumber: '9345678901', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman customer', joinDate: new Date(2024, 1, 5), lastLogin: new Date(2024, 5, 5), status: 'Active' },
  { id: 'des009', name: 'Karan Malhotra', email: 'karan.m@example.in', mobileNumber: '9456789012', roles: ['Designer', 'Admin'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian man business', joinDate: new Date(2022, 8, 1), lastLogin: new Date(2024, 5, 4), status: 'Suspended' },
  { id: 'usr010', name: 'Deepika Rao', email: 'deepika.rao@example.in', mobileNumber: '9567890123', roles: ['Client'], avatarUrl: 'https://placehold.co/40x40.png', avatarHint: 'indian woman corporate', joinDate: new Date(2023, 10, 30), lastLogin: new Date(2024, 5, 1), status: 'Active' },
];
