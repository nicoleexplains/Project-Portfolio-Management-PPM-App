
import React, { useState, useMemo } from 'react';
import { Resource, Task } from '../types';
import Card from './common/Card';
import Icon from './common/Icon';

interface ResourceLevelingProps {
  resources: Resource[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  totalWeeks: number;
}

interface Allocation {
  [week: number]: {
    totalHours: number;
    tasks: Task[];
  }
}

interface AllocationMatrix {
  [resourceId: string]: Allocation;
}

interface Suggestion {
  type: 'DELAY' | 'REASSIGN';
  taskId: string;
  taskName: string;
  message: string;
  action: () => void;
}

const ResourceLeveling: React.FC<ResourceLevelingProps> = ({ resources, tasks, setTasks, totalWeeks }) => {
  const [selectedCell, setSelectedCell] = useState<{ resourceId: string; week: number } | null>(null);

  const allocationMatrix: AllocationMatrix = useMemo(() => {
    const matrix: AllocationMatrix = {};
    resources.forEach(res => matrix[res.id] = {});
    
    tasks.forEach(task => {
      if (task.resourceId) {
        const hoursPerWeek = task.estimatedHours / task.duration;
        for (let i = 0; i < task.duration; i++) {
          const week = task.startWeek + i;
          if (!matrix[task.resourceId][week]) {
            matrix[task.resourceId][week] = { totalHours: 0, tasks: [] };
          }
          matrix[task.resourceId][week].totalHours += hoursPerWeek;
          matrix[task.resourceId][week].tasks.push(task);
        }
      }
    });
    return matrix;
  }, [resources, tasks]);

  const suggestions: Suggestion[] = useMemo(() => {
    if (!selectedCell) return [];
    
    const { resourceId, week } = selectedCell;
    const cellData = allocationMatrix[resourceId]?.[week];
    const resource = resources.find(r => r.id === resourceId);

    if (!cellData || !resource || cellData.totalHours <= resource.capacity) return [];

    const suggs: Suggestion[] = [];
    const tasksInCell = cellData.tasks;
    
    // Suggest delaying tasks
    tasksInCell.forEach(task => {
        suggs.push({
            type: 'DELAY',
            taskId: task.id,
            taskName: task.name,
            message: `Delay "${task.name}" by 1 week.`,
            action: () => {
                setTasks(currentTasks => currentTasks.map(t => t.id === task.id ? {...t, startWeek: t.startWeek + 1} : t));
                setSelectedCell(null);
            }
        });
    });

    // Suggest reassigning to under-allocated resources
    const underAllocatedResources = resources.filter(r => {
        if (r.id === resourceId) return false;
        const targetWeekAllocation = allocationMatrix[r.id]?.[week]?.totalHours || 0;
        return targetWeekAllocation < r.capacity;
    });

    tasksInCell.forEach(task => {
        underAllocatedResources.forEach(res => {
            const hoursPerWeek = task.estimatedHours / task.duration;
            const resUsage = allocationMatrix[res.id]?.[week]?.totalHours || 0;
            if(resUsage + hoursPerWeek <= res.capacity) {
                 suggs.push({
                    type: 'REASSIGN',
                    taskId: task.id,
                    taskName: task.name,
                    message: `Reassign "${task.name}" to ${res.name}.`,
                    action: () => {
                        setTasks(currentTasks => currentTasks.map(t => t.id === task.id ? {...t, resourceId: res.id} : t));
                        setSelectedCell(null);
                    }
                });
            }
        })
    });

    return suggs.slice(0, 5); // Limit suggestions

  }, [selectedCell, allocationMatrix, resources, setTasks]);


  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="p-4 md:p-8">
    <Card className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-amber-400 flex items-center">
            <Icon name="users" className="mr-2" /> Resource Leveling
        </h2>
        <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-green-500/30 mr-2"></div> Under-utilized</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-slate-700 mr-2"></div> Optimal</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-red-500/70 mr-2"></div> Over-allocated</div>
        </div>
      </div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="p-2 text-left font-semibold text-slate-300">Resource</th>
            {weeks.map(w => <th key={w} className="p-2 w-20 text-center font-semibold text-slate-400">W{w}</th>)}
          </tr>
        </thead>
        <tbody>
          {resources.map(res => {
            const resAlloc = allocationMatrix[res.id];
            return (
              <tr key={res.id} className="border-b border-slate-700 hover:bg-slate-850">
                <td className="p-2 font-bold whitespace-nowrap">{res.name} <span className="text-xs text-slate-400">({res.capacity}h)</span></td>
                {weeks.map(w => {
                  const hours = resAlloc?.[w]?.totalHours || 0;
                  const isOver = hours > res.capacity;
                  const isUnder = hours > 0 && hours < res.capacity * 0.75;
                  
                  let bgColor = 'bg-slate-700'; // Optimal
                  if(isOver) bgColor = 'bg-red-500/70';
                  else if (isUnder) bgColor = 'bg-green-500/30';
                  else if (hours === 0) bgColor = 'bg-transparent';
                  
                  const isSelected = selectedCell?.resourceId === res.id && selectedCell?.week === w;

                  return (
                    <td key={w} className="p-0 text-center">
                      <div 
                        onClick={() => setSelectedCell({resourceId: res.id, week: w})}
                        className={`m-1 p-2 rounded-md cursor-pointer transition-all ${bgColor} ${isSelected ? 'ring-2 ring-amber-400' : ''} ${isOver ? 'hover:ring-2 hover:ring-red-400' : 'hover:ring-2 hover:ring-slate-500'}`}
                        >
                        {Math.round(hours)}h
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
        {suggestions.length > 0 && selectedCell && (
            <div className="mt-6 p-4 bg-slate-850 rounded-lg">
                <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center"><Icon name="lightbulb" className="mr-2"/> Suggestions for {resources.find(r=>r.id === selectedCell.resourceId)?.name} in Week {selectedCell.week}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {suggestions.map((sugg, i) => (
                        <div key={i} className="bg-slate-700 p-3 rounded-md flex justify-between items-center">
                            <p className="text-sm">{sugg.message}</p>
                            <button onClick={sugg.action} className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold py-1 px-2 rounded ml-2">
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </Card>
    </div>
  );
};

export default ResourceLeveling;
