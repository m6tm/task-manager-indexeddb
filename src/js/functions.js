import { db } from "./db";


export async function displayTasks() {
        const tasts = await db.table('tasks').toArray()
        let task_inner = document.querySelector('#task-inner'),
        /**
         * @type {HTMLFormElement}
         */
        form = document.querySelector('#task-form')

        form.reset()
        Array.from(task_inner.children).forEach(item => item.remove())
        tasts.forEach(task => {
                task_inner.appendChild(
                        new DOMParser().parseFromString(`
                                <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${task.id}">
                                        ${task.name}
                                        <button class="btn btn-danger btn-sm" data-btn="task-delete">Delete</button>
                                </li>
                        `, 'text/html').querySelector('body li')
                )
        })

        listenerEvents()
}

export function listenerEvents() {
        const task_list = document.querySelector('#task-inner'),
        /**
         * @type {HTMLFormElement}
         */
        form = document.querySelector('#task-form');

        Array.from(task_list.children).forEach(item => {
                item.addEventListener('click', async e => {
                        if (e.target.nodeName == 'BUTTON') return
                        const id = parseInt(item.getAttribute('data-id') ?? '-1'),
                        task = await getTask(id)
                        
                        form.querySelector('input[name="id"]').value = task.id
                        form.querySelector('input[name="name"]').value = task.name
                        form.querySelector('textarea[name="description"]').value = task.description
                        form.querySelector('input[name="due_date"]').value = task.due_date
                })
                
                item.querySelector('button[data-btn="task-delete"]').addEventListener('click', e => {
                        if (e.target.nodeName !== 'BUTTON') return
                        const id = parseInt(item.getAttribute('data-id') ?? '-1')
                        if (id === -1) return
                        removeTask(id)
                }, false)
        })
}

export function addTask(task) {
        db.table('tasks').add(task)
}

export function removeTask(task_id) {
        db.table('tasks').delete(task_id)
        displayTasks()
}

export async function editTask(task) {
        const existingTask = await db.table('tasks').get(task.id);
        if (existingTask) {
                await db.table('tasks').update(task.id, task);
                await displayTasks()
        }
}

export async function getTask(task_id) {
        return await db.table('tasks').get(task_id);
}