import React, { useState, useEffect } from 'react';
import { BusinessDriver, Project, Resource, Task } from './types';
import { INITIAL_DRIVERS, INITIAL_PROJECTS, INITIAL_RESOURCES, INITIAL_TASKS } from './constants';
import StrategicAlignment from './components/StrategicAlignment';
import ScenarioModeling from './components/ScenarioModeling';
import ResourceLeveling from './components/ResourceLeveling';
import Icon from './components/common/Icon';

type View = 'alignment' | 'scenario' | 'leveling';

const App: React.FC = () => {
    const [view, setView] = useState<View>('alignment');
    const [drivers, setDrivers] = useState<BusinessDriver[]>(INITIAL_DRIVERS);
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    const totalWeeks = Math.max(...projects.map(p => p.startWeek + p.duration), ...tasks.map(t => t.startWeek + t.duration));

    const handleExportCSV = () => {
        const calculateAlignmentScore = (project: Project) => {
            const totalWeight = drivers.reduce((sum, driver) => sum + driver.weight, 0);
            if (totalWeight === 0) return 0;

            const weightedScore = project.scores.reduce((sum, score) => {
                const driver = drivers.find(d => d.id === score.driverId);
                return sum + (score.score * (driver?.weight || 0));
            }, 0);

            return (weightedScore / totalWeight);
        };

        const arrayToCsv = (data: any[], headers: string[]) => {
            const csvRows = [headers.join(',')];
            data.forEach(item => {
                const values = headers.map(header => {
                    let value = item[header] === null || item[header] === undefined ? '' : item[header];
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        value = `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                });
                csvRows.push(values.join(','));
            });
            return csvRows.join('\n');
        };

        const projectsWithScores = projects.map(p => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { scores, ...rest } = p;
            return {
                ...rest,
                alignmentScore: calculateAlignmentScore(p).toFixed(2),
            };
        });
        
        const driversCsv = arrayToCsv(drivers, ['id', 'name', 'weight']);
        const projectsCsv = arrayToCsv(projectsWithScores, ['id', 'name', 'description', 'budget', 'risk', 'startWeek', 'duration', 'alignmentScore']);
        const resourcesCsv = arrayToCsv(resources, ['id', 'name', 'capacity']);
        const tasksCsv = arrayToCsv(tasks, ['id', 'projectId', 'name', 'estimatedHours', 'resourceId', 'startWeek', 'duration']);

        const csvContent = [
            'DRIVERS',
            driversCsv,
            '',
            'PROJECTS',
            projectsCsv,
            '',
            'RESOURCES',
            resourcesCsv,
            '',
            'TASKS',
            tasksCsv
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.download = 'portfolio_export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const renderView = () => {
        switch (view) {
            case 'alignment':
                return <StrategicAlignment drivers={drivers} setDrivers={setDrivers} projects={projects} />;
            case 'scenario':
                return <ScenarioModeling projects={projects} />;
            case 'leveling':
                return <ResourceLeveling resources={resources} tasks={tasks} setTasks={setTasks} totalWeeks={totalWeeks} />;
            default:
                return null;
        }
    };
    
    const NavButton: React.FC<{targetView: View, icon: string, label: string}> = ({targetView, icon, label}) => (
        <button
            onClick={() => setView(targetView)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === targetView
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
        >
            <Icon name={icon} className="mr-2 w-5 h-5" />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
            <header className="bg-slate-850/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                           <div className="flex-shrink-0 text-sky-400">
                                <Icon name="briefcase" className="h-8 w-8" />
                           </div>
                           <h1 className="text-xl font-bold ml-3">Project Portfolio Management</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <nav className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
                               <NavButton targetView="alignment" icon="target" label="Alignment" />
                               <NavButton targetView="scenario" icon="workflow" label="Scenarios" />
                               <NavButton targetView="leveling" icon="users" label="Resources" />
                            </nav>
                             <button
                                onClick={handleExportCSV}
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                                title="Export to CSV"
                            >
                                <Icon name="download" className="mr-2 w-5 h-5" />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                {renderView()}
            </main>
        </div>
    );
};

export default App;