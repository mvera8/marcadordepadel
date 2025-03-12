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
  IconArrowBackUpDouble,
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
import { useFullscreen, useMediaQuery } from "@mantine/hooks";
import Chronometer from "../components/Chronometer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qlrvithbzdncfhvjulgx.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TENNIS_SCORES = [0, 15, 30, 40, "A"];
const DEUCE_SCORE = 3;

export const HomePage = () => {
  const matches = useMediaQuery("(min-width: 575px)");
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const { toggle, fullscreen } = useFullscreen();

  const [history, setHistory] = useState([]);
  const [gameState, setGameState] = useState({
    gameStarted: false,
    lastWinner: "",
    sets: { red: 0, blue: 0 },
    points: { red: 0, blue: 0 },
  });

  const { gameStarted, lastWinner, sets, points } = gameState;
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const chronoRef = useRef();

  const [nosotros, setNosotros] = useState("");
  const [ellos, setEllos] = useState("");

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
    if (transcriptLower.includes("fin") || transcriptLower.includes("end")) {
      handleGameFinished("No Winner");
      resetTranscript();
    }
    if (
      transcriptLower.includes("atras") ||
      transcriptLower.includes("atrás") ||
      transcriptLower.includes("back")
    ) {
      handleStepBack();
      resetTranscript();
    }
  }, [transcript, gameStarted]);

  const gamesToWinSet = (playerGames, opponentGames) => {
    let minGamesToWin = 6;
    while (
      Math.abs(playerGames - opponentGames) < 2 &&
      playerGames >= minGamesToWin
    ) {
      minGamesToWin++;
    }
    return minGamesToWin;
  };

  const handlePointScored = (player) => {
    setHistory((prevHistory) => [...prevHistory, structuredClone(gameState)]);

    setGameState((prevState) => {
      const opponent = player === "red" ? "blue" : "red";
      const newState = { ...prevState };
      const playerPoints = prevState.points[player];
      const opponentPoints = prevState.points[opponent];

      // Manejo de ventaja en el DEUCE
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

      // Determinar la cantidad de games necesarios para ganar
      const gamesRequired = gamesToWinSet(
        newState.sets[player],
        newState.sets[opponent]
      );

      // Verificar si el jugador alcanzó los games requeridos y tiene diferencia de 2
      if (
        newState.sets[player] >= gamesRequired &&
        newState.sets[player] - newState.sets[opponent] >= 2
      ) {
        const winner =
          player === "red" ? nosotros || "Nosotros" : ellos || "Ellos";
        const loser =
          player === "red" ? ellos || "Ellos" : nosotros || "Nosotros";
        const winnerPoints = newState.sets[player];
        const loserPoints = newState.sets[opponent];

        guardarResultadoEnSupabase(winner, winnerPoints, loser, loserPoints);

        return {
          ...newState,
          gameStarted: false,
          lastWinner: `${winner} ${winnerPoints}-${loserPoints}`,
        };
      }

      return newState;
    });
  };

  // Función para guardar en Supabase
  const guardarResultadoEnSupabase = async (
    winner,
    winnerPoints,
    loser,
    loserPoints
  ) => {
    const { data, error } = await supabase.from("marcadordepadel").insert([
      {
        winner: winner,
        winner_points: winnerPoints,
        loser: loser,
        loser_points: loserPoints,
      },
    ]);

    if (error) {
      console.error("Error al insertar en Supabase:", error.message);
    } else {
      console.log("Marcador guardado en Supabase:", data);
    }
  };

  const handleStepBack = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;

      const previousState = structuredClone(
        prevHistory[prevHistory.length - 1]
      ); // Restaurar copia profunda
      setGameState(previousState); // Forzar actualización

      return prevHistory.slice(0, -1); // Eliminar el último estado guardado
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
    setGameState((prev) => ({
      ...prev,
      gameStarted: false,
      lastWinner:
        winner === "Finalizado"
          ? "Finalizado"
          : winner === "red"
          ? nosotros || "Nosotros"
          : ellos || "Ellos",
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
                href={`https://api.whatsapp.com/send/?text=${encodeURIComponent(
                  `🏆 Último ganador: ${lastWinner}`
                )}`}
                target="_blank"
                ml="md"
              >
                <IconBrandWhatsapp
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Title>
          </>
        )}
        <Container size="xs">
          <Input.Wrapper label="Nosotros" mb="md" id="input_nosotros">
            <Input
              onChange={(event) => setNosotros(event.currentTarget.value)}
              value={nosotros}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Ellos" mb="md" id="input_ellos">
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
            title={nosotros}
            commandVoice="Nosotros"
            set={sets.red}
            point={TENNIS_SCORES[points.red]}
            onPointScored={() => handlePointScored("red")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <ScoreCard
            title={ellos}
            commandVoice="Ellos"
            set={sets.blue}
            point={TENNIS_SCORES[points.blue]}
            onPointScored={() => handlePointScored("blue")}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, xs: 4 }}>
          <Group justify={matches ? "flex-start" : "center"}>
            <Chronometer ref={chronoRef} />
          </Group>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 8 }}>
          <Group justify={matches ? "flex-end" : "center"}>
            <Button
              leftSection={<IconArrowBackUpDouble size={15} />}
              variant="default"
              onClick={handleStepBack}
            >
              Atras
            </Button>
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
        </Grid.Col>
      </Grid>
    </Container>
  );
};
