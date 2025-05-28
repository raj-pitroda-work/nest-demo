import { throwCustomError } from "src/exceptions/customException";
import { DeepPartial, ObjectLiteral, Repository } from "typeorm";

export class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  create = async (data: DeepPartial<T>): Promise<T> => {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  };

  findOne = async (id: number): Promise<T | null> => {
    return this.repository.findOne({ where: { id } } as any);
  };

  findAll = async (): Promise<T[]> => {
    return this.repository.find();
  };

  findAllAndCount = async (): Promise<[T[], number]> => {
    return this.repository.findAndCount();
  };

  update = async (id: number, data: Partial<T>): Promise<T> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _new, ...updateData } = data;
    const existingEntity = await this.findOne(id);
    if (!existingEntity) {
      throwCustomError("Record not found", 404);
    }
    await this.repository.update(id, updateData as any);
    return { ...existingEntity, ...updateData };
  };

  remove = async (id: number): Promise<boolean> => {
    const result = await this.repository.delete(id);
    return result.affected ? true : false;
  };
}
