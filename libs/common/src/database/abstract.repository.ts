import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDocument.save()).toJSON() as TDocument; // he has done as unknown as TDocument, I don't know why
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filter).lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Document not found with filter', filter);
      throw new NotFoundException('Doucment not found');
    }
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const updatedDocument = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);
    if (!updatedDocument) {
      this.logger.warn('Document not found with filter', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return updatedDocument;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const deletedDocument = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>(true);
    if (!deletedDocument) {
      this.logger.warn('Document not found with filter', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return deletedDocument;
  }
}
