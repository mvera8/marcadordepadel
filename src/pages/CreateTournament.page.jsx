import { useState } from "react";
import {
  Container,
  Input,
  Title,
  Stepper,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
} from "@mantine/core";
import {
  IconBallTennis,
  IconCheck,
  IconCircleCheck,
  IconCircleDashed,
  IconTrophy,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export const CreateTournamentPage = () => {
  const navigate = useNavigate();

  // Stepper
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  // Tournament state
  const [tournamentName, setTournamentName] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamInput, setTeamInput] = useState("");

  const addTeam = () => {
    const trimmed = teamInput.trim();
    if (trimmed.length >= 3 && !teams.includes(trimmed)) {
      setTeams([...teams, trimmed]);
      setTeamInput("");
    }
  };

  const generateMatches = (teams) => {
    const matches = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({ teamA: teams[i], teamB: teams[j], result: null });
      }
    }
    return matches;
  };

  const saveTournament = () => {
    const tournamentId = `torneo-${Date.now()}`;
    const matches = generateMatches(teams);

    const tournamentData = {
      id: tournamentId,
      name: tournamentName,
      teams,
      matches,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(tournamentId, JSON.stringify(tournamentData));
    navigate(`/tournament/${tournamentId}`);
  };

  return (
    <Container size="xs">
      <Title order={1} ta="center" my="xl">
        Crear Torneo de Padel
      </Title>

      <Stepper
        completedIcon={<IconCheck size={18} />}
        iconSize={42}
        active={active}
        onStepClick={setActive}
      >
        <Stepper.Step icon={<IconTrophy size={18} />}>
          <Input.Wrapper label="Nombre del Torneo" mb="md" id="input_tournament">
            <Input
              placeholder="Ej: Copa Padel 2025"
              onChange={(e) => setTournamentName(e.currentTarget.value)}
              value={tournamentName}
            />
          </Input.Wrapper>
        </Stepper.Step>

        <Stepper.Step icon={<IconUsers size={18} />}>
          <List
            spacing="xs"
            size="sm"
            mb="md"
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck size={16} />
              </ThemeIcon>
            }
          >
            {teams.map((team, i) => (
              <List.Item key={i}>{team}</List.Item>
            ))}
            {teams.length < 4 && (
              <List.Item
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCircleDashed size={16} />
                  </ThemeIcon>
                }
              >
                Añadir al menos 4 parejas
              </List.Item>
            )}
          </List>

          <Group>
            <Input
              placeholder="Nombre de la pareja o equipo"
              onChange={(e) => setTeamInput(e.currentTarget.value)}
              value={teamInput}
              onKeyDown={(e) => e.key === "Enter" && addTeam()}
            />
            <Button onClick={addTeam}>Agregar</Button>
          </Group>
        </Stepper.Step>

        <Stepper.Step icon={<IconBallTennis size={18} />}>
          <Text mb="md">
            ¡Listo! El torneo <strong>{tournamentName}</strong> está por comenzar con{" "}
            {teams.length} parejas.
          </Text>

          <Button
            fullWidth
            onClick={saveTournament}
            disabled={teams.length < 4 || tournamentName.length < 3}
            leftSection={<IconUserCheck size={18} />}
          >
            Empezar Torneo
          </Button>
        </Stepper.Step>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep} disabled={active === 0}>
          Atrás
        </Button>
        {active < 2 && (
          <Button
            onClick={nextStep}
            disabled={(active === 0 && tournamentName.length < 3) || (active === 1 && teams.length < 4)}
          >
            Siguiente
          </Button>
        )}
      </Group>
    </Container>
  );
};
