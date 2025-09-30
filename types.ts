
export interface BusinessDriver {
  id: string;
  name: string;
  weight: number; // 1-10
}

export interface ProjectScore {
  driverId: string;
  score: number; // 1-10
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  estimatedHours: number;
  resourceId: string | null;
  startWeek: number; // week number from start
  duration: number; // in weeks
}

export interface Project {
  id: string;
  name: string;
  description: string;
  budget: number;
  scores: ProjectScore[];
  risk: number; // 1-10, lower is better
  startWeek: number;
  duration: number; // total duration in weeks
}

export interface Resource {
  id: string;
  name: string;
  capacity: number; // hours per week
}
