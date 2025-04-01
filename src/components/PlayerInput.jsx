import { Input, Checkbox, Group } from "@mantine/core";
import { IconBallTennis } from "@tabler/icons-react";
import PropTypes from "prop-types";

export const PlayerInput = ({ label, value, onChange, checked, onServeSelect }) => {
  return (
    <Input.Wrapper label={label} mb="md" id={`input_${label.toLowerCase()}`}>
			<Group justify="space-between">
				<Input
					style={{ width: '80%'}}
					value={value}
					onChange={(e) => onChange(e.currentTarget.value)}
				/>
				<Checkbox
					icon={IconBallTennis}
					label="Saque"
					color="lime"
					checked={checked}
					onChange={onServeSelect}
				/>
			</Group>
		</Input.Wrapper>
	);
};

PlayerInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  onServeSelect: PropTypes.func.isRequired,
};
