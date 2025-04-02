import { ActionIcon, Container, Divider, Group } from '@mantine/core'
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react'
import React from 'react'

export const SiteFooter = () => {
	return (
		<>
			<Divider mt="xl" />
			<Container size="md" py="xl">
				<Group gap={5} visibleFrom="xs" justify="space-between">
					<div>LOGO</div>
					<Group gap={0} justify="flex-end" wrap="nowrap">
						<ActionIcon size="lg" color="gray" variant="subtle">
							<IconBrandInstagram size={18} stroke={1.5} />
						</ActionIcon>
					</Group>
				</Group>
			</Container>
		</>
	)
}
