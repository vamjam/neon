import BaseEntity from './BaseEntity'

export default class LibraryScan extends BaseEntity<LibraryScan> {
  startTime!: Date
  endTime?: Date
}
