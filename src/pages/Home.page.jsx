import 'regenerator-runtime/runtime';
import { useEffect, useState } from 'react';
import { ActionIcon, Button, Container, Flex, Grid, Group, Text, Title } from '@mantine/core';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { IconBallTennis, IconMicrophoneFilled, IconPlayerStopFilled } from '@tabler/icons-react';
import { ScoreCard } from '../components/ScoreCard';

import './Home.module.css';

const TENNIS_SCORES = [0, 15, 30, 40, 'A'];
const GAMES_TO_WIN_SET = 6;
const DEUCE_SCORE = 3;

export const HomePage = () => {
    const [gameState, setGameState] = useState({
        gameStarted: false,
        lastWinner: '',
        sets: { red: 0, blue: 0 },
        points: { red: 0, blue: 0 }
    });

    const { gameStarted, lastWinner, sets, points } = gameState;
		const { transcript, listening, resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        if (!gameStarted) return;
        const transcriptLower = transcript.toLowerCase();
        console.log('transcription:', transcriptLower);

        if (transcriptLower.includes("nosotros")) {
            handlePointScored('red');
            resetTranscript();
        }
        if (transcriptLower.includes("ellos")) {
            handlePointScored('blue');
            resetTranscript();
        }
        if (transcriptLower.includes("reset")) {
            handleGameRestart();
            resetTranscript();
        }
        if (transcriptLower.includes("fin")) {
            handleGameFinished('No Winner');
            resetTranscript();
        }
    }, [transcript, gameStarted]);

    const handlePointScored = (player) => {
        const opponent = player === 'red' ? 'blue' : 'red';
        setGameState(prevState => {
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
                    lastWinner: `${player.charAt(0).toUpperCase() + player.slice(1)} Wins`
                };
            }
            return newState;
        });
    };

    const handleGameStart = () => {
        setGameState({
            gameStarted: true,
            lastWinner: '',
            sets: { red: 0, blue: 0 },
            points: { red: 0, blue: 0 }
        });
    };

    const handleGameRestart = () => {
        setGameState(prev => ({
            ...prev,
            sets: { red: 0, blue: 0 },
            points: { red: 0, blue: 0 }
        }));
    };

    const handleGameFinished = (winner) => {
        setGameState(prev => ({
            ...prev,
            gameStarted: false,
            lastWinner: winner
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
                <Title c="white" order={1} ta="center" my="xl">Marcador de Padel</Title>
                {lastWinner && <Title order={2} ta="center" c="dimmed">Último ganador: {lastWinner}</Title>}
                <Container size="xs">
                    <Text c="white" ta="center" mb="md">Comenzar Juego?</Text>
                    <Button
                        fullWidth
                        rightSection={<IconBallTennis size={20} />}
                        variant="white"
                        color="gray"
                        radius="xl"
                        size="lg"
                        onClick={handleGameStart}>
                        Empezar
                    </Button>
                </Container>
            </Container>
        );
    }

    return (
        <Container>
						<Flex justify="flex-end" align="center" pb={0}>
								Comando por Voz
                <ActionIcon
									ml="xs"
									variant="subtle"
									color={listening ? "red" : "white"}
									aria-label="Listen"
									size="lg"
									onClick={handleStartListen}>
									{listening ? (
											<IconPlayerStopFilled size={15} stroke={1.5} />
									) : (
											<IconMicrophoneFilled size={15} stroke={1.5} />
									)}
                </ActionIcon>
            </Flex>

            <Grid mb="md">
                <Grid.Col span={6}>
                    <ScoreCard title="Nosotros" set={sets.red} point={TENNIS_SCORES[points.red]} onPointScored={() => handlePointScored('red')} />
                </Grid.Col>
                <Grid.Col span={6}>
                    <ScoreCard title="Ellos" set={sets.blue} point={TENNIS_SCORES[points.blue]} onPointScored={() => handlePointScored('blue')} />
                </Grid.Col>
            </Grid>

            <Flex justify="center">
							<Group>
								<Button variant="default" onClick={handleGameRestart}>Reset</Button>
                <Button variant="default" onClick={() => handleGameFinished('Finalizado')}>Finalizar</Button>
							</Group>
            </Flex>
        </Container>
    );
};