import { DragDropContext } from "react-beautiful-dnd";
const Board: React.FC = () => {
    const handleDragEnd = () => {};

    return (
        <div>
            <DragDropContext onDragEnd={handleDragEnd}>Board</DragDropContext>
        </div>
    );
};

export default Board;
