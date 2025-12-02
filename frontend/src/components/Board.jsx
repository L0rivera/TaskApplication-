import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import useTasks from "../store/useTasks";

export default function Board() {
  const { tasks, fetchTasks, connectSocket, moveTask, createTask } = useTasks();

  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchTasks();
    connectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = {
    backlog: tasks.filter((t) => t.status === "backlog"),
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const id = result.draggableId;
    const newStatus = result.destination.droppableId;

    moveTask(id, newStatus);
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createTask(newTitle, "");
    setNewTitle("");
  };

  return (
    <div className="p-6">

      <div className="flex mb-6 items-center gap-3">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nueva tarea..."
          className="p-2 border rounded w-80"
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          <Column title="Backlog" tasks={columns.backlog} droppableId="backlog" />
          <Column title="To Do" tasks={columns.todo} droppableId="todo" />
          <Column title="In Progress" tasks={columns["in-progress"]} droppableId="in-progress" />
          <Column title="Done" tasks={columns.done} droppableId="done" />
        </div>
      </DragDropContext>
    </div>
  );
}
