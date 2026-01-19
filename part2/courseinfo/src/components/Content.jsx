import Part from "./Part.jsx";

const Content = (props) => (
  <div>
    {props.parts.map((part, i) => (
      <Part key={i} part={part} />
    ))}
  </div>
);

export default Content;
