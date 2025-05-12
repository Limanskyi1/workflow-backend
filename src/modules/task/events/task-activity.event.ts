export class TaskActivityEvent {
  constructor(
    public readonly taskId: number,
    public readonly userId: number,
  ) {}
}
