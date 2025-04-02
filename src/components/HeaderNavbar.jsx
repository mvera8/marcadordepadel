import { Burger, Button, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBallTennis } from '@tabler/icons-react';
import { ButtonColor } from './ButtonColor';

const links = [
  { link: '/about', label: 'About' },
  { link: '/privacy', label: 'Privacy' },
  { link: '/blog', label: 'Blog' },
];

export const HeaderNavbar = () => {
	const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <Button
      key={link.label}
			variant="subtle"
			color="teal"
			component='a'
      href={link.link}
    >
      {link.label}
    </Button>
  ));

	return (
		<Container size="md" py="xs">
			<Group gap={5} visibleFrom="xs" justify="space-between">
				<div>LOGO</div>
				<Group>
					{items}
					<Button
						rightSection={<IconBallTennis size={20} />}
						variant="filled"
						color="yellow"
						radius="xl"
						component="a"
						href={`/match?nosotros=&ellos=&serve=nosotros`}
						style={{
							boxShadow: "rgba(0, 0, 0, 0.2) 2px 2px 2px 0",
						}}
					>
						Jugar
					</Button>
					<ButtonColor />
				</Group>
			</Group>

			<Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
		</Container>
	)
}
