import { ItemId } from "@atlaskit/tree";
import axios from "axios";
import { useAuth } from "hooks/AuthHook";
import { useState } from "react";
import { TaskType } from "types";

interface TaskProps {
    task: TaskType
    expandTask: (itemId: ItemId) => void
    collapseTask: (itemId: ItemId) => void
}

const Task: React.FC<TaskProps> = (props) => {
    const { accessToken } = useAuth();
    const [task, setTask] = useState<TaskType>(props.task);
    const [completed, setCompleted] = useState<boolean>(task.status === "completed");
    
    const handleClick = () => {
        let _task = task;
        if(completed){
            task.status = "needsAction";
        }else {
            task.status = "completed";
            task.completed = (new Date()).toISOString();
        }
        axios.put(task.selfLink, _task, {headers: {
            Authorization: `Bearer ${accessToken}`
        }}).then(data => {
            setTask(data.data);
            setCompleted(!completed);
        })
        .catch(err => console.log(err))
    }

    return <div>
        <input type="checkbox" name={task.title} id={task.id} checked={completed} onChange={handleClick} />
        <label className="ml-2" htmlFor={task.id}>{task.title}</label>
    </div>
}

export default Task;