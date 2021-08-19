import { api } from './api'

export type TTag = [{
    value: string
    label: string
    color: string
}]
type TPriorities = {
    priorities: TTag
}
type TStatuses = {
    statuses: TTag
}

export const tagsAPI = {
    getPriorities() {
        return api.get<TPriorities>('/tags/priorities').then(res => res.data)
    },
    getStatuses() {
        return api.get<TStatuses>('/tags/statuses').then(res => res.data)
    },
    newPriority(data: TTag) {
        return api.post('/tags/newpriority', data)
    },
    newStatus(data: TTag) {
        return api.post('/tags/newstatus', data)
    }
}