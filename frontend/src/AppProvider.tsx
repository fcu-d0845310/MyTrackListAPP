import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import TaskList from "./domain/TaskList";
import Task from "./domain/Task";

interface AppState {
  taskLists: TaskList[];
  tasks: { [taskListId: string]: Task[] };
  searchResults: Task[];
}

type Action =
    | { type: "FETCH_TASKLISTS"; payload: TaskList[] }
    | { type: "GET_TASKLIST"; payload: TaskList }
    | { type: "CREATE_TASKLIST"; payload: TaskList }
    | { type: "UPDATE_TASKLIST"; payload: TaskList }
    | { type: "DELETE_TASKLIST"; payload: string }
    | { type: "FETCH_TASKS"; payload: { taskListId: string; tasks: Task[] } }
    | { type: "CREATE_TASK"; payload: { taskListId: string; task: Task } }
    | { type: "GET_TASK"; payload: { taskListId: string; task: Task } }
    | { type: "UPDATE_TASK"; payload: { taskListId: string; taskId: string; task: Task }; }
    | { type: "DELETE_TASK"; payload: { taskListId: string; taskId: string } }
    | { type: "SEARCH_TASKS"; payload: Task[] };

const FETCH_TASKLISTS = "FETCH_TASKLISTS";
const GET_TASKLIST = "GET_TASKLIST";
const CREATE_TASKLIST = "CREATE_TASKLIST";
const UPDATE_TASKLIST = "UPDATE_TASKLIST";
const DELETE_TASKLIST = "DELETE_TASKLIST";
const FETCH_TASKS = "FETCH_TASKS";
const CREATE_TASK = "CREATE_TASK";
const GET_TASK = "GET_TASK";
const UPDATE_TASK = "UPDATE_TASK";
const DELETE_TASK = "DELETE_TASK";
const SEARCH_TASKS = "SEARCH_TASKS";

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case FETCH_TASKLISTS:
      return { ...state, taskLists: action.payload };
    case GET_TASKLIST:
      return {
        ...state,
        taskLists: state.taskLists.some((wl) => wl.id === action.payload.id)
            ? state.taskLists.map((wl) =>
                wl.id === action.payload.id ? action.payload : wl
            )
            : [...state.taskLists, action.payload],
      };
    case CREATE_TASKLIST:
      return { ...state, taskLists: [...state.taskLists, action.payload] };
    case UPDATE_TASKLIST:
      return {
        ...state,
        taskLists: state.taskLists.map((wl) =>
            wl.id === action.payload.id ? action.payload : wl
        ),
      };
    case DELETE_TASKLIST:
      return {
        ...state,
        taskLists: state.taskLists.filter((wl) => wl.id !== action.payload),
      };
    case FETCH_TASKS:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: action.payload.tasks,
        },
      };
    case CREATE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: [
            ...(state.tasks[action.payload.taskListId] || []),
            action.payload.task,
          ],
        },
      };
    case GET_TASK: {
      const existingTasks = state.tasks[action.payload.taskListId] || [];
      const taskExists = existingTasks.some(
          (task) => task.id === action.payload.task.id
      );
      const updatedTasks = taskExists
          ? existingTasks.map((task) =>
              task.id === action.payload.task.id ? action.payload.task : task
          )
          : [...existingTasks, action.payload.task];

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: updatedTasks,
        },
      };
    }
    case UPDATE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: state.tasks[
              action.payload.taskListId
              ].map((task) =>
              task.id === action.payload.taskId ? action.payload.task : task
          ),
        },
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: state.tasks[
              action.payload.taskListId
              ].filter((task) => task.id !== action.payload.taskId),
        },
      };
    case SEARCH_TASKS:
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
};

const initialState: AppState = {
  taskLists: [],
  tasks: {},
  searchResults: [],
};

interface AppContextType {
  state: AppState;
  api: {
    fetchTaskLists: () => Promise<void>;
    getTaskList: (id: string) => Promise<void>;
    createTaskList: (taskList: Omit<TaskList, "id">) => Promise<void>;
    updateTaskList: (id: string, taskList: TaskList) => Promise<void>;
    deleteTaskList: (id: string) => Promise<void>;
    fetchTasks: (taskListId: string) => Promise<void>;
    createTask: (
        taskListId: string,
        task: Omit<Task, "id" | "taskListId">
    ) => Promise<void>;
    getTask: (taskListId: string, taskId: string) => Promise<void>;
    updateTask: (
        taskListId: string,
        taskId: string,
        task: Task
    ) => Promise<void>;
    deleteTask: (taskListId: string, taskId: string) => Promise<void>;
    searchTasks: (keyword: string) => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 建立帶有攔截器的 Axios 實例
const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("jwt_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api: AppContextType["api"] = {
    fetchTaskLists: async () => {
      const response = await apiClient.get<TaskList[]>("/api/task-lists");
      dispatch({ type: FETCH_TASKLISTS, payload: response.data });
    },
    getTaskList: async (id: string) => {
      const response = await apiClient.get<TaskList>(`/api/task-lists/${id}`);
      dispatch({ type: GET_TASKLIST, payload: response.data });
    },
    createTaskList: async (taskList) => {
      const response = await apiClient.post<TaskList>("/api/task-lists", taskList);
      dispatch({ type: CREATE_TASKLIST, payload: response.data });
    },
    getTask: async (taskListId: string, taskId: string) => {
      const response = await apiClient.get<Task>(`/api/task-lists/${taskListId}/tasks/${taskId}`);
      dispatch({ type: GET_TASK, payload: { taskListId, task: response.data } });
    },
    updateTaskList: async (id, taskList) => {
      const response = await apiClient.put<TaskList>(`/api/task-lists/${id}`, taskList);
      dispatch({ type: UPDATE_TASKLIST, payload: response.data });
    },
    deleteTaskList: async (id) => {
      await apiClient.delete(`/api/task-lists/${id}`);
      dispatch({ type: DELETE_TASKLIST, payload: id });
    },
    fetchTasks: async (taskListId) => {
      const response = await apiClient.get<Task[]>(`/api/task-lists/${taskListId}/tasks`);
      dispatch({ type: FETCH_TASKS, payload: { taskListId, tasks: response.data } });
    },
    createTask: async (taskListId, task) => {
      const response = await apiClient.post<Task>(`/api/task-lists/${taskListId}/tasks`, task);
      dispatch({ type: CREATE_TASK, payload: { taskListId, task: response.data } });
    },
    updateTask: async (taskListId, taskId, task) => {
      const response = await apiClient.put<Task>(`/api/task-lists/${taskListId}/tasks/${taskId}`, task);
      dispatch({ type: UPDATE_TASK, payload: { taskListId, taskId, task: response.data } });
    },
    deleteTask: async (taskListId, taskId) => {
      await apiClient.delete(`/api/task-lists/${taskListId}/tasks/${taskId}`);
      dispatch({ type: DELETE_TASK, payload: { taskListId, taskId } });
    },
    searchTasks: async (keyword: string) => {
      const response = await apiClient.get<Task[]>(`/api/tasks/search?keyword=${encodeURIComponent(keyword)}`);
      dispatch({ type: SEARCH_TASKS, payload: response.data });
    },
  };

  useEffect(() => {
    // 檢查是否有 Token 才執行初次載入，避免未登入時拋出 403 錯誤
    const token = localStorage.getItem("jwt_token");
    if (token) {
      api.fetchTaskLists();
    }
  }, []);

  return (
      <AppContext.Provider value={{ state, api }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};