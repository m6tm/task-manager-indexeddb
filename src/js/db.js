import Dexie from "dexie"

export const db = new Dexie('database')
db.version(1).stores({
        tasks: '++id, name, description, due_date, created_at, updated_at'
})