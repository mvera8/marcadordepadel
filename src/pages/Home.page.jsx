import "regenerator-runtime/runtime";
import { useState } from "react";
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { IconBallTennis, IconBrandWhatsapp } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { PlayerInput } from "../components/PlayerInput";
import { HeaderNavbar } from "../components/HeaderNavbar";
import { SiteFooter } from "../components/SiteFooter";

export const HomePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const winner = searchParams.get("winner");
  const result = searchParams.get("result");

  const [nosotros, setNosotros] = useState("");
  const [ellos, setEllos] = useState("");

  const [serve, setServe] = useState("");

  return (
		<>
			<HeaderNavbar />
			<Container>
				<Title order={1} ta="center" my="xl">
					Marcador de Padel
				</Title>
				{winner && (
					<>
						<Title order={2} ta="center" c="dimmed">
							🏆 Último ganador: {winner} {result.length > 0 && result}
							{result.length > 0 && (
								<ActionIcon
									variant="light"
									color="green"
									size="lg"
									radius="xl"
									aria-label="WhatsApp"
									component="a"
									href={`https://api.whatsapp.com/send/?text=${encodeURIComponent(
										`🏆 Último ganador: ${winner}`
									)}`}
									target="_blank"
									ml="md"
								>
									<IconBrandWhatsapp
										style={{ width: "70%", height: "70%" }}
										stroke={1.5}
									/>
								</ActionIcon>
							)}
						</Title>
					</>
				)}

				<Container size="xs" pb="xl">
					<PlayerInput
						label="Nosotros"
						value={nosotros}
						onChange={setNosotros}
						checked={serve === "nosotros"}
						onServeSelect={() => setServe("nosotros")}
					/>
					<PlayerInput
						label="Ellos"
						value={ellos}
						onChange={setEllos}
						checked={serve === "ellos"}
						onServeSelect={() => setServe("ellos")}
					/>

					<Text ta="center" mb="md">
						Comenzar Juego?
					</Text>

					<Group justify="center">
						<Button
							rightSection={<IconBallTennis size={20} />}
							variant="filled"
							color="yellow"
							radius="xl"
							size="lg"
							component="a"
							href={`/match?nosotros=${encodeURIComponent(
								nosotros
							)}&ellos=${encodeURIComponent(ellos)}&serve=${serve}`}
							style={{
								boxShadow: "rgba(0, 0, 0, 0.2) 2px 2px 2px 0",
							}}
						>
							Empezar
						</Button>
						<Button
							variant="default"
							radius="xl"
							size="lg"
							component="a"
							href="/create-tournament"
						>
							Crear Torneo
						</Button>
					</Group>
				</Container>
			</Container>
			<SiteFooter />
		</>
  );
};
