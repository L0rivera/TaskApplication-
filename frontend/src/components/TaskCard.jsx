export default function TaskCard({ task }) {
  return (
    <div className="p-3 bg-white rounded shadow mb-3 cursor-pointer border border-gray-200 hover:shadow-md">
      <h3 className="font-semibold">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      )}
    </div>
  );
}
