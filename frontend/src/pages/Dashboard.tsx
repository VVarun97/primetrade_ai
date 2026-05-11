import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, Trash2, CheckCircle, Circle, LogOut, Layout, User as UserIcon } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user?: { email: string };
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setLoading(true);
    try {
      await api.post('/tasks', { title: newTitle, description: newDesc });
      setNewTitle('');
      setNewDesc('');
      fetchTasks();
    } catch (err) {
      console.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await api.put(`/tasks/${task.id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task');
    }
  };

  return (
    <div className="dashboard">
      <nav className="nav glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Layout color="#6366f1" />
          <h2 style={{ fontSize: '1.25rem' }}>TaskFlow</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <UserIcon size={18} />
            <span style={{ fontSize: '0.875rem' }}>{user?.email} ({user?.role})</span>
          </div>
          <button onClick={logout} style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <aside>
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} color="#6366f1" />
              New Task
            </h3>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="What needs to be done?" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  placeholder="Extra details..." 
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Create Task'}
              </button>
            </form>
          </div>
        </aside>

        <main>
          <div className="tasks-grid">
            {tasks.length === 0 ? (
              <div className="glass" style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No tasks yet. Start by creating one!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="task-card glass">
                  <div className="task-header">
                    <div>
                      <h4 style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-muted)' : 'inherit' }}>
                        {task.title}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{task.description}</p>
                      {user?.role === 'ADMIN' && task.user && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem' }}>Owner: {task.user.email}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleToggleTask(task)}
                      style={{ width: 'auto', background: 'none', padding: 0 }}
                    >
                      {task.completed ? <CheckCircle color="#10b981" /> : <Circle color="var(--text-muted)" />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span className={`badge ${task.completed ? 'badge-completed' : 'badge-pending'}`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      style={{ width: 'auto', background: 'none', padding: '0.25rem', color: 'var(--danger)' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
