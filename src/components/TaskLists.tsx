import axios from "axios";
import { useAuth } from "hooks/AuthHook";
import { HTMLProps, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TaskListType } from "types";

const TaskLists: React.FC<HTMLProps<HTMLDivElement>> = (props) => {
    const { accessToken, isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [taskLists, setTaskLists] = useState<Array<TaskListType>>([]);
    const { id } = useParams();

    useEffect(() => {
        if (isLoggedIn && accessToken !== undefined) {
            setIsLoading(true);
           axios 
                .get("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then((data) => data.data)
                .then((data) => {
                    setIsError(false);
                    setTaskLists(data.items);
                })
                .catch((err) => {
                    console.log(err);
                    setIsError(true);
                })
                .finally(() => setIsLoading(false));
        }
    }, [isLoggedIn, accessToken]);

    if (isLoading) return <div> Loading...</div>;
    if (isError) return <div>Error</div>;
    return (
        <div>
            {taskLists.map((taskList) => {
                const bgColor = taskList.id === id ? "bg-blue-200" : "";
                return <Link key={taskList.id} to={`/workspace/${taskList.id}`}>
                    <p className={"rounded-r-full p-1" + " " + bgColor}>{taskList.title}</p>
                </Link>
            })}
        </div>
    );
};

export default TaskLists;
