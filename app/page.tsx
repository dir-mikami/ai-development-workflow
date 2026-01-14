'use client';

import { useState } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks: SubTask[];
  isExpanded: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const addTask = () => {
    if (newTaskTitle.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'Pending',
      subtasks: [],
      isExpanded: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveTaskEdit = (taskId: string) => {
    if (editingTitle.trim() === '') return;
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: editingTitle } : task
    ));
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingSubtaskId(null);
    setEditingTitle('');
  };

  const toggleTaskExpand = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  const addSubtask = (taskId: string) => {
    const subtaskTitle = prompt('サブタスク名を入力してください:');
    if (!subtaskTitle || subtaskTitle.trim() === '') return;

    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: [
              ...task.subtasks,
              {
                id: Date.now().toString(),
                title: subtaskTitle,
                status: 'Pending',
              },
            ],
          }
        : task
    ));
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId),
          }
        : task
    ));
  };

  const updateSubtaskStatus = (taskId: string, subtaskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId ? { ...subtask, status } : subtask
            ),
          }
        : task
    ));
  };

  const startEditingSubtask = (subtask: SubTask) => {
    setEditingSubtaskId(subtask.id);
    setEditingTitle(subtask.title);
  };

  const saveSubtaskEdit = (taskId: string, subtaskId: string) => {
    if (editingTitle.trim() === '') return;
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId ? { ...subtask, title: editingTitle } : subtask
            ),
          }
        : task
    ));
    setEditingSubtaskId(null);
    setEditingTitle('');
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Running':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Completed':
        return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          TODO管理アプリ
        </h1>

        {/* Add Task Input */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            追加
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              {/* Task Header */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskExpand(task.id)}
                  className="mt-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {task.isExpanded ? '▼' : '▶'}
                </button>

                <div className="flex-1">
                  {editingTaskId === task.id ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveTaskEdit(task.id)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => saveTaskEdit(task.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {task.title}
                    </h3>
                  )}

                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Status Buttons */}
                    <div className="flex gap-1">
                      {(['Pending', 'Running', 'Completed'] as TaskStatus[]).map(status => (
                        <button
                          key={status}
                          onClick={() => updateTaskStatus(task.id, status)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            task.status === status
                              ? getStatusColor(status)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-auto">
                      {editingTaskId !== task.id && (
                        <button
                          onClick={() => startEditingTask(task)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          編集
                        </button>
                      )}
                      <button
                        onClick={() => addSubtask(task.id)}
                        className="px-3 py-1 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      >
                        サブタスク追加
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtasks */}
              {task.isExpanded && task.subtasks.length > 0 && (
                <div className="mt-4 ml-8 space-y-2">
                  {task.subtasks.map(subtask => (
                    <div
                      key={subtask.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      {editingSubtaskId === subtask.id ? (
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && saveSubtaskEdit(task.id, subtask.id)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => saveSubtaskEdit(task.id, subtask.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 dark:text-white">
                            {subtask.title}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 items-center mt-2">
                        {/* Subtask Status Buttons */}
                        <div className="flex gap-1">
                          {(['Pending', 'Running', 'Completed'] as TaskStatus[]).map(status => (
                            <button
                              key={status}
                              onClick={() => updateSubtaskStatus(task.id, subtask.id, status)}
                              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                subtask.status === status
                                  ? getStatusColor(status)
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-400 dark:hover:bg-gray-500'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>

                        {/* Subtask Action Buttons */}
                        <div className="flex gap-2 ml-auto">
                          {editingSubtaskId !== subtask.id && (
                            <button
                              onClick={() => startEditingSubtask(subtask)}
                              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              編集
                            </button>
                          )}
                          <button
                            onClick={() => deleteSubtask(task.id, subtask.id)}
                            className="px-2 py-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            タスクがありません。上の入力欄から新しいタスクを追加してください。
          </div>
        )}
      </div>
    </div>
  );
}
