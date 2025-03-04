import "regenerator-runtime/runtime";
import { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Text,
  Title,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
	IconArrowsMaximize,
  IconArrowsMinimize,
  IconBallTennis,
  IconMicrophoneFilled,
  IconMoon,
  IconPlayerStopFilled,
	IconRestore,
	IconSun,
} from "@tabler/icons-react";
import { ScoreCard } from "../components/ScoreCard";
import { useFullscreen } from "@mantine/hooks";

// cb37cbc5-fddf-472d-b05d-8f30c2abbfa4

const TENNIS_SCORES = [0, 15, 30, 40, "A"];
const GAMES_TO_WIN_SET = 6;
const DEUCE_SCORE = 3;

export const HomePage = () => {
	const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

	const { toggle, fullscreen } = useFullscreen();

  const [gameState, setGameState] = useState({
    gameStarted: false,
    lastWinner: "",
    sets: { red: 0, blue: 0 },
    points: { red: 0, blue: 0 },
  });

  const { gameStarted, lastWinner, sets, points } = gameState;
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!gameStarted) return;
    const transcriptLower = transcript.toLowerCase();
    console.log("transcription:", transcriptLower);

    if (transcriptLower.includes("nosotros")) {
      handlePointScored("red");
      resetTranscript();
    }
    if (transcriptLower.includes("ellos")) {
      handlePointScored("blue");
      resetTranscript();
    }
    if (transcriptLower.includes("reset")) {
      handleGameRestart();
      resetTranscript();
    }
    if (transcriptLower.includes("fin")) {
      handleGameFinished("No Winner");
      resetTranscript();
    }
  }, [transcript, gameStarted]);

  const handlePointScored = (player) => {
    const opponent = player === "red" ? "blue" : "red";
    setGameState((prevState) => {
      const newState = { ...prevState };
      const playerPoints = prevState.points[player];
      const opponentPoints = prevState.points[opponent];

      if (opponentPoints === DEUCE_SCORE + 1) {
        newState.points = { red: DEUCE_SCORE, blue: DEUCE_SCORE };
        return newState;
      }
      if (playerPoints === DEUCE_SCORE && opponentPoints === DEUCE_SCORE) {
        newState.points[player] = DEUCE_SCORE + 1;
      } else if (playerPoints === DEUCE_SCORE + 1) {
        newState.sets[player] += 1;
        newState.points = { red: 0, blue: 0 };
      } else if (playerPoints === DEUCE_SCORE && opponentPoints < DEUCE_SCORE) {
        newState.sets[player] += 1;
        newState.points = { red: 0, blue: 0 };
      } else {
        newState.points[player] += 1;
      }
      if (newState.sets[player] >= GAMES_TO_WIN_SET) {
        return {
          ...newState,
          gameStarted: false,
          lastWinner: `${
            player.charAt(0).toUpperCase() + player.slice(1)
          } Wins`,
        };
      }
      return newState;
    });
  };

  const handleGameStart = () => {
    setGameState({
      gameStarted: true,
      lastWinner: "",
      sets: { red: 0, blue: 0 },
      points: { red: 0, blue: 0 },
    });
  };

  const handleGameRestart = () => {
    setGameState((prev) => ({
      ...prev,
      sets: { red: 0, blue: 0 },
      points: { red: 0, blue: 0 },
    }));
  };

  const handleGameFinished = (winner) => {
    setGameState((prev) => ({
      ...prev,
      gameStarted: false,
      lastWinner: winner,
    }));
  };

  const handleStartListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  if (!gameStarted) {
    return (
      <Container>
        <Title order={1} ta="center" my="xl">
          Marcador de Padel
        </Title>
        {lastWinner && (
          <Title order={2} ta="center" c="dimmed">
            Último ganador: {lastWinner}
          </Title>
        )}
        <Container size="xs">
          <Text ta="center" mb="md">
            Comenzar Juego?
          </Text>
          <Button
            fullWidth
            rightSection={<IconBallTennis size={20} />}
            variant="filled"
            color="yellow"
            radius="xl"
            size="lg"
            onClick={handleGameStart}
						style={{
							boxShadow: 'rgba(0, 0, 0, 0.2) 2px 2px 2px 0'
						}}>
            Empezar
          </Button>
        </Container>
      </Container>
    );
  }

  return (
    <Container py="xs">
      <Flex justify="flex-end" align="center" pb="xs">
				<Button
        variant="subtle"
				color='gray'
				onClick={handleStartListen}
        rightSection={listening ? (<IconPlayerStopFilled size={20} />) : (<IconMicrophoneFilled size={20} />)}>
					Comando por Voz
				</Button>
				<ActionIcon
					ml="xs"
					variant="subtle"
					aria-label="Listen"
					color='gray'
					size="lg"
					onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}>
					{computedColorScheme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
				</ActionIcon>
				<ActionIcon
					ml="xs"
					variant="subtle"
					aria-label="Listen"
					color='gray'
					size="lg"
					onClick={toggle}>
					{fullscreen ? <IconArrowsMinimize size={20} /> : <IconArrowsMaximize size={20} />}
				</ActionIcon>
      </Flex>

      <Grid mb="md">
        <Grid.Col span={6}>
          <ScoreCard
            title="Nosotros"
            set={sets.red}
            point={TENNIS_SCORES[points.red]}
            onPointScored={() => handlePointScored("red")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <ScoreCard
            title="Ellos"
            set={sets.blue}
            point={TENNIS_SCORES[points.blue]}
            onPointScored={() => handlePointScored("blue")}
          />
        </Grid.Col>
      </Grid>

      <Flex justify="center">
        <Group>
          <Button
						leftSection={<IconRestore size={15} />}
						variant="default"
						onClick={handleGameRestart}>
            Reset
          </Button>
          <Button
            variant="light"
						color="red"
            onClick={() => handleGameFinished("Finalizado")}
          >
            Finalizar
          </Button>
        </Group>
      </Flex>
    </Container>
  );
};
