import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Stack,
  Badge,
  Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconBallTennis } from "@tabler/icons-react";

export const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loaded = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("torneo-")) {
        try {
          const torneo = JSON.parse(localStorage.getItem(key));
          loaded.push(torneo);
        } catch (e) {
          console.warn(`No se pudo parsear el torneo con key ${key}`);
        }
      }
    }

    // Ordenar por fecha de creación descendente
    loaded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setTournaments(loaded);
  }, []);

  return (
    <Container>
      <Title order={2} ta="center" my="xl">
        Torneos Guardados
      </Title>

      {tournaments.length === 0 ? (
        <Text ta="center" c="dimmed">
          No hay torneos guardados. 😢
        </Text>
      ) : (
        <Stack>
          {tournaments.map((t) => (
            <Card key={t.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{t.name}</Text>
                <Badge color="green" variant="light">
                  {t.teams.length} equipos
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                Creado el {new Date(t.createdAt).toLocaleDateString()}
              </Text>

              <Button
                mt="md"
                leftSection={<IconBallTennis size={18} />}
                onClick={() => navigate(`/tournament/${t.id}`)}
              >
                Ver Torneo
              </Button>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};
