export interface ITasks {
    [task: string]: TTask
}
export interface IColumns {
    [column: string]: TColumn
}
export interface IUsers {
    [user: number]: TUser
}
interface IInitData {
    users: IUsers,
    tasks: ITasks,
    columns: IColumns,
    columnOrder: Array<string>
}
export type TUser = {
    id: number,
    name: string,
    email: string
}
export type TColumn = {
    id: string,
    title: string,
    taskIds: Array<string>
}
export type TTask = {
    id: string,
    taskNumber: string,
    taskName: string,
    dateOfCreate: string,
    taskSide: 'Front' | 'Back',
    taskExecutor: number,
    priority: 'low' | 'normal' | 'high' | 'critical' | 'epic' 
}

const initData: IInitData = {
    users: {
        1: {
            id: 1,
            name: 'Ivan Suprovich',
            email: 'isuprovich@ask-gps.ru'
        },
        2: {
            id: 2,
            name: 'Alex Korolkov',
            email: 'akorolkov@ask-gps.ru'
        }
    },
    tasks: {
        't1': {
            id: 't1',
            taskNumber: 'MS-1',
            taskName: 'Допилить фронт для карточек',
            dateOfCreate: '29.07.2021',
            taskSide: 'Front',
            taskExecutor: 1,
            priority: 'normal'
        },
        't2': {
            id: 't2',
            taskNumber: 'MS-2',
            taskName: 'Начать делать бэк Express + MongoDB',
            dateOfCreate: '29.07.2021',
            taskSide: 'Back',
            taskExecutor: 2,
            priority: 'high'
        },
        't3': {
            id: 't3',
            taskNumber: 'MS-3',
            taskName: 'АРАРАРАРАРА',
            dateOfCreate: '30.07.2021',
            taskSide: 'Back',
            taskExecutor: 1,
            priority: 'low'
        },
    },
    columns: {
        'col-1': {
            id: 'col-1',
            title: 'Новые',
            taskIds: ['t1', 't2', 't3']
        },
        'col-2': {
            id: 'col-2',
            title: 'В разработке',
            taskIds: []
        },
        'col-3': {
            id: 'col-3',
            title: 'Тест',
            taskIds: []
        },
        'col-4': {
            id: 'col-4',
            title: 'Закрыты',
            taskIds: []
        }
    },
    columnOrder: ['col-1', 'col-2', 'col-3', 'col-4']
}

export default initData