import { Button, Card, CardBody, Progress, Input } from "@nextui-org/react";
import { List, Plus, Search, CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppProvider";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const [keyword, setKeyword] = useState(""); // [新增] 記錄搜尋關鍵字

  useEffect(() => {
    if (null == state.taskLists) {
      api.fetchTaskLists();
    }
  }, [state]);

  // [新增] 監聽關鍵字改變，並呼叫搜尋 API
  useEffect(() => {
    if (keyword.trim() !== "") {
      api.searchTasks(keyword);
    }
  }, [keyword]);

  const navigate = useNavigate();

  const handleCreateTaskList = () => {
    navigate("/new-task-list");
  };

  const handleSelectTaskList = (taskListId: string | undefined) => {
    navigate(`/task-lists/${taskListId}`);
  };

  return (
      <div className="p-4 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 pr-2">My Task Lists</h1>

        {/* [新增] 全域搜尋輸入框 */}
        <Input
            placeholder="Search tasks across all lists..."
            value={keyword}
            onValueChange={setKeyword}
            startContent={<Search className="text-gray-400" size={18} />}
            className="mb-6 w-full"
            aria-label="Search all tasks"
            isClearable
        />

        {/* 判斷：如果有搜尋關鍵字，顯示搜尋結果；否則顯示原始清單 */}
        {keyword.trim() !== "" ? (
            <div>
              <h2 className="text-lg font-semibold mb-3">Search Results</h2>
              {state.searchResults.length === 0 ? (
                  <p className="text-gray-500 text-sm">No tasks found.</p>
              ) : (
                  state.searchResults.map((task) => (
                      <Card key={task.id} className="mb-2 w-full shadow-sm border border-gray-800">
                        <CardBody className="py-3 px-4 flex flex-row items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium">{task.title}</h3>
                            <p className="text-xs text-gray-500">Priority: {task.priority}</p>
                          </div>
                          {task.status === "CLOSED" && <CheckCircle2 size={18} className="text-green-500" />}
                        </CardBody>
                      </Card>
                  ))
              )}
            </div>
        ) : (
            <>
              <Button
                  onPress={handleCreateTaskList}
                  color="primary"
                  startContent={<Plus size={20} aria-hidden="true" />}
                  className="w-full mb-4"
                  aria-label="Create New Task List"
              >
                Create New Task List
              </Button>
              {state.taskLists.map((list) => {
                return (
                    <Card
                        key={list.id}
                        isPressable
                        onPress={() => handleSelectTaskList(list.id)}
                        className="mb-4 w-full"
                        role="button"
                        aria-label={`Select task list: ${list.title}`}
                    >
                      <CardBody>
                        <div className="flex items-center">
                          <List
                              size={20}
                              className="mr-2 opacity-[40%]"
                              aria-hidden="true"
                          />
                          <h2 className="text-lg font-semibold">{list.title}</h2>{" "}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{list.count} tasks</p>
                        <Progress
                            value={list.progress ? list.progress * 100 : 0}
                            className="mt-2"
                            color="primary"
                            aria-label={`Progress for ${list.title}: ${list.progress}%`}
                        />
                      </CardBody>
                    </Card>
                );
              })}
            </>
        )}
      </div>
  );
};

export default TaskListScreen;