import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function Column({ title, tasks, droppableId }) {
  return (
    <div className="w-1/4 bg-gray-100 p-4 rounded">
      <h2 className="font-bold text-lg mb-4">{title}</h2>

      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            className="min-h-[200px]"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={String(task.id)}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
