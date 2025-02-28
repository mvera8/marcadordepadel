import { Card, Title, UnstyledButton } from "@mantine/core";
import PropTypes from "prop-types";
import classes from "./ScoreCard.module.css";

export const ScoreCard = ({ title, set, point, onPointScored }) => {
  return (
    <Card shadow="sm">
      <UnstyledButton
        className={classes.redButton}
        onClick={onPointScored} // Use the passed function
      >
        <Title order={2} c="black" ta="center" mb={0}>
          {title}
        </Title>
        <Title order={3} c="black" ta="center" mb={0}>
          Set: {set}
        </Title>
        <Title order={1} c="black" ta="center" size={80} fw={700}>
          {point}
        </Title>
      </UnstyledButton>
    </Card>
  );
};

ScoreCard.propTypes = {
  title: PropTypes.string.isRequired,
  set: PropTypes.number.isRequired, // Should be number, not string
  point: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Can be number or string (for "A")
  onPointScored: PropTypes.func.isRequired, // Ensure function is required
};
