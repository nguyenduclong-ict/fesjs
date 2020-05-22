import { Query, Document } from 'mongoose'

export declare type GetOneFunction = (
    condition,
    populates?: string[]
) => Promise<any>

export declare type GetManyFunction = (
    condition: any,
    options: GetManyOptions
) => Promise<
    | Pick<Document, '_id'>[]
    | {
          data: Pick<Document, '_id'>[]
          pager: {
              page: number
              total: number
              pageSize: number
              totalPage: number
          }
      }
>

export declare type UpdateManyFunction = (
    condition: any,
    data: any,
    options?: any
) => Query<any>

export declare type CreateOneFunction = (
    doc: any,
    mode?: 'save' | 'create'
) => Promise<Document>

export declare type CreateManyFunction = (docs: any) => Promise<Document>

export declare type UpdateOneFunction = (condition, data, options?) => any

export declare type DeleteManyFunction = (
    condition: any
) => Query<
    {
        ok?: number
        n?: number
    } & {
        deletedCount?: number
    }
>

export declare type DeleteOneFunction = (
    condition: any
) => Query<
    {
        ok?: number
        n?: number
    } & {
        deletedCount?: number
    }
>

export declare interface GetManyOptions {
    populates?: string[]
    pagination?: {
        disabled?: boolean
        page?: number
        pageSize?: number
    }
}
