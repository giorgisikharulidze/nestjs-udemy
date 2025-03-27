import { SelectQueryBuilder } from 'typeorm';
import { PaginationResponse } from '../common/pagination.response';
import { PaginationParams } from '../common/pagination.params';
import { ObjectLiteral } from 'typeorm';

/**
 * პაგინაციის გენერიკული ფუნქცია TypeORM-ის QueryBuilder-სთვის.
 */
export async function paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  pagination: PaginationParams,
): Promise<PaginationResponse<T>> {
  // პაგინაციის პარამეტრების დამატება
  qb.skip(pagination.offset).take(pagination.limit);

  // შედეგების წამოღება
  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    meta: {
      total,
      offset: pagination.offset,
      limit: pagination.limit,
    },
  };
}
