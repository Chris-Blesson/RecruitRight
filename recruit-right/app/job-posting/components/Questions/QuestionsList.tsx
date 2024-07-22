const QuestionCard = ({ question }) => {
  return (
    <div className="rounded-md bg-gray-100 p-4 flex items-center justify-between">
      {question}
    </div>
  );
};
const QuestionsList = ({ questions }: { questions: String[] }) => {
  return (
    <div className="flex flex-col gap-y-4">
      {questions.map((question) => (
        <QuestionCard question={question} />
      ))}
    </div>
  );
};

export default QuestionsList;
