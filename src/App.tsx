import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePlanner } from './hooks/usePlanner';
import { Setup } from './pages/Setup';
import { Today } from './pages/Today';
import { Upcoming } from './pages/Upcoming';
import { Stats } from './pages/Stats';
import { Toast } from './components/Toast';
import { SkeletonList } from './components/Skeleton';

function Layout() {
  return (
    <div className="app-shell">
      <div className="bg-shape bg-shape-1" />
      <div className="bg-shape bg-shape-2" />
      <div className="bg-shape bg-shape-3" />
      <main className="app-content">
        <div className="content-container">
          <nav className="glass-tabs mb-6" role="navigation" aria-label="Main navigation">
            <NavLink
              to="/"
              className={({ isActive }) => `glass-tab ${isActive ? 'active' : ''}`}
              end
            >
              Today
            </NavLink>
            <NavLink
              to="/upcoming"
              className={({ isActive }) => `glass-tab ${isActive ? 'active' : ''}`}
            >
              Upcoming
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) => `glass-tab ${isActive ? 'active' : ''}`}
            >
              Stats
            </NavLink>
            <NavLink
              to="/setup"
              className={({ isActive }) => `glass-tab ${isActive ? 'active' : ''}`}
            >
              Setup
            </NavLink>
          </nav>
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  const planner = usePlanner();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="app-shell">
        <div className="bg-shape bg-shape-1" />
        <div className="bg-shape bg-shape-2" />
        <div className="bg-shape bg-shape-3" />
        <main className="app-content">
          <div className="content-container">
            <div className="glass-tabs mb-6" style={{ opacity: 0.5 }}>
              <div className="glass-tab" style={{ width: '25%', height: 40 }} />
            </div>
            <SkeletonList count={4} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
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
          } />
          <Route path="upcoming" element={
            <Upcoming
              plans={planner.upcomingPlans}
              onToggle={planner.toggleComplete}
              onSessionComplete={planner.addStudySession}
            />
          } />
          <Route path="stats" element={
            <Stats
              sessions={planner.config.studySessions || []}
              subjects={planner.config.subjects || []}
            />
          } />
          <Route path="setup" element={
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
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
