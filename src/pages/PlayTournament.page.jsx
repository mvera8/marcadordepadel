import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Card,
  Badge,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { IconPlayerPlay, IconTrophy } from "@tabler/icons-react";

export const PlayTournamentPage = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem(tournamentId);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setTournament(parsed);
      } catch (e) {
        console.error("Error al cargar torneo:", e);
      }
    }
  }, [tournamentId]);

  const handlePlayMatch = (matchIndex) => {
    // Lógica simple para simular resultado
    const updated = { ...tournament };
    const match = updated.matches[matchIndex];
    match.result = {
      winner: Math.random() > 0.5 ? match.teamA : match.teamB,
      score: "6-4", // podés randomizar si querés
    };
    setTournament(updated);
    localStorage.setItem(tournamentId, JSON.stringify(updated));
  };

  if (!tournament) {
    return (
      <Container>
        <Text ta="center" c="dimmed">
          Cargando torneo...
        </Text>
      </Container>
    );
  }

  return (
    <Container>
      <Title order={2} ta="center" my="xl">
        Torneo: {tournament.name}
      </Title>

      <Text ta="center" mb="lg">
        Equipos: {tournament.teams.length} | Partidos: {tournament.matches.length}
      </Text>

      <Stack>
        {tournament.matches.map((match, index) => (
          <Card key={index} shadow="sm" padding="md" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>
                {match.teamA} vs {match.teamB}
              </Text>

              {match.result ? (
                <Badge color="green" variant="light">
                  Ganó {match.result.winner}
                </Badge>
              ) : (
                <Badge color="gray" variant="light">
                  Pendiente
                </Badge>
              )}
            </Group>

            {match.result ? (
              <Text size="sm" c="dimmed">
                Resultado: {match.result.score}
              </Text>
            ) : (
              <Button
                leftSection={<IconPlayerPlay size={18} />}
                onClick={() => handlePlayMatch(index)}
              >
                Jugar Partido
              </Button>
            )}
          </Card>
        ))}
      </Stack>

      {tournament.matches.every((m) => m.result) && (
        <Button
          fullWidth
          mt="xl"
          color="teal"
          leftSection={<IconTrophy size={20} />}
          onClick={() => {
            const scores = {};
            tournament.matches.forEach((m) => {
              scores[m.result.winner] = (scores[m.result.winner] || 0) + 1;
            });

            const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
            const [winner, wins] = sorted[0];

            alert(`🏆 ¡Ganador del torneo: ${winner} con ${wins} victorias!`);
          }}
        >
          Ver Ganador del Torneo
        </Button>
      )}
    </Container>
  );
};
