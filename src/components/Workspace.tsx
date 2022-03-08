import TaskLists from "./TaskLists";
import TasksTree from "./TasksTree";

const Workspace: React.FC = () => {
    return <div className="flex w-full h-full">
        <TaskLists className="h-full w-56 bg-neutral-100 shadow-sm" />
        <TasksTree className="h-full" />
    </div>
}

export default Workspace;