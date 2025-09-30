
import { BusinessDriver, Project, Resource, Task } from './types';

export const INITIAL_DRIVERS: BusinessDriver[] = [
  { id: 'd1', name: 'Increase ROI', weight: 8 },
  { id: 'd2', name: 'Market Impact', weight: 7 },
  { id: 'd3', name: 'Reduce Operational Risk', weight: 5 },
  { id: 'd4', name: 'Improve Customer Satisfaction', weight: 6 },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'QuantumLeap CRM',
    description: 'Next-gen customer relationship management platform.',
    budget: 500000,
    risk: 4,
    startWeek: 1,
    duration: 12,
    scores: [
      { driverId: 'd1', score: 9 },
      { driverId: 'd2', score: 8 },
      { driverId: 'd3', score: 3 },
      { driverId: 'd4', score: 7 },
    ],
  },
  {
    id: 'p2',
    name: 'Project Nebula',
    description: 'Cloud infrastructure migration and optimization.',
    budget: 750000,
    risk: 7,
    startWeek: 3,
    duration: 16,
    scores: [
      { driverId: 'd1', score: 7 },
      { driverId: 'd2', score: 5 },
      { driverId: 'd3', score: 9 },
      { driverId: 'd4', score: 4 },
    ],
  },
  {
    id: 'p3',
    name: 'Orion Analytics',
    description: 'Data analytics platform for sales forecasting.',
    budget: 300000,
    risk: 3,
    startWeek: 1,
    duration: 8,
    scores: [
      { driverId: 'd1', score: 8 },
      { driverId: 'd2', score: 7 },
      { driverId: 'd3', score: 5 },
      { driverId: 'd4', score: 6 },
    ],
  },
   {
    id: 'p4',
    name: 'Helios Mobile App',
    description: 'A new consumer-facing mobile application.',
    budget: 400000,
    risk: 6,
    startWeek: 6,
    duration: 10,
    scores: [
      { driverId: 'd1', score: 6 },
      { driverId: 'd2', score: 9 },
      { driverId: 'd3', score: 2 },
      { driverId: 'd4', score: 8 },
    ],
  },
];

export const INITIAL_RESOURCES: Resource[] = [
    { id: 'r1', name: 'Alice', capacity: 40 },
    { id: 'r2', name: 'Bob', capacity: 40 },
    { id: 'r3', name: 'Charlie', capacity: 30 },
    { id: 'r4', name: 'Diana', capacity: 40 },
];

export const INITIAL_TASKS: Task[] = [
    // QuantumLeap CRM
    { id: 't1', projectId: 'p1', name: 'UI/UX Design', resourceId: 'r1', startWeek: 1, duration: 4, estimatedHours: 160 },
    { id: 't2', projectId: 'p1', name: 'API Development', resourceId: 'r2', startWeek: 2, duration: 6, estimatedHours: 240 },
    { id: 't3', projectId: 'p1', name: 'Frontend Dev', resourceId: 'r1', startWeek: 5, duration: 8, estimatedHours: 320 },
    { id: 't4', projectId: 'p1', name: 'QA Testing', resourceId: 'r3', startWeek: 10, duration: 3, estimatedHours: 90 },

    // Project Nebula
    { id: 't5', projectId: 'p2', name: 'Infra Audit', resourceId: 'r4', startWeek: 3, duration: 4, estimatedHours: 160 },
    { id: 't6', projectId: 'p2', name: 'Migration Plan', resourceId: 'r2', startWeek: 5, duration: 2, estimatedHours: 80 },
    { id: 't7', projectId: 'p2', name: 'Execution Phase 1', resourceId: 'r2', startWeek: 7, duration: 8, estimatedHours: 320 },
    { id: 't8', projectId: 'p2', name: 'Execution Phase 2', resourceId: 'r4', startWeek: 9, duration: 8, estimatedHours: 320 },
    
    // Orion Analytics
    { id: 't9', projectId: 'p3', name: 'Data Modeling', resourceId: 'r3', startWeek: 1, duration: 4, estimatedHours: 120 },
    { id: 't10', projectId: 'p3', name: 'Dashboard Dev', resourceId: 'r1', startWeek: 3, duration: 6, estimatedHours: 240 },

    // Helios Mobile App
    { id: 't11', projectId: 'p4', name: 'Prototyping', resourceId: 'r3', startWeek: 6, duration: 4, estimatedHours: 120 },
    { id: 't12', projectId: 'p4', name: 'Backend Services', resourceId: 'r2', startWeek: 8, duration: 8, estimatedHours: 320 },
];
