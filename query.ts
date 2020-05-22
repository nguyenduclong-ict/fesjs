import { Provider } from "./mongo/query";

export interface Pagination {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPage?: number;
    disabled?: boolean;
}

export function validatePagination(pagination: any = {}): Pagination {
    const { page, pageSize, total, totalPage, disabled } = pagination;
    return {
        page: Number(page),
        pageSize: Number(pageSize),
        total: Number(total),
        totalPage: Number(totalPage),
        disabled: Boolean(disabled),
    };
}

export function list(model) {
    const provider: Provider =
        model instanceof Provider ? model : new Provider(model);
    return async function (req, res, next) {
        if (typeof req.query.pagination === "string") {
            req.query.pagination = JSON.parse(req.query.pagination);
        }
        req.query.pagination = req.query.pagination || {
            page: 0,
            pageSize: 10,
            disabled: false,
        };
        const pagination = validatePagination(req.query.pagination);
        delete req.query.pagination;
        const result = await provider.getMany(req.query, { pagination });
        return res.json(result);
    };
}

export function find(model) {
    const provider: Provider =
        model instanceof Provider ? model : new Provider(model);
    return async function (req, res, next) {
        const result = await provider.getMany(req.query, {});
        return res.json(result);
    };
}
