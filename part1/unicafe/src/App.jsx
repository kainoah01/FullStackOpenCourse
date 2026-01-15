import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad, total }) => {
  if (total === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine
            text="average"
            value={(good + bad * -1) / total || 0}
          />
          <StatisticLine
            text="positive"
            value={`${(good / total) * 100 || 0} %`}
          />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  const handleGoodClick = () => {
    const updatedGood = good + 1;
    const newTotal = total + 1;

    setGood(updatedGood);
    setTotal(newTotal);
  };
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1;
    const newTotal = total + 1;

    setNeutral(updatedNeutral);
    setTotal(newTotal);
  };
  const handleBadClick = () => {
    const updatedBad = bad + 1;
    const newTotal = total + 1;

    setBad(updatedBad);
    setTotal(newTotal);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  );
};

export default App;
