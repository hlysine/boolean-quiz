type ResultHandler = (question: Question, isCorrect: boolean) => void;

export default abstract class Question {
  private resultHandlers: ResultHandler[] = [];

  public onResult(handler: ResultHandler) {
    if (!this.resultHandlers.includes(handler)) this.resultHandlers.push(handler);
  }

  protected emitResult(isCorrect: boolean) {
    this.resultHandlers.forEach(handler => handler(this, isCorrect));
  }

  public abstract createQuestionComponent(): React.FC;
  public abstract createAnswerComponent(): React.FC;
}
