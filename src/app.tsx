import React, { useState } from "react";
import { Text, Box, useInput } from "ink";

interface Todo {
	id: number;
	text: string;
	done: boolean;
}

let idConst = 0;

const App = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [input, setInput] = useState("");
	const [pos, setPos] = useState(0);
	const [mode, setMode] = useState("normal");

	useInput((letter, key) => {
		if (mode === "normal") {
			if (
				letter === "i" ||
				letter === "I" ||
				letter === "a" ||
				letter === "A"
			) {
				setMode("insert");
			} else if (letter === "j" || letter === "J") {
				setPos((e) => {
					if (e < todos.length - 1) return e + 1;
					return e;
				});
			} else if (letter === "k" || letter === "K") {
				setPos((e) => {
					if (e > 0) return e - 1;
					return e;
				});
			} else if (letter === "x" || letter === "X") {
				setTodos((e) => {
					const newTodos = [...e];
					newTodos.splice(pos, 1);

					if (pos > newTodos.length - 1 && newTodos.length > 0) {
						setPos(newTodos.length - 1);
					}

					return [...newTodos];
				});
			} else if (key.return) {
				setTodos((e) => {
					const newTodos = [...e];
					if (newTodos[pos])
						newTodos[pos]!.done = !newTodos[pos]!.done;
					return [...newTodos];
				});
			}
		} else if (mode === "insert") {
			if (key.backspace || key.delete) {
				setInput((e) => e.slice(0, -1));
			} else if (key.return) {
				setTodos((e) => [...e, { text: input, done: false, id: idConst++ }]);
				setInput("");
			} else if (key.escape) {
				setMode("normal");
			} else {
				setInput((e) => `${e}${letter}`);
			}
		}
	});

	return (
		<Box flexDirection="column" alignItems="center" justifyContent="center">
			<Box flexDirection="column" alignItems="flex-start">
				<Box
					marginTop={2}
					marginBottom={1}
					paddingX={1}
					borderStyle="round"
					minWidth={30}
					borderColor={mode === "insert" ? "#ffffff" : "#4b5563"}
				>
					<Text>
						INPUT: <Text color="green">{input}</Text>
					</Text>
				</Box>

				{todos.length > 0 ? (
					todos.map((todo, idx) => (
						<Box key={todo.id} width="full">
							<Text
								backgroundColor={
									idx === pos && mode === "normal" ? "#111827" : undefined
								}
								color={idx === pos && mode === "normal" ? "#ffffff" : "#9ca3af"}
							>
								{todo.done ? "☒" : "☐"} {todo.text}
							</Text>
						</Box>
					))
				) : (
					<Text>No todos yet.</Text>
				)}
			</Box>
		</Box>
	);
};

export default App;
