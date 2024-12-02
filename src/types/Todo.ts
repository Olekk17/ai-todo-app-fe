export interface Todo {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: 'created' | 'inProgress' | 'completed';
  createdAt: Date;
  inProgressAt?: Date;
  completedAt?: Date;
  estimatedTime: number;
}
