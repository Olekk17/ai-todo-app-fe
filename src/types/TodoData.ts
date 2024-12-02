export interface TodoData {
  title: string;
  userId?: number;
  id?: number;
  description: string;
  status: 'created' | 'inProgress' | 'completed';
  inProgressAt?: Date;
  completedAt?: Date;
  estimatedTime: number;
}
