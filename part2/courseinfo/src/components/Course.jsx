import Header from "./Header";
import Content from "./Content";

const Course = ({ course }) => {
  const Total = ({ total }) => (
    <p>
      <b>number of exercises {total}</b>
    </p>
  );

  const totalExercises = course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  );

  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={totalExercises} />
    </>
  );
};

export default Course;
