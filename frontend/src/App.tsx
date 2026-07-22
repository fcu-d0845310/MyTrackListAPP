import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskLists from "./components/TaskListsScreen";
import CreateUpdateTaskListScreen from "./components/CreateUpdateTaskListScreen";
import TaskListScreen from "./components/TasksScreen";
import CreateUpdateTaskScreen from "./components/CreateUpdateTaskScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";

// 路由防護：無 Token 則強制重導至登入頁
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* 公開路由 */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* 受保護路由 */}
          <Route path="/" element={<ProtectedRoute><TaskLists /></ProtectedRoute>} />
          <Route path="/new-task-list" element={<ProtectedRoute><CreateUpdateTaskListScreen /></ProtectedRoute>} />
          <Route
              path="/edit-task-list/:listId"
              element={<ProtectedRoute><CreateUpdateTaskListScreen /></ProtectedRoute>}
          />
          <Route path="/task-lists/:listId" element={<ProtectedRoute><TaskListScreen /></ProtectedRoute>} />
          <Route
              path="/task-lists/:listId/new-task"
              element={<ProtectedRoute><CreateUpdateTaskScreen /></ProtectedRoute>}
          />
          <Route
              path="/task-lists/:listId/edit-task/:taskId"
              element={<ProtectedRoute><CreateUpdateTaskScreen /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
  );
}

export default App;