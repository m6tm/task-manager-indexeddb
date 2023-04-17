import { isEmpty } from "lodash";
import { addTask, displayTasks, editTask, getTask } from "./functions";
import moment from "moment/moment";

/**
 * @type {HTMLFormElement}
 */
const form = document.querySelector('#task-form'),
date_format = 'YYYY-MM-DD HH:mm:ss';

form.addEventListener('submit', async e => {
        e.preventDefault()
        e.stopPropagation()

        let formData = new FormData(form),
        task = Object.fromEntries(formData.entries())
        form.reset()

        if (isEmpty(task.id)) {
                delete task.id
                task.created_at = moment(moment.now()).format(date_format)
                task.updated_at = ''
                addTask(task)
        } else {
                task.id = parseInt(task.id)
                let newTask = await getTask(task.id)
                newTask = { ...newTask, ...task }
                newTask.updated_at = moment(moment.now()).format(date_format)
                editTask(newTask)
        }
        await displayTasks()
}, false)

displayTasks()