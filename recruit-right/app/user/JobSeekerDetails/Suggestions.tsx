const Suggestions = ({ suggestions }) => {
  return (
    <ul className="list-disc list-inside">
      {suggestions?.map((suggestion) => {
        return (
          <li key={suggestion} className="mb-1 text-md text-gray-600">
            {suggestion}
          </li>
        );
      })}
    </ul>
  );
};

export default Suggestions;
