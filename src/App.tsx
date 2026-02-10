import { useState } from 'react';
import type { ViewTab } from './types';
import { usePlanner } from './hooks/usePlanner';
import { Setup } from './pages/Setup';
import { Today } from './pages/Today';
import { Upcoming } from './pages/Upcoming';
import { Stats } from './pages/Stats';

export default function App() {
  const [tab, setTab] = useState<ViewTab>('today');
  const planner = usePlanner();

  return (
    <div className="app-shell">
      {/* Background shapes for glass effect to blur against */}
      <div className="bg-shape bg-shape-1" />
      <div className="bg-shape bg-shape-2" />
      <div className="bg-shape bg-shape-3" />

      {/* Main content */}
      <main className="app-content">
        <div className="content-container">
          {/* Tab bar */}
          <div className="glass-tabs mb-6">
            <button
              className={`glass-tab ${tab === 'today' ? 'active' : ''}`}
              onClick={() => setTab('today')}
            >
              Today
            </button>
            <button
              className={`glass-tab ${tab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`glass-tab ${tab === 'stats' ? 'active' : ''}`}
              onClick={() => setTab('stats')}
            >
              Stats
            </button>
            <button
              className={`glass-tab ${tab === 'setup' ? 'active' : ''}`}
              onClick={() => setTab('setup')}
            >
              Setup
            </button>
          </div>

          {/* Page content */}
          <div className="page-content">
            {tab === 'today' && (
              <Today
                plan={planner.todayPlan}
                config={{
                  ...planner.config,
                  reviews: planner.config.reviews || [],
                  studySessions: planner.config.studySessions || [],
                }}
                onToggle={planner.toggleComplete}
                onSkip={planner.skipDay}
                onReviewToggle={planner.toggleReviewComplete}
                onSessionComplete={planner.addStudySession}
              />
            )}
            {tab === 'upcoming' && (
              <Upcoming
                plans={planner.upcomingPlans}
                onToggle={planner.toggleComplete}
                onSessionComplete={planner.addStudySession}
              />
            )}
            {tab === 'stats' && (
              <Stats
                sessions={planner.config.studySessions || []}
                subjects={planner.config.subjects || []}
              />
            )}
            {tab === 'setup' && (
              <Setup
                config={planner.config}
                onSetExamDate={planner.setExamDate}
                onSetDailyHours={planner.setDailyHours}
                onAddSubject={planner.addSubject}
                onUpdateSubject={planner.updateSubject}
                onRemoveSubject={planner.removeSubject}
                onAddTopic={planner.addTopic}
                onUpdateTopic={planner.updateTopic}
                onRemoveTopic={planner.removeTopic}
                onReset={planner.resetAll}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
