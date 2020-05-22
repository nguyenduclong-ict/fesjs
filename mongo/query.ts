import { Model, Document } from 'mongoose'

import {
    GetOneFunction,
    GetManyFunction,
    CreateManyFunction,
    UpdateOneFunction,
    UpdateManyFunction,
    DeleteOneFunction,
    DeleteManyFunction,
    CreateOneFunction,
    GetManyOptions,
} from './declare'

export class Provider {
    model: Model<Document, {}>

    constructor(model: Model<Document, {}>) {
        this.model = model
        this.getOne = getOne(model)
        this.getMany = getMany(model)
        this.createOne = createOne(model)
        this.createMany = createMany(model)
        this.updateOne = updateOne(model)
        this.updateMany = updateMany(model)
        this.deleteOne = deleteOne(model)
        this.deleteMany = deleteMany(model)
    }

    getOne: GetOneFunction
    getMany: GetManyFunction
    createOne: CreateOneFunction
    createMany: CreateManyFunction
    updateOne: UpdateOneFunction
    updateMany: UpdateManyFunction
    deleteOne: DeleteOneFunction
    deleteMany: DeleteManyFunction
}

// function ----------------------------------------------------
export function getOne(model: Model<Document, {}>) {
    return (condition, populates: string[] = []) => {
        const task = model.findOne(condition)
        populates.forEach((field) => {
            task.populate(field)
        })
        return task.lean().exec()
    }
}

export function getMany(model: Model<Document, {}>) {
    return async (condition, options: GetManyOptions) => {
        const defaultOptions: GetManyOptions = {
            populates: [],
            pagination: {
                disabled: true,
            },
        }
        options = { ...defaultOptions, ...options }
        const { pagination, populates } = options
        if (!pagination.disabled) {
            // skip and limit
            const { page, pageSize } = pagination
            const task = model
                .find(condition)
                .skip(pageSize * page)
                .limit(pageSize)
            // populates
            populates.forEach((field) => {
                task.populate(field)
            })
            const [list, count] = await Promise.all([
                task.lean().exec(),
                model.countDocuments(condition),
            ])
            // pager
            const pager = {
                page,
                total: count,
                pageSize,
                totalPage: Math.ceil(count / pageSize),
            }
            return { data: list || [], pager }
        } else {
            // No pagination
            const task = model.find(condition)
            // populates
            populates.forEach((field) => {
                task.populate(field)
            })
            return task.lean().exec()
        }
    }
}

export function updateOne(model: Model<Document, {}>) {
    return (condition, data, options?) => {
        return model.findOneAndUpdate(condition, data, {
            new: true,
            setDefaultsOnInsert: true,
            upsert: false,
            ...(options || {}),
        })
    }
}

export function updateMany(model: Model<Document, {}>) {
    return (condition, data, options?) => {
        return model.updateMany(condition, data, {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true,
            ...(options || {}),
        })
    }
}

export function createOne(model: Model<Document, {}>) {
    return (doc, mode: 'create' | 'save' = 'save') => {
        if (mode === 'create') {
            return model.create(doc)
        } else if (mode === 'save') {
            return new model(doc).save()
        }
    }
}

export function createMany(model: Model<Document, {}>) {
    return (docs) => {
        return model.insertMany(docs)
    }
}

export function deleteOne(model: Model<Document, {}>) {
    return (condition) => {
        return model.deleteOne(condition)
    }
}

export function deleteMany(model: Model<Document, {}>) {
    return (condition) => {
        return model.deleteMany(condition)
    }
}
