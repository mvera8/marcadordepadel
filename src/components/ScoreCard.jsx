import { Card, Text, Title, UnstyledButton } from "@mantine/core";
import PropTypes from "prop-types";
import classes from "./ScoreCard.module.css";

export const ScoreCard = ({ title, set, point, onPointScored, commandVoice }) => {
  return (
    <Card shadow="sm">
      <UnstyledButton
        className={classes.redButton}
        onClick={onPointScored} // Use the passed function
      >
        <Title order={3} ta="center" mb={0} style={{ lineHeight: 1 }}>
          {title}
					<Text c="dimmed" mb={0}>({commandVoice})</Text>					
        </Title>
        <Title order={2} ta="center" mb={-25}>
          Set: {set}
        </Title>
        <Title order={1} ta="center" size={150} fw={700}>
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
	commandVoice: PropTypes.string.isRequired,
};
