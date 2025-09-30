
import React, { useState, useMemo, useEffect } from 'react';
import { Project } from '../types';
import Card from './common/Card';
import Icon from './common/Icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScenarioModelingProps {
  projects: Project[];
}

interface Scenario extends Project {
    delay: number; // in weeks
    budgetChange: number; // USD
}

const ScenarioModeling: React.FC<ScenarioModelingProps> = ({ projects }) => {
  const [scenarioProjects, setScenarioProjects] = useState<Scenario[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [delay, setDelay] = useState(0);
  const [budgetChange, setBudgetChange] = useState(0);

  useEffect(() => {
    resetScenarios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);
  
  const resetScenarios = () => {
    setScenarioProjects(projects.map(p => ({ ...p, delay: 0, budgetChange: 0 })));
    setSelectedProjectId(projects.length > 0 ? projects[0].id : '');
    setDelay(0);
    setBudgetChange(0);
  };

  useEffect(() => {
    if (selectedProjectId) {
        const selectedScenario = scenarioProjects.find(p => p.id === selectedProjectId);
        if (selectedScenario) {
            setDelay(selectedScenario.delay);
            setBudgetChange(selectedScenario.budgetChange);
        }
    }
  }, [selectedProjectId, scenarioProjects]);


  const handleApplyChange = () => {
    setScenarioProjects(scenarioProjects.map(p => 
      p.id === selectedProjectId ? { ...p, delay, budgetChange } : p
    ));
  };

  const baselineMetrics = useMemo(() => {
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const maxEndDate = Math.max(...projects.map(p => p.startWeek + p.duration));
    const avgRisk = projects.reduce((sum, p) => sum + p.risk, 0) / projects.length;
    return { totalBudget, timeline: maxEndDate, avgRisk };
  }, [projects]);
  
  const scenarioMetrics = useMemo(() => {
    const totalBudget = scenarioProjects.reduce((sum, p) => sum + p.budget + p.budgetChange, 0);
    const maxEndDate = Math.max(...scenarioProjects.map(p => p.startWeek + p.delay + p.duration));
    // Simple risk model: delay increases risk, extra budget decreases it
    const avgRisk = scenarioProjects.reduce((sum, p) => {
        const riskModifier = (p.delay * 0.2) - (p.budgetChange / p.budget * 2);
        return sum + Math.max(1, Math.min(10, p.risk + riskModifier));
    }, 0) / scenarioProjects.length;
    return { totalBudget, timeline: maxEndDate, avgRisk };
  }, [scenarioProjects]);
  
  const chartData = [
    { name: 'Total Budget', Baseline: baselineMetrics.totalBudget, Scenario: scenarioMetrics.totalBudget },
    { name: 'Timeline (Weeks)', Baseline: baselineMetrics.timeline, Scenario: scenarioMetrics.timeline },
    { name: 'Avg. Risk Score', Baseline: baselineMetrics.avgRisk, Scenario: scenarioMetrics.avgRisk },
  ];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      <div className="lg:col-span-1">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
            <Icon name="workflow" className="mr-2" /> Scenario Controls
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="project-select" className="block text-sm font-medium text-slate-300 mb-1">Select Project</label>
              <select
                id="project-select"
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            
            <div>
                <label htmlFor="delay-input" className="block text-sm font-medium text-slate-300 mb-1">Delay Project (weeks)</label>
                <div className="flex items-center space-x-2">
                    <input type="range" min="0" max="26" value={delay} onChange={e => setDelay(parseInt(e.target.value))} className="w-full accent-teal-500"/>
                    <input type="number" value={delay} onChange={e => setDelay(parseInt(e.target.value))} className="w-20 bg-slate-700 border border-slate-600 rounded-md p-2 text-center" />
                </div>
            </div>
            
             <div>
                <label htmlFor="budget-input" className="block text-sm font-medium text-slate-300 mb-1">Adjust Budget ($)</label>
                 <div className="flex items-center space-x-2">
                    <input type="range" min="-100000" max="100000" step="5000" value={budgetChange} onChange={e => setBudgetChange(parseInt(e.target.value))} className="w-full accent-teal-500"/>
                    <input type="number" step="5000" value={budgetChange} onChange={e => setBudgetChange(parseInt(e.target.value))} className="w-20 bg-slate-700 border border-slate-600 rounded-md p-2 text-center" />
                </div>
            </div>

            <div className="flex space-x-2 pt-2">
                <button onClick={handleApplyChange} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                    <Icon name="play" className="mr-2 w-4 h-4" /> Apply Change
                </button>
                 <button onClick={resetScenarios} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                    <Icon name="rotate-cw" className="mr-2 w-4 h-4" /> Reset
                </button>
            </div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-teal-400 flex items-center">
            <Icon name="bar-chart-3" className="mr-2" /> Portfolio Impact
          </h2>
           <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
                            labelStyle={{ color: '#d1d5db' }}
                        />
                        <Legend />
                        <Bar dataKey="Baseline" fill="#64748b" />
                        <Bar dataKey="Scenario" fill="#2dd4bf" />
                    </BarChart>
                </ResponsiveContainer>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioModeling;
