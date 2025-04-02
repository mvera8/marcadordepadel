import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import React from 'react'

export const ButtonColor = () => {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light", {
		getInitialValueInEffect: true,
	});

	return (
		<ActionIcon
			variant="subtle"
			aria-label="Listen"
			color="gray"
			size="lg"
			onClick={() =>
				setColorScheme(computedColorScheme === "light" ? "dark" : "light")
			}
		>
			{computedColorScheme === "light" ? (
				<IconMoon size={20} />
			) : (
				<IconSun size={20} />
			)}
		</ActionIcon>
	)
}
