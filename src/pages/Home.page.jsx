import "regenerator-runtime/runtime";
import { useEffect, useState, useRef } from "react";
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Input,
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
  IconBrandWhatsapp,
  IconMicrophoneFilled,
  IconMoon,
  IconPlayerStopFilled,
  IconRestore,
  IconSun,
} from "@tabler/icons-react";
import { ScoreCard } from "../components/ScoreCard";
import { useFullscreen } from "@mantine/hooks";
import Chronometer from "../components/Chronometer";

const TENNIS_SCORES = [0, 15, 30, 40, "A"];
const GAMES_TO_WIN_SET = 6;
const DEUCE_SCORE = 3;

export const HomePage = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { toggle, fullscreen } = useFullscreen();

  const [gameState, setGameState] = useState({
    gameStarted: false,
    lastWinner: "",
    sets: { red: 0, blue: 0 },
    points: { red: 0, blue: 0 },
  });

  const { gameStarted, lastWinner, sets, points } = gameState;
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const chronoRef = useRef();

	const [nosotros, setNosotros] = useState('');
	const [ellos, setEllos] = useState('');

  useEffect(() => {
    if (gameState.gameStarted && chronoRef.current) {
      chronoRef.current.start();
    }
  }, [gameState.gameStarted]);

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
				const finalScore = `${sets.red}-${sets.blue}`;
				return {
					...newState,
					gameStarted: false,
					lastWinner: (player === "red" ? nosotros || "Nosotros" : ellos || "Ellos") + ' ' + finalScore,
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

    // Ensure chronoRef.current exists before calling reset()
    if (chronoRef.current) {
      chronoRef.current.reset();
			chronoRef.current.start();
    } else {
      console.warn("Chronometer is not ready yet!"); // Debugging tip
    }
  };

  const handleGameFinished = (winner) => {
		console.log('winner', winner);
		setGameState((prev) => ({
			...prev,
			gameStarted: false,
			lastWinner: winner === "Finalizado" ? "Finalizado" : (winner === "red" ? (nosotros || "Nosotros") : (ellos || "Ellos")),
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
					<>
						<Title order={2} ta="center" c="dimmed">
							🏆 Último ganador: {lastWinner}

							<ActionIcon
								variant="light"
								color="green"
								size="lg"
								radius="xl"
								aria-label="WhatsApp"
								component="a"
								href={`https://api.whatsapp.com/send/?text=${encodeURIComponent(`🏆 Último ganador: ${lastWinner}`)}`}
								target="_blank"
								ml="md">
								<IconBrandWhatsapp style={{ width: '70%', height: '70%' }} stroke={1.5} />
							</ActionIcon>
						</Title>
					</>
        )}
        <Container size="xs">

					<Input.Wrapper label="Nosotros" mb="md">
						<Input
							onChange={(event) => setNosotros(event.currentTarget.value)}
							value={nosotros}
						/>
					</Input.Wrapper>

					<Input.Wrapper label="Ellos" mb="md">
						<Input
							onChange={(event) => setEllos(event.currentTarget.value)}
							value={ellos}
						/>
					</Input.Wrapper>

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
              boxShadow: "rgba(0, 0, 0, 0.2) 2px 2px 2px 0",
            }}
          >
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
          color="gray"
          onClick={handleStartListen}
          rightSection={
            listening ? (
              <IconPlayerStopFilled size={20} />
            ) : (
              <IconMicrophoneFilled size={20} />
            )
          }
        >
          Comando por Voz
        </Button>
        <ActionIcon
          ml="xs"
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
        <ActionIcon
          ml="xs"
          variant="subtle"
          aria-label="Listen"
          color="gray"
          size="lg"
          onClick={toggle}
        >
          {fullscreen ? (
            <IconArrowsMinimize size={20} />
          ) : (
            <IconArrowsMaximize size={20} />
          )}
        </ActionIcon>
      </Flex>

      <Grid mb="md">
        <Grid.Col span={6}>
          <ScoreCard
            title={nosotros ? nosotros : 'Nosotros'}
            set={sets.red}
            point={TENNIS_SCORES[points.red]}
            onPointScored={() => handlePointScored("red")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <ScoreCard
            title={ellos ? ellos : 'Ellos'}
            set={sets.blue}
            point={TENNIS_SCORES[points.blue]}
            onPointScored={() => handlePointScored("blue")}
          />
        </Grid.Col>
      </Grid>

      <Flex justify="center">
        <Group>
          <Chronometer ref={chronoRef} />
          <Button
            leftSection={<IconRestore size={15} />}
            variant="default"
            onClick={handleGameRestart}
          >
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
