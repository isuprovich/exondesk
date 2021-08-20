import { api } from './api'

export type TTagInner = {
    _id: string
    value: string
    label: string
    color: string
}
export type TTag = [TTagInner]
type TPriorities = {
    priorities: TTag
}
type TStatuses = {
    statuses: TTag
}
export type TTags = {
    tags: TTag
}

export const tagsAPI = {
    getPriorities() {
        return api.get<TPriorities>('/tags/priorities')
            .then(res => res.data).then(res => {return res.priorities})
    },
    getStatuses() {
        return api.get<TStatuses>('/tags/statuses')
        .then(res => res.data).then(res => {return res.statuses})
    },
    newPriority(data: TTagInner) {
        return api.post('/tags/newpriority', data)
    },
    newStatus(data: TTagInner) {
        return api.post('/tags/newstatus', data)
    },
    deletePriority(value: string) {
        return api.delete(`/tags/priorities/${value}`)
    },
    deleteStatus(value: string) {
        return api.delete(`/tags/statuses/${value}`)
    },
}