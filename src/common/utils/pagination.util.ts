export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export class PaginationUtil {
  static paginate<T>(
    data: T[],
    totalItems: number,
    options: PaginationOptions
  ): PaginationResult<T> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  static getSkipTake(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }
}
