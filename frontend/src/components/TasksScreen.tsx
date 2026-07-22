import { parseDate } from "@internationalized/date";
import {
  Button,
  Checkbox,
  DateInput,
  Progress,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { ArrowLeft, Edit, Minus, Plus, Trash, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../AppProvider";
import Task from "../domain/Task";
import { TaskStatus } from "../domain/TaskStatus";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // 新增：搜尋與篩選的 State
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  
  const navigate = useNavigate();

  const taskList = state.taskLists.find((tl) => listId === tl.id);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId) return;

      setIsLoading(true);
      try {
        if (!taskList) {
          await api.getTaskList(listId);
        }

        try {
          await api.fetchTasks(listId);
        } catch (error) {
          console.log("Tasks not available yet");
        }
      } catch (error) {
        console.error("Error loading task list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId]);

  const completionPercentage = React.useMemo(() => {
    if (listId && state.tasks[listId]) {
      const tasks = state.tasks[listId];
      const closeTaskCount = tasks.filter(
        (task) => task.status === TaskStatus.CLOSED
      ).length;
      return tasks.length > 0 ? (closeTaskCount / tasks.length) * 100 : 0;
    }
    return 0;
  }, [state.tasks, listId]);

  const toggleStatus = (task: Task) => {
    if (listId) {
      const updatedTask = { ...task };
      updatedTask.status =
        task.status === TaskStatus.CLOSED ? TaskStatus.OPEN : TaskStatus.CLOSED;

      api
        .updateTask(listId, task.id, updatedTask)
        .then(() => api.fetchTasks(listId));
    }
  };

  const deleteTaskList = async () => {
    if (null != listId) {
      await api.deleteTaskList(listId);
      navigate("/");
    }
  };

  // 新增：處理過濾邏輯的方法
  const getFilteredTasks = () => {
    if (!listId || !state.tasks[listId]) return [];
    
    return state.tasks[listId].filter((task) => {
      // 1. 檢查關鍵字
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      // 2. 檢查優先級
      const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });
  };

  const tableRows = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length > 0) {
      return filteredTasks.map((task) => (
        <TableRow key={task.id} className="border-t">
          <TableCell className="px-4 py-2">
            <Checkbox
              isSelected={TaskStatus.CLOSED == task.status}
              onValueChange={() => toggleStatus(task)}
              aria-label={`Mark task "${task.title}" as ${
                TaskStatus.CLOSED == task.status ? "open" : "closed"
              }`}
            />
          </TableCell>
          <TableCell className="px-4 py-2">{task.title}</TableCell>
          <TableCell className="px-4 py-2">{task.priority}</TableCell>
          <TableCell className="px-4 py-2">
            {task.dueDate && (
              <DateInput
                isDisabled
                defaultValue={parseDate(
                  new Date(task.dueDate).toISOString().split("T")[0]
                )}
                aria-label={`Due date for task "${task.title}"`}
              />
            )}
          </TableCell>
          <TableCell className="px-4 py-2">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                aria-label={`Edit task "${task.title}"`}
                onClick={() =>
                  navigate(`/task-lists/${listId}/edit-task/${task.id}`)
                }
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => api.deleteTask(listId, task.id)}
                aria-label={`Delete task "${task.title}"`}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ));
    } else {
      // 當過濾後沒有資料時顯示的空狀態
      return (
        <TableRow>
          <TableCell>{" "}</TableCell>
          <TableCell>No tasks found.</TableCell>
          <TableCell>{" "}</TableCell>
          <TableCell>{" "}</TableCell>
          <TableCell>{" "}</TableCell>
        </TableRow>
      );
    }
  };

  if (isLoading) {
    return <Spinner />; 
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex w-full items-center justify-between">
          <Button
            variant="ghost"
            aria-label="Go back to Task Lists"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-2xl font-bold mx-4">
            {taskList ? taskList.title : "Unknown Task List"}
          </h1>

          <Button
            variant="ghost"
            aria-label={`Edit task list`}
            onClick={() => navigate(`/edit-task-list/${listId}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Progress
        value={completionPercentage}
        className="mb-4"
        aria-label="Task completion progress"
      />
      <Button
        onClick={() => navigate(`/task-lists/${listId}/new-task`)}
        aria-label="Add new task"
        className="mb-4 w-full"
      >
        <Plus className="h-4 w-4" /> Add Task
      </Button>

      {/* 新增：搜尋與篩選工具列 */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search className="text-gray-400" size={18} />}
          className="flex-1"
          aria-label="Search tasks"
        />
        <Select
          label="Priority"
          className="w-48"
          selectedKeys={[priorityFilter]}
          onChange={(e) => setPriorityFilter(e.target.value || "ALL")}
          aria-label="Filter by priority"
        >
          <SelectItem key="ALL" value="ALL">All Priorities</SelectItem>
          <SelectItem key="HIGH" value="HIGH">High</SelectItem>
          <SelectItem key="MEDIUM" value="MEDIUM">Medium</SelectItem>
          <SelectItem key="LOW" value="LOW">Low</SelectItem>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full" aria-label="Tasks list">
          <TableHeader>
            <TableColumn>Completed</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Priority</TableColumn>
            <TableColumn>Due Date</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>{tableRows()}</TableBody>
        </Table>
      </div>
      <Spacer y={4} />
      <div className="flex justify-end">
        <Button
          color="danger"
          startContent={<Minus size={20} />}
          onClick={deleteTaskList}
          aria-label="Delete current task list"
        >
          Delete TaskList
        </Button>
      </div>

      <Spacer y={4} />
    </div>
  );
};

export default TaskListScreen;