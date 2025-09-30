
import React, { useState, useMemo } from 'react';
import { BusinessDriver, Project } from '../types';
import Card from './common/Card';
import Icon from './common/Icon';

interface StrategicAlignmentProps {
  drivers: BusinessDriver[];
  setDrivers: React.Dispatch<React.SetStateAction<BusinessDriver[]>>;
  projects: Project[];
}

const StrategicAlignment: React.FC<StrategicAlignmentProps> = ({ drivers, setDrivers, projects }) => {
  const handleWeightChange = (id: string, weight: number) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, weight } : d));
  };

  const calculateAlignmentScore = (project: Project) => {
    const totalWeight = drivers.reduce((sum, driver) => sum + driver.weight, 0);
    if (totalWeight === 0) return 0;

    const weightedScore = project.scores.reduce((sum, score) => {
      const driver = drivers.find(d => d.id === score.driverId);
      return sum + (score.score * (driver?.weight || 0));
    }, 0);

    return (weightedScore / totalWeight);
  };

  const sortedProjects = useMemo(() => {
    return [...projects]
      .map(p => ({ ...p, alignmentScore: calculateAlignmentScore(p) }))
      .sort((a, b) => b.alignmentScore - a.alignmentScore);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, drivers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      <div className="lg:col-span-1">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-sky-400 flex items-center">
            <Icon name="sliders-horizontal" className="mr-2" /> Business Drivers
          </h2>
          <div className="space-y-4">
            {drivers.map(driver => (
              <div key={driver.id} className="bg-slate-700 p-4 rounded-md">
                <label htmlFor={`driver-${driver.id}`} className="block font-semibold mb-2">{driver.name}</label>
                <div className="flex items-center space-x-4">
                  <input
                    id={`driver-${driver.id}`}
                    type="range"
                    min="0"
                    max="10"
                    value={driver.weight}
                    onChange={(e) => handleWeightChange(driver.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <span className="text-sky-400 font-bold w-8 text-center">{driver.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-sky-400 flex items-center">
            <Icon name="target" className="mr-2" /> Project Prioritization
          </h2>
          <div className="space-y-4">
            {sortedProjects.map((project, index) => (
              <div key={project.id} className="bg-slate-850 p-4 rounded-lg border-l-4 border-slate-700 hover:border-sky-500 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 flex items-center">
                       <span className="text-slate-500 mr-3 text-xl font-mono">#{index + 1}</span> {project.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{project.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-sm text-slate-400">Alignment Score</div>
                    <div className="text-3xl font-bold text-sky-400">
                      {project.alignmentScore.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StrategicAlignment;
