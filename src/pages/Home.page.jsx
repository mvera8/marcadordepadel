import 'regenerator-runtime/runtime'
import { useEffect, useState } from 'react';
import { ActionIcon, Button, Container, Divider, Flex, Grid, Group, Text, Title, UnstyledButton } from '@mantine/core';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { IconBallTennis, IconMicrophoneFilled, IconPlayerStopFilled } from '@tabler/icons-react';
import classes from './Home.module.css';


// Tennis scoring constants
const TENNIS_SCORES = [0, 15, 30, 40, 'A'];
const GAMES_TO_WIN_SET = 6;
const DEUCE_SCORE = 3; // Index 3 corresponds to 40 in TENNIS_SCORES

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
        if (!listening) {
            // Check if the recognized transcript contains a command
            const transcriptLower = transcript.toLowerCase();
            
            if (transcriptLower.includes("red") && transcriptLower.includes("point")) {
                handlePointScored('red');
                resetTranscript();
            }
            if (transcriptLower.includes("blue") && transcriptLower.includes("point")) {
                handlePointScored('blue');
                resetTranscript();
            }
            if (transcriptLower.includes("reset")) {
                handleGameRestart();
                resetTranscript();
            }
            if (transcriptLower.includes("finish")) {
                handleGameFinished('No Winner');
                resetTranscript();
            }
        }
    }, [transcript, listening, resetTranscript]);

    // Handle point scored logic
    const handlePointScored = (player) => {
        const opponent = player === 'red' ? 'blue' : 'red';
        
        setGameState(prevState => {
            const newState = { ...prevState };
            const playerPoints = prevState.points[player];
            const opponentPoints = prevState.points[opponent];
            
            // If opponent has advantage and player scores a point
            if (opponentPoints === DEUCE_SCORE + 1) {
                // Return to deuce
                newState.points = { red: DEUCE_SCORE, blue: DEUCE_SCORE };
                return newState;
            }
            
            // Deuce scenario (40-40)
            if (playerPoints === DEUCE_SCORE && opponentPoints === DEUCE_SCORE) {
                // Player gets advantage
                newState.points[player] = DEUCE_SCORE + 1;
            } 
            // Player has advantage
            else if (playerPoints === DEUCE_SCORE + 1) {
                // Player wins the game
                newState.sets[player] += 1;
                newState.points = { red: 0, blue: 0 };
            }
            // Player at 40, opponent less than 40
            else if (playerPoints === DEUCE_SCORE && opponentPoints < DEUCE_SCORE) {
                // Player wins the game
                newState.sets[player] += 1;
                newState.points = { red: 0, blue: 0 };
            } 
            // Normal point increment
            else {
                newState.points[player] += 1;
            }
            
            // Check if the set is complete
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
            SpeechRecognition.startListening();
        }
    };

		// Show other thing if browserSupportsSpeechRecognition is not supported
		if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
			return <p>Your browser does not support speech recognition.</p>;
		}

    // Game not started view
    if (!gameStarted) {
			return (
				<Container>
						{lastWinner && <Title order={1}>Último ganador: {lastWinner}</Title>}
						<Text mb="md">Comenzar Juego?</Text>
						<Button
							rightSection={<IconBallTennis size={20} />}
							variant="filled"
							size="lg"
							onClick={handleGameStart}>Empezar</Button>
				</Container>
			);
    }

    // Game in progress view
    return (
        <Container>
            <Flex justify="flex-end" align="center" pb="xs">
								Comando por Voz
                <ActionIcon
									ml="xs"
									variant="subtle"
									color={listening ? "red" : "green"}
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

						<Divider mb="md" />

            <Grid>
                <Grid.Col span={6}>
                    <UnstyledButton
											className={classes.redButton}
											onClick={() => handlePointScored('red')}>
												<Title order={2} mb="md">Team Red</Title>
												<Text size="md">Set: {sets.red}</Text>
												<Text size="xl" fw={700}>{TENNIS_SCORES[points.red]}</Text>
										</UnstyledButton>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text size="xl">Blue Set: {sets.blue}</Text>
                    <Text size="xl">Blue Score: {TENNIS_SCORES[points.blue]}</Text>
                    <Group justify="center">
                        <Button onClick={() => handlePointScored('blue')}>
                            Increment
                        </Button>
                    </Group>
                </Grid.Col>
            </Grid>

            <Flex justify="center">
                <Button variant="subtle" color="green" onClick={handleGameRestart}>Restart</Button>
                <Button variant="subtle" color="green" onClick={() => handleGameFinished('No Winner')}>Finish</Button>
            </Flex>
        </Container>
    );
};