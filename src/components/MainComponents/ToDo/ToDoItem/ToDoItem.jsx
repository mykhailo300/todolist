import s from "./ToDoItem.module.css"
import PortalReactDOM from 'react-dom'
import "./../../../../styles.css"
import styled from "styled-components"
import {Draggable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";

export const Container = styled.div`
  padding: 0;
`;

const ToDoItem = (props) => {
    let [editMode, setEditMode] = useState(false);
    let [toDoTask, setToDoTask] = useState(props.task);

    useEffect(() => {
        setToDoTask(props.task)
    }, [props.task]);

    let activateEditMode = () => {
        setEditMode(true)
    }

    let deActivateEditMode = () => {
        setEditMode(false);
        props.dispatch({
            type: "SET_TASK",
            payload: {
                id: props.id,
                updatedTask: toDoTask
            }
        })
    }

    let onChangeTask = (e) => {
        setToDoTask(e.currentTarget.value);
    }
    let onDone = () => {
        props.dispatch({
            type: "DONE_TASK",
            payload: {
                task: props.task,
                id: props.id,
                index: props.index
            }
        })
    }

    return (
        <Draggable draggableId={props.id} index={props.index} dragHandle
                   disableInteractiveElementBlocking className={"draggable"} key={props.id}>
            {(provided, snapshot) => {
                const child = (<Container {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          ref={provided.innerRef}>
                    {!editMode &&
                        <div className="addTaskBlock">
                            <span onDoubleClick={activateEditMode} className={s.toDoItem}>{props.task || ""}</span>
                            <button className={"addTaskButton"} onClick={onDone}><></>
                            </button>
                        </div>}
                    {editMode &&
                        <div className={s.updateTaskBlock}>
                            <input onChange={onChangeTask}
                                   autoFocus={true} onDoubleClick={deActivateEditMode} value={[toDoTask]} type="text"
                                   className={s.updateTaskInput} onBlur={deActivateEditMode}
                                   onMouseDown={(e) => e.preventDefault()} onMouseUp={(e) => e.preventDefault()}
                            />
                        </div>}
                </Container>)

                if (!snapshot.isDragging) return child;

                return PortalReactDOM.createPortal(child, document.getElementById("root"));
            }}
        </Draggable>
    )
}

export default ToDoItem;