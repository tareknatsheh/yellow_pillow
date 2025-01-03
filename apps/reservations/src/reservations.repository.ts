import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { ReservationDocument } from './models/reservation.schema';

@Injectable()
export class ResrevationsRepository extends AbstractRepository<ReservationDocument> {
  protected logger = new Logger(ResrevationsRepository.name);
}
