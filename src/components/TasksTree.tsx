import Tree, {
    ItemId,
    moveItemOnTree,
    mutateTree,
    Path,
    RenderItemParams,
    TreeData,
    TreeDestinationPosition,
    TreeItem,
    TreeSourcePosition,
} from "@atlaskit/tree";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import axios from "axios";
import { useAuth } from "hooks/AuthHook";
import { HTMLProps, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TaskType } from "types";
import Task from "./Task";

const TasksTree: React.FC<HTMLProps<HTMLDivElement>> = (props) => {
    const { id } = useParams();
    const { accessToken, isLoggedIn } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const initTree: TreeData = {
        rootId: "root",
        items: {
            root: {
                id: "root",
                children: [],
            },
        },
    };

    const [tree, setTree] = useState<TreeData>(initTree);

    const sortItems = (ids: ItemId[], items: Record<ItemId, TreeItem>) => {
        ids.sort((id1, id2) => {
            let pos1 = items[id1].data.position;
            let pos2 = items[id2].data.position;
            let status1 = items[id1].data.status === "completed";
            let status2 = items[id2].data.status === "completed";

            if (status1 !== status2) {
                if (!status1) return -1;
                return 1;
            }

            if (pos1 < pos2) return -1;
            else return 1;
        });
        return ids;
    };
    const buildItems = (_tasks: TaskType[]) => {
        let parents = new Map<ItemId, ItemId[]>();
        let ids: ItemId[] = [];
        let items: Record<ItemId, TreeItem> = {};

        _tasks.forEach((_task) => {
            items[_task.id] = {
                id: _task.id,
                children: [],
                data: { ..._task },
            };
            if (_task.parent !== undefined) {
                if (parents.has(_task.parent)) {
                    let _children = parents.get(_task.parent);
                    _children!.push(_task.id);
                    parents.set(_task.parent, _children!);
                } else {
                    parents.set(_task.parent, [_task.id]);
                }
            } else {
                ids.push(_task.id);
            }
        });

        for (const [key, value] of parents.entries()) {
            items[key].children = sortItems(value, items);
        }

        ids = sortItems(ids, items);
        return { ids, items };
    };

    useEffect(() => {
        if (isLoggedIn && id !== undefined && accessToken !== undefined) {
            setIsLoading(true);
            axios
                .get(
                    `https://tasks.googleapis.com/tasks/v1/lists/${id}/tasks?showHidden=True&maxResults=100`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )
                .then((data) => data.data)
                .then((data) => {
                    const { ids, items } = buildItems(data.items);
                    let _tree: TreeData = {
                        rootId: "root",
                        items: {
                            root: {
                                id: "root",
                                children: ids,
                            },
                            ...items,
                        },
                    };
                    for (let _id of ids) {
                        _tree = mutateTree(_tree, _id, { isExpanded: true });
                    }

                    setTree(_tree);
                    setIsError(false);
                })
                .catch((err) => {
                    setIsError(true);
                })
                .finally(() => setIsLoading(false));
        }
    }, [id, isLoggedIn, accessToken]);

    if (id === undefined) return <div>Please select a task list</div>;
    if (isLoading) return <div>Fetching Tasks</div>;
    if (isError) return <div>Error</div>;

    const getIcon = (
        item: TreeItem,
        onExpand: (itemId: ItemId) => void,
        onCollapse: (itemId: ItemId) => void
    ) => {
        if (item.children && item.children.length > 0) {
            return item.isExpanded ? (
                <span onClick={() => onCollapse(item.id)}>-</span>
            ) : (
                <span onClick={() => onExpand(item.id)}>+</span>
            );
        }
        return <span>&bull;</span>;
    };

    const renderTask = ({
        item,
        onCollapse,
        onExpand,
        provided,
    }: RenderItemParams) => {
        return (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <Task
                    key={item.id}
                    task={item.data}
                    expandTask={onExpand}
                    collapseTask={onCollapse}
                />
            </div>
        );
    };

    const handleExpand = (itemId: ItemId, path: Path) => {
        setTree(mutateTree(tree, itemId, { isExpanded: true }));
    };

    const handleCollapse = (itemId: ItemId, path: Path) => {
        setTree(mutateTree(tree, itemId, { isExpanded: false }));
    };

    const handleDragEnd = (
        src: TreeSourcePosition,
        dst: TreeDestinationPosition | undefined
    ) => {
        if (dst === undefined || dst.index === undefined) return;
        console.log(src, dst);
        let _tree = moveItemOnTree(tree, src, dst);

        // expanding if the element is nested newly
        if (_tree.items[dst.parentId].children.length === 1) {
            _tree = mutateTree(_tree, dst.parentId, { isExpanded: true });
        }

        let _taskId = _tree.items[dst.parentId].children[dst.index];
        let _task: TaskType = _tree.items[_taskId].data;
        if (dst.parentId === "root") {
            if (dst.index === 0) {
                axios
                    .post(`${_task.selfLink}/move`, undefined, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                    .then((data) => {
                        let _movedTask = data.data;
                        _tree = mutateTree(_tree, _taskId, {
                            data: _movedTask,
                        });
                        setTree(_tree);
                    })
                    .catch((err) => console.log(err));
            } else {
                let _prevId = _tree.items[dst.parentId].children[dst.index - 1];
                axios
                    .post(
                        `${_task.selfLink}/move?previous=${_prevId}`,
                        undefined,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    )
                    .then((data) => {
                        let _movedTask = data.data;
                        _tree = mutateTree(_tree, _taskId, {
                            data: _movedTask,
                        });
                        setTree(_tree);
                    })
                    .catch((err) => console.log(err));
            }
        } else {
            if (dst.index === 0) {
                axios
                    .post(
                        `${_task.selfLink}/move?parent=${dst.parentId}`,
                        undefined,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    )
                    .then((data) => {
                        let _movedTask = data.data;
                        _tree = mutateTree(_tree, _taskId, {
                            data: _movedTask,
                        });
                        setTree(_tree);
                    })
                    .catch((err) => console.log(err));
            } else {
                let _prevId = _tree.items[dst.parentId].children[dst.index - 1];
                axios
                    .post(
                        `${_task.selfLink}/move?previous=${_prevId}&parent=${dst.parentId}`,
                        undefined,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    )
                    .then((data) => {
                        let _movedTask = data.data;
                        _tree = mutateTree(_tree, _taskId, {
                            data: _movedTask,
                        });
                        setTree(_tree);
                    })
                    .catch((err) => console.log(err));
            }
        }
    };

    const handleDragEndBeautiful = () => {}
    
    return (
        <div {...props}>
            <DragDropContext onDragEnd={handleDragEndBeautiful}>
                <Droppable droppableId={id.toString()}>
                    {(provided, snapshot) => {
                        return (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            ></div>
                        );
                    }}
                </Droppable>
            </DragDropContext>
            {/* <Tree
            tree={tree}
            renderItem={renderTask}
            onCollapse={handleCollapse}
            onExpand={handleExpand}
            onDragEnd={handleDragEnd}
            isDragEnabled
            isNestingEnabled
            /> */}
        </div>
    );
};

export default TasksTree;
