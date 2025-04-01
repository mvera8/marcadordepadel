import { Box, Card, Center, Text, ThemeIcon, Title, UnstyledButton } from "@mantine/core";
import PropTypes from "prop-types";
import classes from "./ScoreCard.module.css";
import { IconBallTennis, IconMusic } from "@tabler/icons-react";

export const ScoreCard = ({ title, set, point, onPointScored, commandVoice, serve }) => {
  return (
    <Card shadow="sm">
      <UnstyledButton
				style={{ position: 'relative'}}
        className={classes.redButton}
        onClick={onPointScored} // Use the passed function
      >
        <Title order={3} ta="center" mb={0} style={{ lineHeight: 1 }}>
          {title}	
        </Title>

				<Center>
					(<Text span mb={0}>
						{commandVoice}
					</Text>	
					<ThemeIcon variant="transparent" color="dimmed">
						<IconMusic size={15} />
					</ThemeIcon>)
				</Center>

        <Title order={2} ta="center" mb={-25}>
          Set: {set}
        </Title>
        <Title order={1} ta="center" size={150} fw={700}>
          {point}
        </Title>

				{serve &&
					<Box
						style={{ position: 'absolute', right: 0, bottom: 0 }}>
						<ThemeIcon variant="light" radius="xl" size="xl" color="lime">
							<IconBallTennis size={30} />
						</ThemeIcon>
					</Box>
				}
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
	serve: PropTypes.bool,
};
