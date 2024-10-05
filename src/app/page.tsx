'use client'
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"


import Image from "next/image";

export default function Home() {

  interface Task{
    id:number,
    text: string,
    completed: boolean
  }


  const [tasks, settasks] = useState<Task[]>([])
  const [inputTasks, setinputTasks] = useState<string>("")
  const [editingTaskId, seteditingTaskId] = useState<number | null>(null)
  const [editedTaskText, seteditedTaskText] = useState<string>("")
  const [isMounted, setisMounted] = useState<boolean>(false)


  useEffect(() => {

    setisMounted(true)
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      settasks(JSON.parse(savedTasks)as Task[])
    }
  
  }, [])


  useEffect(() => {
    
    if(isMounted){
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }  
  }, [tasks, isMounted])

  const handleAdd = (): void => {
    if (inputTasks.trim() !== "") {
      settasks([...tasks, {id: Date.now(), text: inputTasks, completed: false}])
      setinputTasks("")
    }
  }

  const handleCompletion = function (id: number) {
    settasks(tasks.map((task)=>
      task.id === id ? {...task, completed : !task.completed}:task
    ))
  }

  const editedTask = (id: number, text:string):void =>{
    seteditingTaskId(id)
    seteditedTaskText(text)
  }
  
  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      settasks(
        tasks.map((task) =>
          task.id === editingTaskId ? {...task, text: editedTaskText} : task
        )
      )
      seteditedTaskText("")
      seteditingTaskId(null)
    }
  }

  const deleteTask = (id:number):void =>{
    settasks(tasks.filter((task)=>task.id !== id))

  }
  if (!isMounted) {
    return null
  }



  return (
    <div className="flex items-center justify-center bg-gray-500 min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="container w-full max-w-md shadow-lg rounded-lg bg-slate-100 p-6 flex flex-col justify-between gap-6">
        <h1 className=" text-2xl font-bold">Todo List</h1>
        <div className="add-tasks flex items-center gap-4">
          <Input
          type="text"
          placeholder="Add a new task..."
          value={inputTasks}
          onChange={(e:ChangeEvent<HTMLInputElement>)=> setinputTasks(e.target.value)}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
        <div className="tasks flex flex-col gap-4">
          {tasks.map((task)=>
          <div className="task flex items-center justify-between bg-slate-400 rounded-md px-4 py-6"
          key={task.id}
          >
            <div className="toggle flex items-center">
              <Checkbox
              checked={task.completed}
              className="mr-2"
              onCheckedChange={() => handleCompletion(task.id)}
              />
              {editingTaskId === task.id ?(
                <Input
                type="text"
                value={editedTaskText}
                onChange={
                  (e: ChangeEvent<HTMLInputElement>) =>
                    seteditedTaskText(e.target.value)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    updateTask();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
              ):(
                <span
                    className={`flex-1 text-gray-800 dark:text-gray-200 ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : ""
                    }`}
                  >
                    {task.text}
                  </span>
              )}
            </div>
            <div className="flex items-center">
                {editingTaskId === task.id ? (
                  <Button
                    onClick={updateTask}
                    className="bg-black hover:bg-slate-800 text-white font-medium py-1 px-2 rounded-md mr-2"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => editedTask(task.id, task.text)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-1 px-2 rounded-md mr-2"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md"
                >
                  Delete
                </Button>
              </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
